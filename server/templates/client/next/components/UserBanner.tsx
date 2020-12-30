import { useState, useCallback } from 'react'
import styles from '~/styles/UserBanner.module.css'
import { apiClient } from '~/utils/apiClient'
import type { UserInfo } from '$/types'
import type { ChangeEvent } from 'react'

const UserBanner = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [token, setToken] = useState('')
  const [userInfo, setUserInfo] = useState({} as UserInfo)

  const editIcon = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.length) return

      setUserInfo(
        await apiClient.user.$post({
          headers: { authorization: token },
          body: { icon: e.target.files[0] }
        })
      )
    },
    [token]
  )

  const login = useCallback(async () => {
    const id = prompt('Enter the user id (See server/.env)')
    const pass = prompt('Enter the user pass (See server/.env)')
    if (!id || !pass) return alert('Login failed')

    let newToken = ''

    try {
      newToken = `Bearer ${
        (await apiClient.token.$post({ body: { id, pass } })).token
      }`
      setToken(newToken)
    } catch (e) {
      return alert('Login failed')
    }

    setUserInfo(
      await apiClient.user.$get({ headers: { authorization: newToken } })
    )
    setIsLoggedIn(true)
  }, [])

  const logout = useCallback(() => {
    setToken('')
    setIsLoggedIn(false)
  }, [])

  return (
    <div className={styles.userBanner}>
      {isLoggedIn ? (
        <>
          <img src={userInfo.icon} className={styles.userIcon} />
          <span>{userInfo.name}</span>
          <input type="file" accept="image/*" onChange={editIcon} />
          <button onClick={logout}>LOGOUT</button>
        </>
      ) : (
        <button onClick={login}>LOGIN</button>
      )}
    </div>
  )
}

export default UserBanner
