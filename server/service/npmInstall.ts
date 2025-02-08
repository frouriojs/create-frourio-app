import { spawn } from 'child_process';

export const npmInstall = async (cwd: string) => {
  await new Promise<void>((resolve, reject) => {
    const proc = spawn('npm', ['install'], {
      stdio: 'inherit',
      cwd,
      shell: process.platform === 'win32',
    });

    proc.once('close', resolve);
    proc.once('error', reject);
  });
};
