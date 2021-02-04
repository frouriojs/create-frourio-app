import { convertListToJson } from '../package-json'

describe('convertListToJson', () => {
  const deps = {
    frourio: 'v1.0.0',
    aspida: 'v1.0.0',
    '@types/node': 'v1.0.0'
  }
  it('[frourio], indent="  "', () => {
    expect(convertListToJson(deps, ['frourio'], '  ')).toMatch(
      /^ {2}"frourio": "v.*"$/
    )
  })
  it('[frourio, aspida, frourio, frourio, @types/node], indent=" "', () => {
    expect(
      convertListToJson(
        deps,
        ['frourio', 'aspida', 'frourio', 'frourio', '@types/node'],
        ' '
      )
    ).toMatch(/^ "@types\/node": "v.*",\n "aspida": "v.*",\n "frourio": "v.*"$/)
  })
})
