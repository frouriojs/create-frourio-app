module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
      rules: {
        'selector-class-pattern': null
      }
    }
  ],
  // add your custom config here
  // https://stylelint.io/user-guide/configuration
  rules: {}
}
