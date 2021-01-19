import { getPortPromise } from 'portfinder'

let serverPort: Promise<number>

export const getServerPort = () => {
  serverPort = serverPort ?? getPortPromise({ port: 8080 })
  return serverPort
}

let clientPort: Promise<number>

export const getClientPort = () => {
  clientPort = clientPort ?? getPortPromise({ port: 8000 })
  return clientPort
}
