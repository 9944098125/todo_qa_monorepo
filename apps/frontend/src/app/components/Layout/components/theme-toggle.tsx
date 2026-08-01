import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from 'app/components/ui/button';
import { selectTheme } from '../../../slice/selectors';
import { globalActions } from '../../../slice';

export function ThemeToggle() {
  const theme = useSelector(selectTheme);
  const dispatch = useDispatch();

  const cycleTheme = () => {
    if (theme === 'light') dispatch(globalActions.setTheme('dark'));
    else if (theme === 'dark') dispatch(globalActions.setTheme('system'));
    else dispatch(globalActions.setTheme('light'));
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      aria-label="Toggle theme"
      title={`Current theme: ${theme}`}
    >
      {theme === 'light' && <Sun size={20} />}
      {theme === 'dark' && <Moon size={20} />}
      {theme === 'system' && <Monitor size={20} />}
    </Button>
  );
}
