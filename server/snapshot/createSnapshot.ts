import os from 'os'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import rimraf from 'rimraf'
import isBinaryPath from 'is-binary-path'
import { Answers, saoPrompts } from '../common/prompts'
import { generate } from '../service/generate'

const createAnswersList = (
  answers: Answers,
  [nextQuestion, ...leftQuestions]: typeof saoPrompts
): Answers[] => {
  if (nextQuestion.when?.(answers) === false) {
    return leftQuestions.length
      ? createAnswersList(answers, leftQuestions)
      : [answers]
  }

  if (nextQuestion.type === 'input') {
    const ans = { ...answers }

    if (nextQuestion.default) {
      ans[nextQuestion.name] =
        typeof nextQuestion.default === 'string'
          ? nextQuestion.default
          : nextQuestion.default(ans)
    } else {
      ans[nextQuestion.name] = nextQuestion.name
    }

    return leftQuestions.length ? createAnswersList(ans, leftQuestions) : [ans]
  }

  return nextQuestion.choices.reduce<Answers[]>((prev, choice) => {
    const ans = {
      ...answers,
      dir: `${answers.dir}${answers.dir ? '-' : ''}${choice.value}`,
      [nextQuestion.name]: choice.value
    }
    return [
      ...prev,
      ...(leftQuestions.length ? createAnswersList(ans, leftQuestions) : [ans])
    ]
  }, [])
}

const listFiles = (targetDir: string): string[] =>
  fs
    .readdirSync(targetDir, { withFileTypes: true })
    .reduce<string[]>((prev, dirent) => {
      const target = path.posix.join(targetDir, dirent.name)
      return [...prev, ...(dirent.isFile() ? [target] : listFiles(target))]
    }, [])

export const createSnapshot = async (rootDir: string) => {
  const outputDir = path.join(os.tmpdir(), `${Date.now()}`)
  const appPromptsList = createAnswersList({ dir: '' }, saoPrompts.slice(1, -2))
  const promptsList = [
    ...appPromptsList,
    ...createAnswersList(appPromptsList[0], saoPrompts.slice(-2)),
    ...createAnswersList(
      appPromptsList[appPromptsList.length - 1],
      saoPrompts.slice(-2)
    )
  ]

  console.log(promptsList.length)
  fs.mkdirSync(outputDir)

  for (let i = 0; i < promptsList.length; i += 1) {
    if (i % 100 === 0) console.log(i)

    await generate(
      {
        ...promptsList[i],
        clientPort: 3000,
        serverPort: 8080
      },
      rootDir,
      path.resolve(outputDir, promptsList[i].dir ?? '')
    )
  }

  const hasDataList: {
    header: string
    name: string
    data: string
    hash: string
  }[] = []
  const fileData = listFiles(outputDir)
    .sort()
    .map((file) => {
      const data =
        isBinaryPath(file) && path.extname(file) !== '.snap'
          ? '\nbinary\n'
          : `\n\n\`\`\`\n${fs
              .readFileSync(file, 'utf8')
              .replace(
                /```/g,
                path.extname(file) === '.md' ? '\\```' : '```'
              )}\n\`\`\`\n`
      const hash = crypto.createHash('md5').update(data).digest('hex')
      const name = file.replace(`${outputDir}/`, '')
      const duplicated = hasDataList.find(
        (d) =>
          d.name.split('/').pop() === file.split('/').pop() && d.hash === hash
      )

      if (duplicated) {
        return {
          header: name.split('/')[0],
          name: `[${name.split('/').slice(1).join('/')}](#${duplicated.hash})`
        }
      } else {
        const d = {
          header: name.split('/')[0],
          name: name.split('/').slice(1).join('/'),
          data,
          hash
        }
        hasDataList.push(d)
        return d
      }
    })

  rimraf.sync(outputDir)

  console.log(hasDataList.length, fileData.length)

  return fileData.reduce(
    (prev, d) => ({
      header: d.header,
      text: `${prev.text}${'hash' in d ? `<a id="${d.hash}"></a>\n` : ''}${
        prev.header === d.header ? '' : `\n## ${d.header}\n`
      }${d.name}${'data' in d ? d.data : '  '}\n`
    }),
    { header: '', text: '' }
  ).text
}
