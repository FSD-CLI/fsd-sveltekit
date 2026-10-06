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
        Number.isFinite(deadline.getTime()) && now <= deadline;
    }));
    // SvelteKit's aggregate is accepted only when cookie is independently accepted.
    const aggregate = finding.name === '@sveltejs/kit' && finding.severity === 'low' &&
      inherited.length === 1 && inherited[0] === 'cookie' &&
      report.vulnerabilities.cookie && !direct.length;
    if (matches && !inherited.length && direct.length) accepted.push(finding.name);
    else if (!aggregate) errors.push(`${finding.name}: ${finding.severity} finding is not covered by an active exception`);
  }
  const aggregate = report.vulnerabilities['@sveltejs/kit'];
  if (aggregate && !errors.some((error) => error.startsWith('@sveltejs/kit:')) &&
      !accepted.includes('cookie')) errors.push('@sveltejs/kit: cookie exception is absent or expired');
  if (errors.length) throw new Error(errors.join('\n'));
  return { accepted, counts: report.metadata.vulnerabilities };
}
