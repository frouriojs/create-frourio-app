import fs from 'fs'
import path from 'path'
import type { MultipartFile } from '@fastify/multipart'
import {
  API_ORIGIN,
  API_USER_ID,
  API_USER_PASS,
  API_UPLOAD_DIR
} from './envValues'

const iconsDir = API_UPLOAD_DIR && path.resolve(API_UPLOAD_DIR, 'icons')

const createIconURL = (dir: string, name: string) =>
  `${API_ORIGIN}/${dir}icons/${name}`

const getUserIconName = () => {
  return 'user-icon'
}

const getUserInfo = () => {
  const iconName = getUserIconName()
  return {
    name: 'sample user',
    icon:
      iconsDir && fs.existsSync(path.resolve(iconsDir, iconName))
        ? createIconURL('upload/', iconName)
        : createIconURL('static/', 'dummy.svg')
  }
}

export const validateUser = (id: string, pass: string) =>
  id === API_USER_ID && pass === API_USER_PASS

export const getUserInfoById = (id: string) => ({ id, ...getUserInfo() })

export const changeIcon = async (id: string, iconFile: MultipartFile) => {
  const iconName = getUserIconName()

  if (!iconsDir) {
    throw new Error('API_UPLOAD_DIR is not configured.')
  }

  await fs.promises.mkdir(iconsDir, { recursive: true })

  await fs.promises.writeFile(
    path.resolve(iconsDir, iconName),
    await iconFile.toBuffer()
  )

  return {
    id,
    ...getUserInfo()
  }
}
