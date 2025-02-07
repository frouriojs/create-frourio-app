export const randSuffix = (): string => Math.random().toString().slice(2, 7);

export const randInt = (n: number): number => Math.floor(Math.random() * n);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const randChoice = <T>(arr: T[]): T => arr[randInt(arr.length)]!;
