import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Moon, Sun } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectTheme } from '@/app/slice/selectors';
import { useGlobalSlice } from '@/app/slice';
import { Theme } from '@/app/slice/types';
import { useDispatch } from 'react-redux';

export function Navbar() {
  const themeState = useSelector(selectTheme);
  const { actions } = useGlobalSlice();
  const dispatch = useDispatch();

  const [isDark, setIsDark] = useState<boolean>(true);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
    dispatch(actions.setTheme(isDark ? 'dark' : 'light'));
  };

  return (
    <React.Fragment>
      <div
        id="navbar"
        className="h-full flex justify-between items-center px-10"
      >
        <div id="logo-container" className="flex items-center gap-4">
          <img src="/logo.png" alt="" className="w-[5rem] h-[5rem]" />
          <h3 className="text-[1.8rem] md:text-[2.6rem] font-[800] text-green-700/70">
            ToDoQa Souvenir
          </h3>
        </div>
        <div>
          <Button
            onClick={toggleTheme}
            variant="ghost"
            className={`w-[4rem] h-[4rem] border border-cyan-600 rounded-[1rem] ${themeState === 'dark' ? 'text-white' : 'text-black'}`}
          >
            {themeState === 'dark' ? <Sun size={25} /> : <Moon size={25} />}
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
}
