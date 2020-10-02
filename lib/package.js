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

    if (answers.orm === 'prisma') {
      pkgs.push({
        scripts: {
          migrate: 'npm run migrate:save && npm run migrate:up',
          'migrate:save':
            'cd server && node_modules/.bin/prisma migrate save --create-db --experimental',
          'migrate:up':
            'cd server && node_modules/.bin/prisma migrate up --create-db --experimental',
          'migrate:down': 'cd server && node_modules/.bin/prisma migrate down --experimental'
        }
      })
    } else if (answers.orm === 'typeorm') {
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
