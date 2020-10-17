const { merge, sortByKey } = require('./util')

module.exports = {
  loadPackage(name) {
    return JSON.parse(JSON.stringify(require(`../templates/${name}`)))
  },
  load(answers) {
    const pkgs = [
      this.loadPackage(`front/${answers.front}/_package.json`),
      this.loadPackage(`aspida/${answers.front}/${answers.aspida}/package.json`)
    ]

    if (answers.orm === 'prisma') {
      pkgs.push({
        scripts: {
          migrate: 'npm run migrate:save && npm run migrate:up',
          'migrate:save':
            'cd server && cross-env DUMMY_ENV=forWin node_modules/.bin/prisma migrate save --create-db --experimental',
          'migrate:up':
            'cd server && cross-env DUMMY_ENV=forWin node_modules/.bin/prisma migrate up --create-db --experimental',
          'migrate:down':
            'cd server && cross-env DUMMY_ENV=forWin node_modules/.bin/prisma migrate down --experimental'
        }
      })
    } else if (answers.orm === 'typeorm') {
      pkgs.push({
        scripts: {
          'migration:generate':
            'cd server && ts-node cross-env DUMMY_ENV=forWin node_modules/.bin/typeorm migration:generate -n Task',
          'migration:run':
            'cd server && ts-node cross-env DUMMY_ENV=forWin node_modules/.bin/typeorm migration:run',
          'migration:revert':
            'cd server && ts-node cross-env DUMMY_ENV=forWin node_modules/.bin/typeorm migration:revert'
        }
      })
    }

    if (answers.testing === 'jest') {
      pkgs.push({
        scripts: {
          test: 'npm run build:types && jest'
        },
        devDependencies: {
          '@types/jest': '^26.0.14',
          jest: '^26.4.2',
          'ts-jest': '^26.4.1'
        }
      })
    }

    const pkg = merge(...pkgs)
    pkg.dependencies = sortByKey(pkg.dependencies)
    pkg.devDependencies = sortByKey(pkg.devDependencies)
    return pkg
  }
}
