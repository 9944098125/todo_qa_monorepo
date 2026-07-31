import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <React.Fragment>
      <div className="pt-[75px]">
        <Outlet />
      </div>
    </React.Fragment>
  );
};

export default Layout;
