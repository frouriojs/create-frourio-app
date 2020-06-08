module.exports = [
  {
    name: 'name',
    message: 'Project name',
    default: '{outFolder}'
  },
  {
    name: 'fw',
    message: 'Choose frontend framework',
    choices: [
      { name: 'Nuxt.ts', value: 'nuxt' },
      { name: 'None', value: 'none' }
    ],
    type: 'list',
    default: 'nuxt'
  },
  {
    name: 'pm',
    message: 'Choose the package manager',
    choices: [
      { name: 'Yarn', value: 'yarn' },
      { name: 'Npm', value: 'npm' }
    ],
    type: 'list',
    default: 'yarn'
  }
]
