import fs from 'fs'
import path from 'path'
import { createSnapshot } from '../snapshotUtils'

jest.setTimeout(30000)

test('snapshot', async () => {
  const snapshot = await createSnapshot(path.resolve(__dirname, '../'))
  expect(
    snapshot === fs.readFileSync(path.join(__dirname, 'snapshot.txt'), 'utf8')
  ).toBeTruthy()
})
