const { relative, resolve } = require('path')
const validate = require('validate-npm-package-name')
const spawn = require('cross-spawn')

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

    return [
      {
        type: 'add',
        files: '**',
        templateDir: resolve(__dirname, `../templates/${this.answers.fw}`)
      },
      {
        type: 'move',
        patterns: {
          '_package.json': 'package.json',
          '_tsconfig.json': 'tsconfig.json'
        }
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
