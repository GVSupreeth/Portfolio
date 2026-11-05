import {
  EXPERIENCE_SUMMARIES,
  PROFILE,
  PROJECT_SUMMARIES,
  SKILL_GROUPS,
  TERMINAL_HELP,
} from './content.js';

const helpLine = TERMINAL_HELP.join(' · ');

const commandResolvers = Object.freeze({
  help: () => ({
    kind: 'print',
    lines: ['Available commands:', helpLine],
  }),
  about: () => ({
    kind: 'print',
    lines: [
      `${PROFILE.name} — ${PROFILE.role}`,
      'Data pipelines · cloud platforms · data warehousing · Databricks · applied AI',
    ],
  }),
  experience: () => ({
    kind: 'navigate',
    target: '#experience',
    lines: EXPERIENCE_SUMMARIES.map(
      ({ title, organization, dates }) => `${title} @ ${organization} · ${dates}`,
    ),
  }),
  projects: () => ({
    kind: 'navigate',
    target: '#projects',
    lines: PROJECT_SUMMARIES.map(({ name, status }) => `${name} · ${status}`),
  }),
  stack: () => ({
    kind: 'navigate',
    target: '#stack',
    lines: SKILL_GROUPS.map(
      ({ category, skills }) => `${category}: ${skills.join(', ')}`,
    ),
  }),
  resume: () => ({
    kind: 'open',
    url: PROFILE.resumeUrl,
    lines: ['Opening the latest packaged résumé…'],
  }),
  contact: () => ({
    kind: 'navigate',
    target: '#contact',
    lines: [
      `Email: ${PROFILE.email}`,
      `GitHub: ${PROFILE.github}`,
      `LinkedIn: ${PROFILE.linkedin}`,
    ],
  }),
  clear: () => ({ kind: 'clear', lines: [] }),
});

export function resolveCommand(raw = '') {
  const input = String(raw).trim();

  if (!input) {
    return {
      kind: 'print',
      lines: ['Type help to list available commands.'],
    };
  }

  const command = input.toLowerCase();
  const resolver = Object.hasOwn(commandResolvers, command)
    ? commandResolvers[command]
    : null;
  if (resolver) return resolver();

  return {
    kind: 'print',
    lines: [
      `Command not found: ${input}`,
      'Type help to list available commands.',
    ],
  };
}

export function initTerminal(root, options = {}) {
  const form = root?.querySelector('#terminal-form');
  const input = root?.querySelector('#terminal-input');
  const output = root?.querySelector('#terminal-output');
  const suggestions = root?.querySelectorAll('[data-command]') ?? [];
  const onNavigate = options.onNavigate ?? (() => {});
  const onOpen = options.onOpen ?? (() => {});

  if (!form || !input || !output) {
    return {
      focus() {},
      run() {},
    };
  }

  const appendLine = (text, className = '') => {
    const line = document.createElement('p');
    line.textContent = text;
    if (className) line.className = className;
    output.append(line);

    while (output.childElementCount > 32) {
      output.firstElementChild?.remove();
    }

    output.scrollTop = output.scrollHeight;
  };

  const run = (raw) => {
    const entered = String(raw).trim();
    if (entered) appendLine(`$ ${entered}`, 'terminal-command');

    const result = resolveCommand(raw);
    if (result.kind === 'clear') {
      output.replaceChildren();
      return result;
    }

    const lineClass = entered && !Object.hasOwn(commandResolvers, entered.toLowerCase())
      ? 'terminal-error'
      : '';
    result.lines.forEach((line) => appendLine(line, lineClass));

    if (result.kind === 'navigate') onNavigate(result.target);
    if (result.kind === 'open') onOpen(result.url);
    return result;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const result = run(input.value);
    input.value = '';
    if (result.kind !== 'navigate') input.focus();
  });

  suggestions.forEach((button) => {
    button.addEventListener('click', () => {
      const result = run(button.dataset.command ?? '');
      if (result.kind !== 'navigate') input.focus();
    });
  });

  return {
    focus() {
      input.focus();
    },
    run,
  };
}
