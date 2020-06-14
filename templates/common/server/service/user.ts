import fs from 'fs'
import path from 'path'
import { File } from 'frourio'
import { SERVER_PORT, USER_ID, USER_PASS } from './envValues'

const iconsDir = 'server/public/icons'
const createIconURL = (name: string) =>
  `http://localhost:${SERVER_PORT}/icons/${name}`
const userInfo = {
  name: 'sample user',
  icon: createIconURL(
    fs
      .readdirSync(path.resolve(iconsDir))
      .filter((n) => n !== 'dammy.svg')
      .pop() ?? 'dammy.svg'
  )
}

let userToken: string | null = null

export const validateUser = (id: string, pass: string) =>
  id === USER_ID && pass === USER_PASS

export const validateToken = (token: string) =>
  userToken !== null && token === userToken

export const getUserIdByToken = (token: string) =>
  validateToken(token) && { id: USER_ID }

export const getUserInfoById = (id: string) => ({ id, ...userInfo })

export const createToken = () => {
  userToken = `token:${Date.now()}`
  return userToken
}

export const deleteToken = (token: string) => {
  if (validateToken(token)) userToken = null
}

export const changeIcon = async (id: string, iconFile: File) => {
  const iconName = `${Date.now()}${path.extname(iconFile.originalname)}`

  await fs.promises.copyFile(iconFile.path, path.resolve(iconsDir, iconName))
  await fs.promises.unlink(iconFile.path)

  userInfo.icon = createIconURL(iconName)
  return { id, ...userInfo }
}
