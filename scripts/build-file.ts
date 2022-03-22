import arg from 'arg'
import type { Plugin, WatchMode } from 'esbuild'
import { build } from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'
import * as fs from 'fs'
import * as path from 'path'

interface Params {
  from: string
  to: string
  watch: boolean
  prod: boolean
  server: boolean
  target: string
}

const omitImportNodeNSPlugin: Plugin = {
  name: 'omit-import-node-ns',
  setup(build) {
    build.onResolve({ filter: /^node:/ }, (args) => {
      return {
        path: args.path.slice(5),
        external: true
      }
    })
  }
}

const main = async ({ from, to, watch, prod, target, server }: Params) => {
  const fromPath = path.resolve(process.cwd(), from)
  const toPath = path.resolve(process.cwd(), to)
  const toDir = path.dirname(toPath)

  fs.mkdirSync(toDir, { recursive: true })

  const watchOptions: boolean | WatchMode = watch && {
    onRebuild(error) {
      if (error) {
        console.error(error)
        return
      }
      console.log(`Build done for file ${fromPath}`)
    }
  }

  await build({
    platform: 'node',
    format: 'cjs',
    target,
    minify: true,
    keepNames: true,
    jsx: server ? undefined : 'transform',
    define: {
      'process.env.NODE_ENV': prod ? '"production"' : '"development"'
    },
    sourcemap: 'inline',
    bundle: true,
    outfile: toPath,
    entryPoints: [fromPath],
    watch: watchOptions,
    plugins: [
      omitImportNodeNSPlugin,
      nodeExternalsPlugin({
        allowList: []
      })
    ]
  })
}

const args = arg({
  '--watch': Boolean,
  '--from': String,
  '--to': String,
  '--target': String,
  '--prod': Boolean,
  '--server': Boolean
})
main({
  watch: Boolean(args['--watch']),
  prod: Boolean(args['--prod']),
  from: args['--from'] || '',
  to: args['--to'] || '',
  target: args['--target'] || '',
  server: Boolean(args['--server'])
}).catch((e) => {
  console.error(e)
  process.exit(1)
})
