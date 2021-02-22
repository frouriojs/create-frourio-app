export const randSuffix = () => Math.random().toString().slice(2, 7)
export const randInt = (n: number) => Math.floor(Math.random() * n)
export const randChoice = <T>(arr: T[]) => arr[randInt(arr.length)]
