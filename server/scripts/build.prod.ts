import { build } from 'esbuild';
import { esbuildConfig } from './config.common';

build({
  ...esbuildConfig,
  minify: true,
  define: { 'process.env.NODE_ENV': `"production"` },
}).catch(() => process.exit(1));
