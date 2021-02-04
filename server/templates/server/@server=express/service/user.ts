import fs from 'fs'
import path from 'path'
import {
  API_ORIGIN,
  API_USER_ID,
  API_USER_PASS,
  API_DYNAMIC_DIR
} from './envValues'
import { MulterFile } from '$/$server'

const iconsDir = API_DYNAMIC_DIR && path.resolve(API_DYNAMIC_DIR, 'icons')
const createIconURL = (dir: string, name: string) =>
  `${API_ORIGIN}/${dir}icons/${name}`
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getUserIconName = (_id: string) => {
  return `user-icon`
}
export const getUserInfo = (id: string) => {
  const iconName = getUserIconName(id)
  return {
    name: 'sample user',
    icon:
      iconsDir && fs.existsSync(path.resolve(iconsDir, iconName))
        ? createIconURL('dynamic/', iconName)
        : createIconURL('static/', `dummy.svg`)
  }
}

export const validateUser = (id: string, pass: string) =>
  id === API_USER_ID && pass === API_USER_PASS

export const getUserInfoById = (id: string) => ({ id, ...getUserInfo(id) })

export const changeIcon = async (id: string, iconFile: MulterFile) => {
  const iconName = getUserIconName(id)

  if (!iconsDir) {
    throw new Error('API_DYNAMIC_DIR is not configured.')
  }

  await fs.promises.mkdir(iconsDir, { recursive: true })

  await fs.promises.writeFile(
    path.resolve(iconsDir, iconName),
    iconFile.buffer
  )

  return {
    id,
    ...getUserInfo(id)
  }
}
