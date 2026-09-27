import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const release = readFileSync(new URL('../../workflows/release.yml', import.meta.url), 'utf8').replaceAll('\r\n', '\n');
const jobs = [...release.split("jobs:\n")[1].matchAll(/^  ([a-z_]+):\n([\s\S]*?)(?=^  [a-z_]+:|$(?![\s\S]))/gm)];
const needs = new Proxy({}, { get: () => ({ result: 'success', outputs: new Proxy({}, { get: () => 'true' }) }) });

test('upstream lanes reject all fork events, channels and dry-run values', () => {
  assert.ok(jobs.length > 20);
  for (const [, name, body] of jobs) {
    if (name.startsWith('fork_')) continue;
    const raw = body.match(/^    if: (.+)(?:\n((?:      .+\n)*))?/m);
    assert.ok(raw, name);
    const expression = (raw[1] === '>-' ? raw[2].trim() : raw[1]).replace(/^\$\{\{\s*|\s*\}\}$/g, '');
    for (const event_name of ['push', 'schedule', 'workflow_dispatch']) {
      for (const channel of ['stable', 'beta', 'nightly', 'preview', 'cloud-migrator']) {
        for (const dry_run of [false, true]) {
          assert.equal(runInNewContext(expression, {
            github: { repository: 'DonTucci/paperclip-de', event_name, ref: 'refs/heads/master' },
            inputs: { channel, dry_run }, needs, always: () => true, cancelled: () => false,
          }), false, `${name}: ${event_name}/${channel}/${dry_run}`);
        }
      }
    }
  }
});

test('fork builds its event SHA and retains installer smoke coverage', () => {
  assert.match(release, /fork_verify:[\s\S]*?uses: \.\/\.github\/workflows\/release-verify.yml\n    with:\n      ref: \$\{\{ github.sha \}\}/);
  assert.match(release, /fork_smoke:[\s\S]*?uses: \.\/\.github\/workflows\/release-smoke.yml/);
});
