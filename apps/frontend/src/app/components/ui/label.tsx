import React from 'react';

type Props = {
  htmlFor: string;
  children: React.ReactNode;
  dark?: boolean;
};
const Label = (props: Props) => {
  const { htmlFor, children, dark } = props;
  return (
    <React.Fragment>
      <label
        style={{ color: dark ? 'white' : '' }}
        htmlFor={htmlFor}
        className="text-[14px] font-medium font-poppins"
      >
        {children}
      </label>
    </React.Fragment>
  );
};

export default Label;
