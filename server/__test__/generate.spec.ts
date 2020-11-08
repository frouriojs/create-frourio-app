import fs from 'fs'
import path from 'path'
import { createSnapshot } from '../snapshot/createSnapshot'

jest.setTimeout(30000)

test('snapshot', async () => {
  const snapshot = await createSnapshot(path.join(__dirname, '../'))
  expect(
    snapshot === fs.readFileSync(path.join(__dirname, 'snapshot.txt'), 'utf8')
  ).toBeTruthy()
})
