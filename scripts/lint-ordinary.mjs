import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, rmSync, symlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const nearFilesystemRoot = path.parse(root).dir === path.parse(root).root;
const target = nearFilesystemRoot ? '/tmp/ordinary-lint/nested/n8n-nodes-convenia' : root;

if (target !== root) {
	rmSync('/tmp/ordinary-lint', { recursive: true, force: true });
	mkdirSync(path.dirname(target), { recursive: true });
	cpSync(root, target, {
		recursive: true,
		filter(source) {
			const relative = path.relative(root, source);
			if (relative === '') return true;
			const top = relative.split(path.sep)[0];
			return top !== 'node_modules' && top !== '.git' && top !== 'dist';
		},
	});
	symlinkSync(path.join(root, 'node_modules'), path.join(target, 'node_modules'), 'dir');
}

if (target !== root && process.argv.includes('--fix')) {
	console.error(
		'npm run lint:fix não altera este código-fonte: o lint oficial roda numa cópia aninhada porque o pacote está na raiz do sistema de arquivos. Corrija os arquivos e rode npm run lint.',
	);
	process.exit(1);
}

const result = spawnSync('npx', ['n8n-node', 'lint', ...process.argv.slice(2)], {
	cwd: target,
	stdio: 'inherit',
});
process.exit(result.status ?? 1);
