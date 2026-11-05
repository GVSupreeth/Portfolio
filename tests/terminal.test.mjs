import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const modulePath = join(root, 'assets/js/terminal.js');

async function loadTerminal() {
  assert.ok(existsSync(modulePath), 'terminal module must exist');
  return import(pathToFileURL(modulePath));
}

test('help lists every supported command', async () => {
  const { resolveCommand } = await loadTerminal();
  const result = resolveCommand('help');

  assert.equal(result.kind, 'print');
  assert.deepEqual(result.lines, [
    'Available commands:',
    'help · about · experience · projects · stack · resume · contact · clear',
  ]);
});

test('profile commands return useful text actions', async () => {
  const { resolveCommand } = await loadTerminal();

  const about = resolveCommand('about');
  assert.equal(about.kind, 'print');
  assert.ok(about.lines.join(' ').includes('Data Engineer'));

  const contact = resolveCommand('contact');
  assert.equal(contact.kind, 'navigate');
  assert.equal(contact.target, '#contact');
  assert.ok(contact.lines.join(' ').includes('supreethgvvs@gmail.com'));
});

test('navigation commands target existing page sections', async () => {
  const { resolveCommand } = await loadTerminal();

  assert.deepEqual(
    ['experience', 'projects', 'stack'].map((command) => {
      const result = resolveCommand(command);
      return [command, result.kind, result.target];
    }),
    [
      ['experience', 'navigate', '#experience'],
      ['projects', 'navigate', '#projects'],
      ['stack', 'navigate', '#stack'],
    ],
  );
});

test('resume opens the packaged latest document', async () => {
  const { resolveCommand } = await loadTerminal();
  const result = resolveCommand('resume');

  assert.equal(result.kind, 'open');
  assert.equal(
    result.url,
    './assets/resume/Supreeth_Gunniguntla_Vidyasagar_Resume.docx',
  );
});

test('clear returns an empty terminal action', async () => {
  const { resolveCommand } = await loadTerminal();

  assert.deepEqual(resolveCommand('clear'), { kind: 'clear', lines: [] });
});

test('command matching trims whitespace and ignores case', async () => {
  const { resolveCommand } = await loadTerminal();

  assert.deepEqual(resolveCommand('  PrOjEcTs  '), resolveCommand('projects'));
});

test('empty and unknown input return safe guidance', async () => {
  const { resolveCommand } = await loadTerminal();

  assert.deepEqual(resolveCommand('   '), {
    kind: 'print',
    lines: ['Type help to list available commands.'],
  });

  const input = '<script>alert(1)</script>';
  const unknown = resolveCommand(input);
  assert.equal(unknown.kind, 'print');
  assert.deepEqual(unknown.lines, [
    `Command not found: ${input}`,
    'Type help to list available commands.',
  ]);
  assert.equal(unknown.html, undefined);
  assert.equal(unknown.trustedHtml, undefined);
});
