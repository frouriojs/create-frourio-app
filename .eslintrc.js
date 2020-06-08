module.exports = {
  env: {
    es6: true,
    node: true,
    browser: true
  },
  extends: [
    'standard',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
    'prettier/standard'
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  root: true
}
