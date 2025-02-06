import type { UserInfo } from 'common/types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ChangeEvent } from 'react';
import { useCallback, useState } from 'react';
import styles from 'styles/UserBanner.module.css';
import { pagesPath } from 'utils/$path';
import { apiClient } from 'utils/apiClient';

const UserBanner = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [userInfo, setUserInfo] = useState({} as UserInfo);

  const editIcon = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.[0]) return;

      await apiClient.user
        .$post({ headers: { authorization: token }, body: { icon: e.target.files[0] } })
        .then(setUserInfo);
    },
    [token],
  );

  const login = useCallback(async () => {
    const id = prompt('Enter the user id (See server/.env)');
    const pass = prompt('Enter the user pass (See server/.env)');
    if (!id || !pass) return alert('Login failed');

    try {
      const { token } = await apiClient.token.$post({ body: { id, pass } });
      const newToken = `Bearer ${token}`;

      setToken(newToken);

      await apiClient.user.$get({ headers: { authorization: newToken } }).then(setUserInfo);

      setIsLoggedIn(true);
    } catch (_) {
      alert('Login failed');
    }
  }, []);

  const logout = useCallback(() => {
    setToken('');
    setIsLoggedIn(false);
  }, []);

  return (
    <div>
      <div className={styles.userBanner}>
        <div>
          <Link href={pagesPath.$url()} className={styles.nav}>
            Home
          </Link>
          <Link href={pagesPath.article.$url()} className={styles.nav}>
            Article
          </Link>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push(pagesPath.article.$url({ query: { search } }));
          }}
        >
          <input
            type="text"
            name="query"
            onInput={(e) => e.target instanceof HTMLInputElement && setSearch(e.target.value)}
          />
          <button type="submit">search</button>
        </form>
        <div className={styles.spacing} />
        <div>
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
      </div>
      <div className={styles.padding} />
    </div>
  );
};

export default UserBanner;
