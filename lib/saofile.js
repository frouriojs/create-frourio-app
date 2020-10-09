const { relative, resolve } = require('path')
const validate = require('validate-npm-package-name')
const spawn = require('cross-spawn')
const pkg = require('./package')
const dbInfo = require('./dbInfo')

module.exports = {
  prompts: require('./prompts'),
  templateData() {
    const pm = this.answers.pm === 'yarn' ? 'yarn' : 'npm'
    const pmRun = this.answers.pm === 'yarn' ? 'yarn' : 'npm run'

    return {
      pm,
      pmRun
    }
  },
  actions() {
    const validation = validate(this.answers.name)
    validation.warnings &&
      validation.warnings.forEach(warn => {
        console.warn('Warning:', warn)
      })
    validation.errors &&
      validation.errors.forEach(err => {
        console.error('Error:', err)
      })
    validation.errors && validation.errors.length && process.exit(1)

    const addedList = [
      {
        type: 'add',
        files: '**',
        templateDir: resolve(__dirname, `../templates/core/${this.answers.server}`)
      }
    ]

    if (this.answers.orm === 'typeorm') {
      addedList.push({
        type: 'add',
        files: '**',
        templateDir: resolve(__dirname, `../templates/core/${this.answers.server}-typeorm`)
      })
    }

    if (this.answers.daemon !== 'none') {
      addedList.push({
        type: 'add',
        files: '**',
        templateDir: resolve(__dirname, `../templates/daemon/${this.answers.daemon}`)
      })
    }

    this.answers.dbModule = ''

    if (this.answers.orm === 'prisma') {
      this.answers.dbUrl =
        this.answers.dbType === 'sqlite'
          ? `file:${this.answers.dbFile}`
          : `${this.answers.dbType}://${this.answers.dbUser}:${this.answers.dbPass}@${this.answers.dbHost}:${this.answers.dbPort}/${this.answers.dbName}`

      addedList.push({
        type: 'add',
        files: '**',
        templateDir: resolve(__dirname, '../templates/orm/prisma')
      })
    } else if (this.answers.orm === 'typeorm') {
      this.answers.dbModule = `",\n    "${dbInfo[this.answers.dbType].name}": "${
        dbInfo[this.answers.dbType].ver
      }`

      addedList.push({
        type: 'add',
        files: '**',
        templateDir: resolve(__dirname, '../templates/orm/typeorm')
      })
    }

    if (this.answers.testing !== 'none') {
      addedList.push({
        type: 'add',
        files: '**',
        templateDir: resolve(__dirname, `../templates/testing/${this.answers.testing}`)
      })
    }

    return [
      {
        type: 'add',
        files: '**',
        templateDir: resolve(__dirname, `../templates/front/${this.answers.front}`)
      },
      {
        type: 'add',
        files: '**',
        templateDir: resolve(
          __dirname,
          `../templates/aspida/${this.answers.front}/${this.answers.aspida}`
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
        handler: () => pkg.load(this.answers)
      },
      {
        type: 'add',
        files: 'package.json',
        templateDir: this.outDir
      }
    ]
  },
  async completed() {
    this.gitInit()

    await this.npmInstall({ npmClient: this.answers.pm })
    await this.npmInstall({ npmClient: this.answers.pm, cwd: `${this.outDir}/server` })

    spawn.sync(this.answers.pm, ['run', 'build:types'], {
      cwd: this.outDir,
      stdio: 'inherit'
    })

    const chalk = this.chalk
    const isNewFolder = this.outDir !== process.cwd()
    const relativeOutFolder = relative(process.cwd(), this.outDir)
    const cdMsg = isNewFolder ? chalk`\n\t{cyan cd ${relativeOutFolder}}\n` : ''
    const pmRun = this.answers.pm === 'yarn' ? 'yarn' : 'npm run'

    console.log(chalk`\n🎉  {bold Successfully created project} {cyan ${this.answers.name}}\n`)

    console.log(chalk`  {bold To get started:}`)
    if (this.answers.orm !== 'none' && this.answers.dbType !== 'sqlite') {
      console.log(chalk`\t{cyan (start ${this.answers.dbType} server yourself)}`)
    }
    console.log(chalk`${cdMsg}\t{cyan ${pmRun} dev}\n`)

    console.log(chalk`  {bold To build & start for production:}`)
    if (this.answers.orm !== 'none' && this.answers.dbType !== 'sqlite') {
      console.log(chalk`\t{cyan (start ${this.answers.dbType} server yourself)}`)
    }
    console.log(chalk`${cdMsg}\t{cyan ${pmRun} build}`)
    console.log(chalk`\t{cyan ${pmRun} start}\n`)
  }
}
