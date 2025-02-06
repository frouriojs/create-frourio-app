import type { FC } from 'react';
import { useRef } from 'react';

export interface Props {
  value?: string;
}

const CommandInput: FC<Props> = ({ value }) => {
  const ref = useRef<HTMLInputElement>(null);
  const clickHandler = () => {
    if (!ref.current) return;
    ref.current.select();
  };
  return (
    <input
      ref={ref}
      style={{ width: '100%' }}
      onClick={clickHandler}
      type="text"
      value={value}
      readOnly
    />
  );
};

export default CommandInput;
