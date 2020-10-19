import fs from 'fs'
import path from 'path'
import { Multipart } from 'fastify-multipart'
import { API_ORIGIN, BASE_PATH, USER_ID, USER_PASS } from './envValues'

const iconsDir = 'public/icons'
const createIconURL = (name: string) =>
  `${API_ORIGIN}${BASE_PATH}/icons/${name}`
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

export const changeIcon = async (id: string, iconFile: Multipart) => {
  const iconName = `${Date.now()}${path.extname(iconFile.filename)}`

  await fs.promises.writeFile(
    path.resolve(iconsDir, iconName),
    await iconFile.toBuffer()
  )

  userInfo.icon = createIconURL(iconName)
  return { id, ...userInfo }
}
