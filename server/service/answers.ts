import { spawn } from 'child_process';
import type { Answers } from 'common/prompts';
import { cfaPrompts } from 'common/prompts';
import fs from 'fs';
import { homedir } from 'os';
import path from 'path';
import stream from 'stream';
import { completed } from './completed';
import { generate } from './generate';
import { getClientPort, getServerPort } from './getServerPort';
import { canContinueOnPath, getPathStatus } from './localPath';
import { setStatus } from './status';

{
  // remove unused local json
  const dirPath = path.join(homedir(), '.frourio');
  const dbPath = path.join(dirPath, 'create-frourio-app.json');

  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    fs.rmdirSync(dirPath);
  }
}

const genAllAnswers = (answers: Answers) =>
  cfaPrompts.reduce(
    (prev, current) => ({
      ...prev,
      [current.name]: answers[current.name] ?? current.default,
    }),
    {} as Answers,
  );

const installApp = async (answers: Answers) => {
  setStatus('installing');
  const allAnswers = genAllAnswers(answers);
  const dir = allAnswers.dir ?? '';
  const s = new stream.Writable({
    write(chunk, _enc, cb) {
      process.stdout.write(chunk, (err) => cb(err));
    },
  });

  await generate(
    { ...allAnswers, clientPort: await getClientPort(), serverPort: await getServerPort() },
    __dirname,
  );

  await completed(dir, s);

  const npmRun = (script: string) =>
    new Promise((resolve, reject) => {
      const proc = spawn('npm', ['run', '--color', script], {
        cwd: path.resolve(dir),
        stdio: ['inherit', 'pipe', 'pipe'],
        env: {
          FORCE_COLOR: 'true',

          npm_config_color: 'always',
          npm_config_progress: 'true',

          ...process.env,
        },
        shell: process.platform === 'win32',
      });
      proc.stdio[1]?.on('data', s.write.bind(s));
      proc.stdio[2]?.on('data', s.write.bind(s));
      proc.once('close', resolve);
      proc.once('error', reject);
    });

  await npmRun('generate');
  await npmRun('lint:fix');

  npmRun('dev');
};

export const updateAnswers = async (answers: Answers) => {
  const canContinue = await getPathStatus(path.resolve(process.cwd(), answers.dir || '')).then(
    canContinueOnPath,
  );

  if (canContinue !== null) throw new Error(canContinue);

  return await installApp(answers);
};
