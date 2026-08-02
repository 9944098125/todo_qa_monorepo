import React from 'react';
import { Button } from '../../ui/button';
import { Sun } from 'lucide-react';

export function Navbar() {
  return (
    <React.Fragment>
      <div
        id="navbar"
        className="h-full flex justify-between items-center px-10"
      >
        <div id="logo-container" className="w-[5rem] h-[5rem]">
          <img src="/logo.png" alt="" />{' '}
        </div>
        <div>
          <Button
            variant="ghost"
            className="w-[3rem] h-[3rem] text-white border border-white rounded-[1rem]"
          >
            <Sun size={20} />
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
}
