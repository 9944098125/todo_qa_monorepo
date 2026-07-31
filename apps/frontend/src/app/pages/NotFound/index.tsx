import React from 'react';
import { Helmet } from 'react-helmet-async';

export function NotFound() {
  return (
    <React.Fragment>
      <Helmet>
        <title>404 Page Not Found</title>
        <meta name="description" content="Page not found" />
      </Helmet>
      <div className="bg-red-50 w-full h-screen flex flex-col items-center justify-center">
        <div className="flex items-center w-full max-w-[200px]">
          {/* Left line */}
          <div className="flex-grow h-[2px] bg-red-500"></div>
          {/* X */}
          <p className="text-red-600 text-2xl font-medium mx-2">x</p>
          {/* Right line */}
          <div className="flex-grow h-[2px] bg-red-500"></div>
        </div>
        {/* Not Found Text */}
        <h5 className="text-2xl text-red-600 font-poppins font-medium mt-4">
          Not Found
        </h5>
        <div className="flex items-center w-full max-w-[200px]">
          {/* Left line */}
          <div className="flex-grow h-[2px] bg-red-500"></div>
          {/* X */}
          <p className="text-red-600 text-2xl font-medium mx-2">x</p>
          {/* Right line */}
          <div className="flex-grow h-[2px] bg-red-500"></div>
        </div>
      </div>
    </React.Fragment>
  );
}
