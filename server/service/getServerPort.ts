import { getPortPromise } from 'portfinder'

let port: Promise<number>

export const getServerPort = () => {
  port = port ?? getPortPromise({ port: 8080 })
  return port
}
