import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Moon, Sun, Sparkles } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectTheme } from '@/app/slice/selectors';
import { useGlobalSlice } from '@/app/slice';
import { useAiSlice } from '../../AiAssistant/slice';

export function Navbar() {
  const themeState = useSelector(selectTheme);
  const { actions: globalActions } = useGlobalSlice();
  const { actions: aiActions } = useAiSlice();
  const dispatch = useDispatch();

  const toggleTheme = () => {
    dispatch(globalActions.setTheme(themeState === 'dark' ? 'light' : 'dark'));
  };

  const openAiAssistant = () => {
    dispatch(aiActions.toggleDrawer(true));
  };

  return (
    <React.Fragment>
      <div
        id="navbar"
        className="h-full flex justify-between items-center px-10"
      >
        <div id="logo-container" className="flex items-center gap-4">
          <img src="/logo.png" alt="" className="w-[5rem] h-[5rem]" />
          <h3 className="text-[1.8rem] md:text-[2.6rem] font-[800] text-green-700">
            ToDoQa Souvenir
          </h3>
        </div>
        <div className="flex items-center gap-4">
          {/* AI Assistant Button */}
          <Button
            onClick={openAiAssistant}
            variant="ghost"
            title="Open AI Assistant"
            className={`h-[4rem] px-4 gap-2 border border-green-600/70 rounded-[1rem] flex items-center font-bold text-sm transition-all hover:scale-105 ${
              themeState === 'dark'
                ? 'bg-black text-white hover:bg-green-950/40 hover:border-green-500'
                : 'bg-white text-green-800 hover:bg-green-50 hover:border-green-700'
            }`}
          >
            <Sparkles size={20} className="text-green-600 animate-pulse" />
            <span className="hidden sm:inline">AI Assistant</span>
          </Button>

          {/* Theme Toggle Button */}
          <Button
            onClick={toggleTheme}
            variant="ghost"
            title="Toggle theme"
            className={`h-[4rem] px-4 gap-2 border border-green-600/70 rounded-[1rem] flex items-center font-bold text-sm transition-all hover:scale-105 ${
              themeState === 'dark'
                ? 'bg-black text-white hover:bg-green-950/40 hover:border-green-500'
                : 'bg-white text-green-800 hover:bg-green-50 hover:border-green-700'
            }`}
          >
            {themeState === 'dark' ? <Sun size={25} /> : <Moon size={25} />}
            <span className="hidden sm:inline">Toggle Theme</span>
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
}
