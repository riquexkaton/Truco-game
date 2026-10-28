import { spawnSync } from 'node:child_process';
import { relative, sep } from 'node:path';

const readStdin = async () => {
  let data = '';
  for await (const chunk of process.stdin) data += chunk;
  return data;
};

const input = JSON.parse((await readStdin()) || '{}');
const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const file = relative(root, input.tool_input?.file_path ?? '').split(sep).join('/');

if (!/^src\/.+\.tsx?$/.test(file)) process.exit(0);

const result = spawnSync(`pnpm exec eslint --max-warnings 0 "${file}"`, {
  cwd: root,
  encoding: 'utf8',
  shell: true,
});

if (result.status === 0) process.exit(0);

process.stderr.write(
  `ESLint rechazó ${file}. Corregí el código: las reglas no se desactivan.\n${result.stdout ?? ''}${result.stderr ?? ''}${result.error?.message ?? ''}`,
);
process.exit(2);
