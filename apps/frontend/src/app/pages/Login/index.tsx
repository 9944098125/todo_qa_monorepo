import React, { useEffect, useState } from 'react';
import { LoginForm } from './components/login-form';

export function Login() {
  return (
    <React.Fragment>
      <div className="w-full min-h-screen relative bg-[url('/images/login-bg.avif')] bg-cover bg-center flex items-center justify-center px-0 md:px-10">
        {/* Login Form  */}
        <LoginForm />
      </div>
    </React.Fragment>
  );
}
