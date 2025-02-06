import type { FC, ReactNode } from 'react';
import { staticPath } from 'utils/$path';
import styles from './Layout.module.css';
import UserBanner from './UserBanner';

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className={styles.container}>
      <UserBanner />
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by <img src={staticPath.vercel_svg} alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
};

export default Layout;
