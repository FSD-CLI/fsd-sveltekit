import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import { validateAudit } from '../scripts/audit-policy.mjs';
const policy = JSON.parse(fs.readFileSync(new URL('../security/audit-exceptions.json', import.meta.url), 'utf8'));
const report = () => ({ vulnerabilities: {
  cookie: { name: 'cookie', severity: 'low', via: [{severity: 'low', url: policy.exceptions[0].url}] },
  '@sveltejs/kit': { name: '@sveltejs/kit', severity: 'low', via: ['cookie'] },
}, metadata: { vulnerabilities: { low: 2, high: 0, critical: 0, total: 2 } } });
const now = new Date('2026-10-06T00:00:00Z');
test('known low advisory and its aggregate are accepted until review', () => {
  assert.deepEqual(validateAudit(report(), policy, now).accepted, ['cookie']);
});
test('exception expires and cannot keep accepting the aggregate', () => {
  assert.throws(() => validateAudit(report(), policy, new Date('2026-11-07T00:00:00Z')), /expired|not covered/);
});
test('new advisory on the same package fails closed', () => {
  const value = report(); value.vulnerabilities.cookie.via.push({severity: 'low', url: 'https://github.com/advisories/new'});
  assert.throws(() => validateAudit(value, policy, now), /not covered/);
});
test('elevated severity cannot use a low exception', () => {
  const value = report(); value.vulnerabilities.cookie.severity = 'high'; value.metadata.vulnerabilities.low = 1; value.metadata.vulnerabilities.high = 1;
  assert.throws(() => validateAudit(value, policy, now), /not covered/);
});
test('registry failures are not mistaken for a clean audit', () => {
  assert.throws(() => validateAudit({error: {message:'offline'}}, policy, now), /complete/);
});
test('a fixed dependency tree passes without keeping an unused exception active', () => {
  assert.deepEqual(validateAudit({vulnerabilities:{},metadata:{vulnerabilities:{total:0}}}, policy, new Date('2030-01-01')).accepted, []);
});

test('an incomplete finding list cannot hide a high metadata count', () => {
  const value = report(); value.metadata.vulnerabilities.high = 1;
  assert.throws(() => validateAudit(value, policy, now), /inconsistent/);
});

test('Superforms inherits only the independently accepted SvelteKit cookie chain', () => {
  const value = report();
  value.vulnerabilities['sveltekit-superforms'] = {name:'sveltekit-superforms',severity:'low',via:['@sveltejs/kit']};
  value.metadata.vulnerabilities.low = 3; value.metadata.vulnerabilities.total = 3;
  assert.deepEqual(validateAudit(value, policy, now).accepted, ['cookie']);
  assert.throws(() => validateAudit(value, policy, new Date('2026-11-07')), /expired|not covered/);
  value.vulnerabilities['sveltekit-superforms'].via.push({severity:'low',url:'https://github.com/advisories/new'});
  assert.throws(() => validateAudit(value, policy, now), /not covered/);
});

test('invalid calendar review dates cannot extend an exception', () => {
  const invalid = structuredClone(policy); invalid.exceptions[0].reviewBy = '2026-11-31';
  assert.throws(() => validateAudit(report(), invalid, now), /not covered/);
});
