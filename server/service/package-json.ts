import assert from 'assert'

export const depKeys = [
  '@dep',
  '@dev-dep',
  '@server-dev-dep',
  '@server-dep'
] as const
export type DepKeys = typeof depKeys[number]

export const isDepKey = (s: string): s is DepKeys => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return depKeys.indexOf(s as any) > -1
}

export const getPackageVersions = (): { [packageName: string]: string } => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const packageJson = require('../pretense/package.json')
  assert(!('devDependencies' in packageJson))
  assert(!('peerDependencies' in packageJson))
  const dep = packageJson['dependencies']
  return dep
}

const strUniq = (list: string[]) => {
  const known = Object.create(null)
  list.forEach((el) => {
    const g = el.match(/^(@?[^@]+)(?:@(.*))?$/)!
    known[g[1]] = g[2] ? `@${g[2]}` : ''
  })
  return Object.entries(known).map(([key, value]) => `${key}${value}`)
}

/**
 * Examples:
 *   ["frourio"], indent = "  " ->
 *     "frourio": "v1.0"
 *   ["frourio", "aspida", "frourio"], indent = "  " ->
 *     "aspida": "v1.0",
 *     "frourio": "v1.0"
 */
export const convertListToJson = (
  deps: { [packageName: string]: string },
  list: string[],
  indent: string
) => {
  return strUniq(list)
    .sort()
    .map((dep) => {
      let depName = dep
      let depVersion = null
      const g = dep.match(/^(@?[^@]+)@(.*)$/)
      if (g) {
        depName = g[1]
        depVersion = g[2]
      }
      assert(depName in deps, `${depName} is not pre-defined.`)
      return `${indent}${JSON.stringify(depName)}: ${JSON.stringify(
        depVersion || deps[depName]
      )}`
    })
    .join(',\n')
}
