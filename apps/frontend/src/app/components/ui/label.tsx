import React from 'react';
import { cn } from 'utils/twm';

type Props = {
  htmlFor: string;
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
  style?: React.CSSProperties;
};
const Label = (props: Props) => {
  const { htmlFor, children, dark, className, style } = props;
  return (
    <React.Fragment>
      <label
        style={{ color: dark ? 'white' : undefined, ...style }}
        htmlFor={htmlFor}
        className={cn('text-[14px] font-medium font-poppins', className)}
      >
        {children}
      </label>
    </React.Fragment>
  );
};

export default Label;
