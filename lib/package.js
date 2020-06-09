const { merge, sortByKey } = require('./util')

module.exports = {
  loadPackage(name) {
    return JSON.parse(JSON.stringify(require(name)))
  },
  load(answers) {
    const fwPkg = this.loadPackage(`../templates/${answers.fw}/_package.json`)
    const daemonPkg = this.loadPackage(`../frameworks/${answers.daemon}/package.json`)
    const pkg = merge(fwPkg, daemonPkg)
    pkg.dependencies = sortByKey(pkg.dependencies)
    pkg.devDependencies = sortByKey(pkg.devDependencies)
    return pkg
  }
}
