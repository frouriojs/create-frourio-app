import { useState, useCallback, ChangeEvent } from 'react'
import { apiClient } from '~/utils/apiClient'
import { UserInfo } from '~/server/types'

const UserBanner = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [token, setToken] = useState('')
  const [userInfo, setUserInfo] = useState({} as UserInfo)

  const editIcon = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.length) return

      setUserInfo(
        await apiClient.user.$post({
          headers: { token },
          body: { icon: e.target.files[0] }
        })
      )
    },
    [token]
  )

  const login = useCallback(async () => {
    const id = prompt('Enter the user id (See .env)')
    const pass = prompt('Enter the user pass (See .env)')
    if (!id || !pass) return alert('Login failed')

    let newToken = ''

    try {
      newToken = (await apiClient.token.$post({ body: { id, pass } })).token
      setToken(newToken)
    } catch (e) {
      return alert('Login failed')
    }

    setUserInfo(await apiClient.user.$get({ headers: { token: newToken } }))
    setIsLoggedIn(true)
  }, [])

  const logout = useCallback(async () => {
    await apiClient.token.delete({ headers: { token } })
    setToken('')
    setIsLoggedIn(false)
  }, [token])

  return (
    <div className="user-banner">
      {isLoggedIn ? (
        <div>
          <img src={userInfo.icon} className="user-icon" />
          <span>{userInfo.name}</span>
          <input type="file" accept="image/*" onChange={editIcon} />
          <button onClick={logout}>LOGOUT</button>
        </div>
      ) : (
        <button onClick={login}>LOGIN</button>
      )}

      <style jsx>{`
        .user-banner {
          position: fixed;
          top: 0;
          right: 0;
          padding: 20px;
        }

        .user-icon {
          width: 32px;
          height: 32px;
          background: #ddd;
          vertical-align: bottom;
        }
      `}</style>
    </div>
  )
}

export default UserBanner
