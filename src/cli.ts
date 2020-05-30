import path from 'path'
import fs from 'fs-extra'

export const run = (args: string[]) => {
  fs.copy(path.join(__dirname, '../template'), args[0] || 'frourio-app')
}
