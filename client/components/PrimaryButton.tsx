import type { FC, MouseEventHandler } from 'react';
import styles from 'styles/PrimaryButton.module.css';

export interface PrimaryButtonProps {
  onClick?: MouseEventHandler;
  disabled?: boolean;
  children: React.ReactNode;
}

export const PrimaryButton: FC<PrimaryButtonProps> = ({ disabled, onClick, children }) => {
  return (
    <div className={styles.container}>
      <button
        className={`${styles.btn}${disabled ? ` ${styles.disabled}` : ''}`}
        onClick={disabled ? () => {} : onClick}
      >
        {children}
      </button>
    </div>
  );
};
