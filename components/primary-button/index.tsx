import styles from '~/styles/PrimaryButton.module.css'
import { FC, MouseEventHandler } from 'react'

export interface PrimaryButtonProps {
  onClick?: MouseEventHandler
  disabled?: boolean
}

const PrimaryButton: FC<PrimaryButtonProps> = ({
  disabled,
  onClick,
  children
}) => {
  return (
    <div className={styles.container}>
      <div
        className={`${styles.btn}${disabled ? ` ${styles.disabled}` : ''}`}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onClick={disabled ? () => {} : onClick}
      >
        {children}
      </div>
    </div>
  )
}

export default PrimaryButton
