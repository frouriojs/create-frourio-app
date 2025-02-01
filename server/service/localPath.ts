import fs from 'fs'

export type PathStatus = {
  isFile: boolean
  isDirectory: boolean
  isEmpty: boolean
}

export const getPathStatus = async (path: string): Promise<PathStatus> => {
  const [stat, isEmpty] = await Promise.all([
    fs.promises.stat(path).catch(() => ({ isDirectory: () => false, isFile: () => false })),
    fs.promises
      .readdir(path)
      .then((dir) => dir.length === 0)
      .catch(() => false)
  ])

  return { isDirectory: stat.isDirectory(), isFile: stat.isFile(), isEmpty }
}

export const canContinueOnPath = (pathStatus: PathStatus): null | string => {
  if (pathStatus.isFile) return 'The file you specified already exists.'

  if (pathStatus.isDirectory && !pathStatus.isEmpty) {
    return 'The directoy you specified already exists and not empty.'
  }

  return null
}
