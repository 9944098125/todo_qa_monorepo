import React from 'react';

type Props = {
  text: string;
  size: string;
  weight: string;
};
export const Heading = (props: Props) => {
  const { text, size, weight } = props;
  return (
    <React.Fragment>
      <h4
        className={`bg-gradient-to-r from-red-900 via-purple-600 to-teal-800 bg-clip-text text-transparent`}
        style={{
          fontSize: size,
          fontWeight: weight,
        }}
      >
        {text}
      </h4>
    </React.Fragment>
  );
};
