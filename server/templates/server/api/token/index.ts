export type Methods = {
  post: {
    reqBody: {
      id: string
      pass: string
    }
    resBody: {
      token: string
    }
  }
}
