import type { ReactNode } from 'react';
import 'styles/globals.css';
import { staticPath } from 'utils/$path';
import styles from './layout.module.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <title>frourio-todo-app</title>
        <link rel="icon" href={staticPath.favicon_png} />
      </head>
      <body>
        <div className={styles.container}>
          {children}
          <footer className={styles.footer}>
            <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Powered by{' '}
              <img src={staticPath.vercel_svg} alt="Vercel Logo" className={styles.logo} />
            </a>
          </footer>
        </div>
      </body>
    </html>
  );
}
