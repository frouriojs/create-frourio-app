import { spawn } from 'child_process';
import type { Answers } from 'common/prompts';
import { cfaPrompts } from 'common/prompts';
import fs from 'fs';
import { homedir } from 'os';
import path from 'path';
import { generate } from './generate';
import { getClientPort, getServerPort } from './getServerPort';
import { canContinueOnPath, getPathStatus } from './localPath';
import { npmInstall } from './npmInstall';
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

  await generate(
    { ...allAnswers, clientPort: await getClientPort(), serverPort: await getServerPort() },
    __dirname,
  );

  await npmInstall(path.resolve(dir));

  const npmRun = (script: string) =>
    new Promise((resolve, reject) => {
      const proc = spawn('npm', ['run', script], {
        cwd: path.resolve(dir),
        stdio: 'inherit',
        shell: process.platform === 'win32',
      });

      proc.once('close', resolve);
      proc.once('error', reject);
    });

  await npmRun('fix:lint');

  npmRun('dev');
};

export const updateAnswers = async (answers: Answers) => {
  const canContinue = await getPathStatus(path.resolve(process.cwd(), answers.dir || '')).then(
    canContinueOnPath,
  );

  if (canContinue !== null) throw new Error(canContinue);

  return await installApp(answers);
};
