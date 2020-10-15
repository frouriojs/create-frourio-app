import fs from 'fs'
import { Answers } from "$/common/prompts"

const isObject = (value: any) =>
    !!value &&
    typeof value === 'object' &&
    typeof value.getMonth !== 'function' &&
    !Array.isArray(value)

const merge = (...sources: Record<string, any>[]) => {
  const [target, ...rest] = sources

  for (const object of rest) {
    for (const key in object) {
      const targetValue = target[key]
      const sourceValue = object[key]
      const isMergable = isObject(targetValue) && isObject(sourceValue)
      target[key] = isMergable ? merge({}, targetValue, sourceValue) : sourceValue
    }
  }

  return target
}

const sortByKey = (unsortedObject: Record<string, string>) => {
  const sortedObject: Record<string, string> = {}
  Object.keys(unsortedObject)
    .sort()
    .forEach(key => {
      sortedObject[key] = unsortedObject[key]
    })
  return sortedObject
}

const  loadPackage = (name: string) => JSON.parse(fs.readFileSync(`./templates/${name}`, 'utf8'))

export const load = (answers: Answers) => {
  const pkgs = [
    loadPackage(`front/${answers.front}/_package.json`),
    loadPackage(`aspida/${answers.front}/${answers.aspida}/package.json`)
  ]

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
