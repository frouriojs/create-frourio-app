import type { BuildOptions } from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';
import path from 'path';

export const esbuildConfig: BuildOptions = {
  entryPoints: [path.resolve(__dirname, '../index.ts')],
  outdir: path.resolve(__dirname, '../'),
  platform: 'node',
  target: 'node20',
  bundle: true,
  plugins: [nodeExternalsPlugin()],
  logLevel: 'info',
};
