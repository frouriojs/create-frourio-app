module.exports = {
  'src/**/*.ts': () => 'tsc --noEmit',
  'src/**/*.{js,ts}': ['eslint --fix', 'git add'],
  '*.{json,md,yml}': ['prettier --write', 'git add']
}
