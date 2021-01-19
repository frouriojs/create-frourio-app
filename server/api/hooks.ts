import { defineHooks } from './$relay'

export type AdditionalRequest = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  appendLogging: (data: any) => void
}

export default defineHooks(() => ({}))
