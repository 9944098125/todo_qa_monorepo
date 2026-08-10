import React from 'react';
import { RegistrationForm } from './components/RegistrationForm';

// export interface RegistrationProps {}

//export function Registration({}: RegistrationProps) {
export function Registration() {
  return (
    <React.Fragment>
      <div className="w-[50%] min-h-screen bg-center flex items-center justify-center">
        {/* Registration Form  */}
        <RegistrationForm />
      </div>
    </React.Fragment>
  );
}
