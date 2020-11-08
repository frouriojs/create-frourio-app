/* eslint-disable @typescript-eslint/no-explicit-any */
import { relative, resolve } from 'path'
import validate from 'validate-npm-package-name'
import spawn from 'cross-spawn'
import { typeormDBs } from '../common/dbInfo'
import { load } from './package'

export const actions = (
  answers: Record<string, any>,
  outDir: string
): (
  | { type: 'add'; files: string; templateDir: string }
  | { type: 'move'; patterns: Record<string, string> }
  | { type: 'modify'; files: string; handler: () => Record<string, any> }
)[] => {
  const validation = validate(answers.name)
  validation.warnings &&
    validation.warnings.forEach((warn: string) => {
      console.warn('Warning:', warn)
    })
  validation.errors &&
    validation.errors.forEach((err: string) => {
      console.error('Error:', err)
    })
  validation.errors && validation.errors.length && process.exit(1)

  const addedList: { type: 'add'; files: string; templateDir: string }[] = [
    {
      type: 'add',
      files: '**',
      templateDir: resolve(__dirname, `../templates/core/${answers.server}`)
    }
  ]

  if (answers.orm === 'typeorm') {
    addedList.push({
      type: 'add',
      files: '**',
      templateDir: resolve(
        __dirname,
        `../templates/core/${answers.server}-typeorm`
      )
    })
  }

  if (answers.daemon !== 'none') {
    addedList.push({
      type: 'add',
      files: '**',
      templateDir: resolve(__dirname, `../templates/daemon/${answers.daemon}`)
    })
  }

  answers.dbModule = ''

  if (answers.orm === 'prisma') {
    answers.dbUrl =
      answers.prismaDB === 'sqlite'
        ? `file:${answers.dbFile}`
        : `${answers.prismaDB}://${answers.dbUser}:${answers.dbPass}@${answers.dbHost}:${answers.dbPort}/${answers.dbName}`

    addedList.push({
      type: 'add',
      files: '**',
      templateDir: resolve(__dirname, '../templates/orm/prisma')
    })
  } else if (answers.orm === 'typeorm') {
    answers.dbModule = `",\n    "${
      typeormDBs[answers.typeormDB as keyof typeof typeormDBs].name
    }": "${typeormDBs[answers.typeormDB as keyof typeof typeormDBs].ver}`

    addedList.push({
      type: 'add',
      files: '**',
      templateDir: resolve(__dirname, '../templates/orm/typeorm')
    })
  }

  if (answers.testing !== 'none') {
    addedList.push({
      type: 'add',
      files: '**',
      templateDir: resolve(__dirname, `../templates/testing/${answers.testing}`)
    })
  }

  return [
    {
      type: 'add',
      files: '**',
      templateDir: resolve(__dirname, `../templates/front/${answers.front}`)
    },
    {
      type: 'add',
      files: '**',
      templateDir: resolve(
        __dirname,
        `../templates/aspida/${answers.front}/${answers.aspida}`
      )
    },
    {
      type: 'add',
      files: 'server/**',
      templateDir: resolve(__dirname, '../templates')
    },
    ...addedList,
    {
      type: 'move',
      patterns: {
        gitignore: '.gitignore',
        '_package.json': 'package.json'
      }
    },
    {
      type: 'modify',
      files: 'package.json',
      handler: () => load(answers)
    },
    {
      type: 'add',
      files: 'package.json',
      templateDir: outDir
    }
  ]
}

export default {
  actions(this: { answers: Record<string, any>; outDir: string }) {
    return actions(this.answers, this.outDir)
  },
  async completed(this: Record<string, any>) {
    this.gitInit()

    await this.npmInstall({ npmClient: this.answers.pm })
    await this.npmInstall({
      npmClient: this.answers.pm,
      cwd: `${this.outDir}/server`
    })

    spawn.sync(this.answers.pm, ['run', 'build:types'], {
      cwd: this.outDir,
      stdio: 'inherit'
    })

    const chalk = this.chalk
    const isNewFolder = this.outDir !== process.cwd()
    const relativeOutFolder = relative(process.cwd(), this.outDir)
    const cdMsg = isNewFolder ? chalk`\n\t{cyan cd ${relativeOutFolder}}\n` : ''
    const pmRun = this.answers.pm === 'yarn' ? 'yarn' : 'npm run'

    console.log(
      chalk`\n🎉  {bold Successfully created project} {cyan ${this.answers.name}}\n`
    )

    console.log(chalk`  {bold To get started:}`)
    if (
      this.answers.orm !== 'none' &&
      (this.answers.orm === 'typeorm' || this.answers.prismaDB !== 'sqlite')
    ) {
      console.log(
        chalk`\t{cyan (start ${
          this.answers.orm === 'prisma'
            ? this.answers.prismaDB
            : this.answers.typeormDB
        } server yourself)}`
      )
    }
    console.log(chalk`${cdMsg}\t{cyan ${pmRun} dev}\n`)

    console.log(chalk`  {bold To build & start for production:}`)
    if (
      this.answers.orm !== 'none' &&
      (this.answers.orm === 'typeorm' || this.answers.prismaDB !== 'sqlite')
    ) {
      console.log(
        chalk`\t{cyan (start ${
          this.answers.orm === 'prisma'
            ? this.answers.prismaDB
            : this.answers.typeormDB
        } server yourself)}`
      )
    }
    console.log(chalk`${cdMsg}\t{cyan ${pmRun} build}`)
    console.log(chalk`\t{cyan ${pmRun} start}\n`)
  }
}
