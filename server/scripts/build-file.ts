import arg from 'arg'
import { build } from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'
import * as path from 'path'

const main = async ({ watch, prod }: { watch: boolean; prod: boolean }) => {
  await build({
    platform: 'node',
    format: 'cjs',
    target: 'es2019',
    minify: true,
    keepNames: true,
    define: { 'process.env.NODE_ENV': prod ? '"production"' : '"development"' },
    sourcemap: 'inline',
    bundle: true,
    outdir: process.cwd(),
    entryPoints: [path.resolve(process.cwd(), './index.ts')],
    watch,
    plugins: [nodeExternalsPlugin()]
  })
}

const args = arg({ '--watch': Boolean, '--prod': Boolean })

main({ watch: Boolean(args['--watch']), prod: Boolean(args['--prod']) }).catch((e) => {
  console.error(e)
  process.exit(1)
})
