import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { validateAudit } from '../scripts/audit-policy.mjs';

const policy = JSON.parse(fs.readFileSync(new URL('../security/audit-exceptions.json', import.meta.url), 'utf8'));
const now = new Date('2026-10-29T00:00:00Z');
const url = 'https://github.com/advisories/GHSA-test-high';
// A fixture policy proves exception handling without approving anything real.
const withException = {
  ...policy,
  exceptions: [{
    advisory: 'GHSA-test-high', url, package: 'pkg', severity: 'high', dependents: ['wrapper'],
    owner: 'maintainers', reviewBy: '2026-11-29', reason: 'fixture', control: 'fixture',
  }],
};
const finding = (name, severity, via) => ({ name, severity, via });
const report = (findings) => ({
  vulnerabilities: Object.fromEntries(findings.map((item) => [item.name, item])),
  metadata: {
    vulnerabilities: {
      total: findings.length,
      ...Object.fromEntries(['info', 'low', 'moderate', 'high', 'critical'].map((s) => [s, findings.filter((f) => f.severity === s).length])),
    },
  },
});

test('the checked-in policy gates high and critical with no active exceptions', () => {
  assert.equal(policy.gate, 'high');
  assert.deepEqual(policy.exceptions, []);
});

test('low findings below the gate are reported, not failed', () => {
  const result = validateAudit(report([finding('cookie', 'low', [{ severity: 'low', url: 'https://github.com/advisories/GHSA-pxg6-pf52-xh8x' }]), finding('@sveltejs/kit', 'low', ['cookie'])]), policy, now);
  assert.deepEqual(result.accepted, []);
  assert.deepEqual(result.reported, ['cookie (low)', '@sveltejs/kit (low)']);
});

test('any high finding fails without an exception', () => {
  assert.throws(() => validateAudit(report([finding('vite', 'high', [{ severity: 'high', url }])]), policy, now), /vite: high/);
});

test('an exception covers its advisory and named dependent until review', () => {
  const value = report([finding('pkg', 'high', [{ severity: 'high', url }]), finding('wrapper', 'high', ['pkg'])]);
  assert.deepEqual(validateAudit(value, withException, now).accepted, ['pkg', 'wrapper']);
  assert.throws(() => validateAudit(value, withException, new Date('2026-11-30T00:00:00Z')), /not covered/);
});

test('exceptions do not cover new advisories, other dependents or critical severity', () => {
  assert.throws(() => validateAudit(report([finding('pkg', 'high', [{ severity: 'high', url }, { severity: 'high', url: 'https://github.com/advisories/new' }])]), withException, now), /pkg: high/);
  assert.throws(() => validateAudit(report([finding('pkg', 'high', [{ severity: 'high', url }]), finding('other', 'high', ['pkg'])]), withException, now), /other: high/);
  assert.throws(() => validateAudit(report([finding('pkg', 'critical', [{ severity: 'critical', url }])]), withException, now), /not covered/);
});

test('registry failures and inconsistent counts are not a clean audit', () => {
  assert.throws(() => validateAudit({ error: { message: 'offline' } }, policy, now), /complete/);
  const value = report([finding('cookie', 'low', [{ severity: 'low', url }])]);
  value.metadata.vulnerabilities.high = 1;
  assert.throws(() => validateAudit(value, policy, now), /inconsistent/);
});

test('invalid calendar review dates cannot extend an exception', () => {
  const invalid = structuredClone(withException);
  invalid.exceptions[0].reviewBy = '2026-11-31';
  assert.throws(() => validateAudit(report([finding('pkg', 'high', [{ severity: 'high', url }])]), invalid, now), /not covered/);
});
