import { context } from 'esbuild';
import { esbuildConfig } from './config.common';

context({
  ...esbuildConfig,
  define: { 'process.env.NODE_ENV': `"development"` },
}).then((ctx) => ctx.watch());
