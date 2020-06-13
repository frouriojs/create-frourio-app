import { createController } from 'frourio'
import { Values } from './$values'
import { Methods } from './'

export default createController<Methods, Values>({
  get: () => ({ status: 200, body: 'Hello, world!' })
})
