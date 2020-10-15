import fs from 'fs'
import { join } from 'path'
import { homedir } from 'os'
import { Answers } from '$/common/prompts'
import { install } from '$/service/install'

const dirPath = join(homedir(), '.frourio')
const dbPath = join(dirPath, 'create-frourio-app.json')

let db: {
  ver: number
  answers: Omit<Answers, 'dir'>
} = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath, 'utf8')) : { ver: 1, answers: {}}

export const getAnswers = () => db.answers

export const updateAnswers = async (answers: Answers) => {
  const ans = { ...answers }
  delete ans.dir
  db = { ...db, answers: ans }

  if (!fs.existsSync(dirPath)) await fs.promises.mkdir(dirPath)

  await fs.promises.writeFile(dbPath, JSON.stringify(db), 'utf8')
  install(answers)
}
