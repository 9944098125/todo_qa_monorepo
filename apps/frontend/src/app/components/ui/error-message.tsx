import React from 'react';

const ErrorMessage = ({ error }: { error: any }) => {
  return (
    <React.Fragment>
      <div className="w-full">
        {error && (
          <p className="text-red-600 text-[10px] font-poppins font-medium">
            {error?.message as string}
          </p>
        )}
      </div>
    </React.Fragment>
  );
};

export default ErrorMessage;
