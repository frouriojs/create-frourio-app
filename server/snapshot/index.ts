import fs from 'fs'
import path from 'path'
import { createSnapshot } from './createSnapshot'

createSnapshot(path.join(__dirname, '../')).then((text) =>
  fs.writeFileSync(
    path.join(__dirname, '../__test__/snapshot.txt'),
    text,
    'utf8'
  )
)
