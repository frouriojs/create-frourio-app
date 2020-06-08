module.exports = {
  'lib/**/*.js': ['eslint --fix', 'git add'],
  '*.{json,md,yml}': ['prettier --write', 'git add']
}
