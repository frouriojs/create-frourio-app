export type LocalPathInfo = {
  canContinue: null | string
  absPath: string
}

export type Methods = {
  post: {
    reqBody: {
      path: string
    }
    resBody: LocalPathInfo
  }
}
