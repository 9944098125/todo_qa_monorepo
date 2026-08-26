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
        className="text-green-600"
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
