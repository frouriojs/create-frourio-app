const { merge, sortByKey } = require('./util')

module.exports = {
  loadPackage(name) {
    return JSON.parse(JSON.stringify(require(name)))
  },
  load(answers) {
    const pkgs = [this.loadPackage(`../templates/${answers.fw}/_package.json`)]
    if (answers.daemon !== 'none') {
      pkgs.push(this.loadPackage(`../daemons/${answers.daemon}/package.json`))
    }

    const pkg = merge(...pkgs)
    pkg.dependencies = sortByKey(pkg.dependencies)
    pkg.devDependencies = sortByKey(pkg.devDependencies)
    return pkg
  }
}
