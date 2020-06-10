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
      { name: 'Next.ts', value: 'next' },
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
  },
  {
    name: 'daemon',
    message: 'Choose the daemon process manager',
    choices: [
      { name: 'None', value: 'none' },
      { name: 'PM2', value: 'pm2' }
    ],
    type: 'list',
    default: 'none'
  }
]
