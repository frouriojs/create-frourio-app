import {capitailze} from ".."

describe('capitailze', () => {
  it('capitalize an alphabetical word', () => {
    expect(capitailze('abc')).toBe('Abc')
    expect(capitailze('XYZ')).toBe('XYZ')
  })
})
