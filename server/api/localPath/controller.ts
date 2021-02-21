import { defineController } from './$relay'
import { getPathStatus, canContinueOnPath } from '$/service/localPath'
import path from 'path'

export default defineController(() => ({
  post: async ({ body: { path: relativePath } }) => {
    const absPath = path.resolve(process.cwd(), relativePath)
    const body = {
      absPath,
      canContinue: canContinueOnPath(await getPathStatus(absPath))
    }
    return {
      status: 200,
      body
    }
  }
}))
