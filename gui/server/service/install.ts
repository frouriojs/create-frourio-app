import path from 'path'
import { Answers, initPrompts } from '$/common/prompts'
import { editors } from '$/service/editors'

const sao = require('sao')

export const install = async (answers: Answers) => {
  const allAnswers = initPrompts(editors)(answers).reduce((prev, current) => ({ ...prev, [current.name]: answers[current.name] ?? current.default }), {} as Answers)
  await sao({ generator: path.resolve(__dirname, './generator'), logLevel: 2, outDir: allAnswers.dir, answers: { ...allAnswers, name: allAnswers.dir } }).run().catch((e: Error) => console.trace(e))
}