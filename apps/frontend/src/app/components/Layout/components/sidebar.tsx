import React from 'react';
import { Button } from '../../ui/button';
import { Sun } from 'lucide-react';

export function Sidebar() {
  return (
    <React.Fragment>
      <div>
        <h1 className="text-white text-2xl">Sidebar</h1>
      </div>
      <div>
        <h4 className="text-white text-1x">Todo</h4>
      </div>
      <div>
        <h4 className="text-white text-1x">Qa</h4>
      </div>
    </React.Fragment>
  );
}
