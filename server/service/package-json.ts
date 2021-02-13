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
  list.forEach((el) => (known[el] = 0))
  return Object.keys(known)
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
      assert(dep in deps, `${dep} is not pre-defined.`)
      return `${indent}${JSON.stringify(dep)}: ${JSON.stringify(deps[dep])}`
    })
    .join(',\n')
}
