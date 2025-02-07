import FastifyStatic from '@fastify/static';
import { Command } from 'commander';
import Fastify from 'fastify';
import open from 'open';
import path from 'path';
import { getPortPromise } from 'portfinder';
import { updateAnswers } from 'service/answers';
import server from './$server';
import FastifyInject from './plugins/fastify-inject';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const manifest = [require][0]!('../package.json');

const dirDefault = 'my-frourio-app';

declare module 'fastify' {}

const program = new Command();

program.name(`${manifest.name}`);
program.version(`v${manifest.version}`, '-v');
program.option('-p, --port <char>', '', '3000');
program.option('--host <char>', '', 'localhost');
program.option('--answers <char>');
program.argument('[dir]', 'project directory name', dirDefault);
program.allowExcessArguments(false);

program.parse();

(async () => {
  const options = program.opts();

  if (options.answers !== undefined) {
    await updateAnswers(JSON.parse(options.answers));
    return;
  }

  const fastify = Fastify();
  const port =
    process.env.NODE_ENV === 'development' ? 31577 : await getPortPromise({ port: options.port });

  fastify.register(FastifyStatic, { root: path.join(__dirname, '../client/out') });

  await fastify.register(FastifyInject, { dir: program.args[0] || dirDefault });

  await server(fastify, { basePath: '/api' }).listen({ port, host: options.host });

  if (process.env.NODE_ENV === 'test') return;

  if (process.env.NODE_ENV === 'development') {
    console.log(`open http://localhost:3000 in the browser`);
  } else {
    const subprocess = await open(`http://localhost:${port}`);

    subprocess.on('error', () => {
      console.log(`open http://localhost:${port} in the browser`);
    });
    subprocess.on('close', () => {
      console.log(`open http://localhost:${port} in the browser`);
    });
  }
})();
