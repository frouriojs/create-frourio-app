const path = require('path')
const test = require('ava')
const sao = require('sao')
const saoConfig = require('../lib/saofile')

const generator = path.join(__dirname, '../lib')

const getPkgFields = pkg => {
  pkg = JSON.parse(pkg)
  delete pkg.name
  delete pkg.version
  return pkg
}

const verifyFileList = async (t, answers = {}) => {
  const stream = await sao.mock({ generator }, answers)
  t.snapshot(stream.fileList, 'Generated files')
}

const verifyPkg = async (t, answers = {}) => {
  const stream = await sao.mock({ generator }, answers)
  const pkg = await stream.readFile('package.json')
  t.snapshot(getPkgFields(pkg), 'package.json')
}

const verifyAnswers = async (t, answers = {}) => {
  await verifyFileList(t, answers)
  await verifyPkg(t, answers)
}

test('verify default answers', async t => {
  await verifyAnswers(t)
})

for (const prompt of saoConfig.prompts) {
  if (Array.isArray(prompt.choices)) {
    if (prompt.type === 'checkbox') {
      const choioceNames = prompt.choices.map(choice => choice.name)
      const choioceValues = prompt.choices.map(choice => choice.value)
      test(`verify ${prompt.name}: ${choioceNames.join(', ')}`, async t => {
        const answers = { [prompt.name]: choioceValues }
        await verifyAnswers(t, answers)
      })
    }
    for (const choice of prompt.choices) {
      test(`verify ${prompt.name}: ${choice.name}`, async t => {
        const answers = {
          [prompt.name]: prompt.type === 'checkbox' ? [choice.value] : choice.value
        }
        await verifyAnswers(t, answers)
      })
    }
  }
}
