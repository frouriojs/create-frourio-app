import { createController } from 'frourio'
import { Methods } from './'

export default createController<Methods>({
  get: () => ({ status: 200, body: 'Hello, world!' })
})
