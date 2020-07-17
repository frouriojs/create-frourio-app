const { merge, sortByKey } = require('./util')

module.exports = {
  loadPackage(name) {
    return JSON.parse(JSON.stringify(require(`../templates/${name}`)))
  },
  load(answers) {
    const pkgs = [this.loadPackage(`front/${answers.front}/_package.json`)]

    if (answers.front !== 'none') {
      pkgs.push(this.loadPackage(`aspida/${answers.front}/${answers.aspida}/package.json`))
    }

    if (answers.dbType !== 'none') {
      pkgs.push({
        scripts: {
          'migration:generate':
            'cd server && ts-node node_modules/.bin/typeorm migration:generate -n Task',
          'migration:run': 'cd server && ts-node node_modules/.bin/typeorm migration:run',
          'migration:revert': 'cd server && ts-node node_modules/.bin/typeorm migration:revert'
        }
      })
    }

    if (pkgs.length === 1) return pkgs[0]

    const pkg = merge(...pkgs)
    pkg.dependencies = sortByKey(pkg.dependencies)
    pkg.devDependencies = sortByKey(pkg.devDependencies)
    return pkg
  }
}
