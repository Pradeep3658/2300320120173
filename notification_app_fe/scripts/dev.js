import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.chdir(path.resolve(__dirname, '..'));

const viteBin = path.resolve(__dirname, '../node_modules/vite/bin/vite.js');
const child = spawn(process.execPath, [viteBin, '--host', '0.0.0.0'], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
