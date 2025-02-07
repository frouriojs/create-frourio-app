import { getPortPromise } from 'portfinder';

let serverPort: Promise<number>;

export const getServerPort = () => {
  serverPort ??= getPortPromise({ port: 10000 + Math.floor(Math.random() * 50000) });
  return serverPort;
};

let clientPort: Promise<number>;

export const getClientPort = () => {
  clientPort ??= getPortPromise({ port: 8000 });
  return clientPort;
};
