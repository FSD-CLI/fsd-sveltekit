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
