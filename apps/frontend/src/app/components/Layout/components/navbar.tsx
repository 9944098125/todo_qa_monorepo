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
        <div id="logo-container" className="flex items-center gap-4">
          <img src="/logo.png" alt="" className="w-[5rem] h-[5rem]" />
          <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            ToDoQa Souvenir
          </h3>
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
