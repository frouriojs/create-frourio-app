// Support sh, bash, ash, zsh, fish, ...
export const shellEscapeSingleInput = (s: string) => {
  return "'" + s.replace(/'/g, `'"'"'`).replace(/\\/g, `'"\\\\"'`) + "'"
}

// Reference: https://thinca.hatenablog.com/entry/20100210/1265813598
export const cmdEscapeSingleInput = (s: string) => {
  const escSpecial = s.replace(/[&|<>()^%]/g, (c) => c + '^')
  const escBackslash = escSpecial.replace(
    /\\+"/g,
    (c) => c.slice(0, -1).repeat(2) + '"'
  )
  const escDoubleQuotes = escBackslash.replace(/"/g, '\\^"')
  return '^"' + escDoubleQuotes + '^"'
}
