export function validateAudit(report, policy, now = new Date()) {
  if (!report || report.error || !report.vulnerabilities || !report.metadata?.vulnerabilities) {
    throw new Error('Audit did not return a complete vulnerability report.');
  }
  if (policy.version !== 1 || !Array.isArray(policy.exceptions)) {
    throw new Error('Invalid audit exception policy.');
  }
  const counts = report.metadata.vulnerabilities;
  const entries = Object.entries(report.vulnerabilities);
  const severities = ['info', 'low', 'moderate', 'high', 'critical'];
  if (!Number.isInteger(counts.total) || counts.total !== entries.length ||
      entries.some(([key, finding]) => key !== finding.name || !severities.includes(finding.severity)) ||
      severities.some((severity) => (counts[severity] ?? 0) !== entries.filter(([, finding]) => finding.severity === severity).length)) {
    throw new Error('Audit counts or finding schema are inconsistent.');
  }
  const errors = [];
  const accepted = [];
  const pendingAggregates = [];
  const aggregateDependencies = {
    '@sveltejs/kit': 'cookie',
    'sveltekit-superforms': '@sveltejs/kit',
  };
  for (const finding of Object.values(report.vulnerabilities)) {
    const details = finding.via;
    if (!Array.isArray(details) || !details.length) {
      errors.push(`${finding.name}: missing advisory details`);
      continue;
    }
    const direct = details.filter((item) => typeof item === 'object');
    const inherited = details.filter((item) => typeof item === 'string');
    const matches = direct.every((item) => policy.exceptions.some((exception) => {
      const deadline = new Date(`${exception.reviewBy}T23:59:59.999Z`);
      return exception.package === finding.name && exception.severity === finding.severity &&
        item.severity === exception.severity && item.url === exception.url &&
        exception.owner?.trim() && exception.reason?.trim() && exception.control?.trim() &&
        Number.isFinite(deadline.getTime()) &&
        deadline.toISOString().slice(0, 10) === exception.reviewBy && now <= deadline;
    }));
    // Accept only the explicit low-severity chain, after its dependency is accepted.
    const dependency = aggregateDependencies[finding.name];
    const aggregate = dependency && finding.severity === 'low' &&
      inherited.length === 1 && inherited[0] === dependency && !direct.length;
    if (matches && !inherited.length && direct.length) accepted.push(finding.name);
    else if (aggregate) pendingAggregates.push({ name: finding.name, dependency });
    else if (!aggregate) errors.push(`${finding.name}: ${finding.severity} finding is not covered by an active exception`);
  }
  const resolved = new Set(accepted);
  let progressed = true;
  while (progressed) {
    progressed = false;
    for (const aggregate of pendingAggregates) {
      if (!resolved.has(aggregate.name) && resolved.has(aggregate.dependency)) {
        resolved.add(aggregate.name);
        progressed = true;
      }
    }
  }
  for (const aggregate of pendingAggregates) {
    if (!resolved.has(aggregate.name)) errors.push(`${aggregate.name}: dependency exception is absent or expired`);
  }
  if (errors.length) throw new Error(errors.join('\n'));
  return { accepted, counts: report.metadata.vulnerabilities };
}
