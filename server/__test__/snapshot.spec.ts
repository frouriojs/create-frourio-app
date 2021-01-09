import fs from 'fs'
import path from 'path'
import { createSnapshot } from '../snapshot/createSnapshot'

jest.setTimeout(360000)

test('snapshot', async () => {
  const snapshot = await createSnapshot(path.join(__dirname, '../'))
  fs.writeFileSync(path.join(__dirname, 'forArtifact.md'), snapshot, 'utf8')

  expect(
    snapshot ===
      fs
        .readFileSync(path.join(__dirname, 'snapshot.md'), 'utf8')
        .replace(/\r/g, '')
  ).toBeTruthy()
})
