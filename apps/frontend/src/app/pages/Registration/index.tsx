import React from 'react';
import { RegistrationForm } from './components/form';

export interface RegistrationProps {}

export function Registration({}: RegistrationProps) {
  return (
    <React.Fragment>
      <div className="w-full min-h-screen relative bg-[url('/images/register.avif')] bg-cover bg-center flex items-center justify-center px-0 md:px-10">
        {/* Registration Form  */}
        <RegistrationForm />
      </div>
    </React.Fragment>
  );
}
