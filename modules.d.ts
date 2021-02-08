declare module 'real-executable-path' {
  const realExecutablePath: (cmd: string) => Promise<string>
  export default realExecutablePath
}
