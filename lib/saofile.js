const { relative, resolve } = require('path')
const validate = require('validate-npm-package-name')
const spawn = require('cross-spawn')
const pkg = require('./package')

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

    const addedList = []

    if (this.answers.daemon !== 'none') {
      addedList.push({
        type: 'add',
        files: '**',
        templateDir: resolve(__dirname, `../templates/daemon/${this.answers.daemon}`)
      })
    }

    if (this.answers.dbType !== 'none') {
      addedList.push({
        type: 'add',
        files: '**',
        templateDir: resolve(__dirname, '../templates/database')
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
        patterns: { '_package.json': 'package.json' }
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

    spawn.sync(this.answers.pm, ['run', 'build:apis'], {
      cwd: this.outDir,
      stdio: 'inherit'
    })

    const chalk = this.chalk
    const isNewFolder = this.outDir !== process.cwd()
    const relativeOutFolder = relative(process.cwd(), this.outDir)
    const cdMsg = isNewFolder ? chalk`\t{cyan cd ${relativeOutFolder}}\n` : ''
    const pmRun = this.answers.pm === 'yarn' ? 'yarn' : 'npm run'

    console.log(chalk`\n🎉  {bold Successfully created project} {cyan ${this.answers.name}}\n`)

    console.log(chalk`  {bold To get started:}\n`)
    console.log(chalk`${cdMsg}\t{cyan ${pmRun} dev}\n`)

    console.log(chalk`  {bold To build & start for production:}\n`)
    console.log(chalk`${cdMsg}\t{cyan ${pmRun} build}`)
    console.log(chalk`\t{cyan ${pmRun} start}\n`)
  }
}
