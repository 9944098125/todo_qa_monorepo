import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectTheme } from '../../slice/selectors';
import { Navbar } from './components/navbar';
import { Sidebar } from './components/sidebar';

export function Layout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  const theme = useSelector(selectTheme);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDark(mediaQuery.matches);

      const listener = (e: MediaQueryListEvent) => setIsDark(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } else {
      setIsDark(theme === 'dark');
    }
  }, [theme]);

  return (
    <div className={`${isDark ? 'dark' : ''} w-full h-full`}>
      <div className="flex flex-col h-screen w-full overflow-hidden bg-slate-50 dark:bg-black text-black dark:text-white">
        <Navbar onMobileMenuClick={() => setIsMobileOpen(true)} />
        <div className="flex flex-1 overflow-hidden relative">
          <Sidebar
            isMobileOpen={isMobileOpen}
            isDesktopCollapsed={isDesktopCollapsed}
            onCloseMobile={() => setIsMobileOpen(false)}
            onToggleDesktop={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
          />
          <main className="flex-1 overflow-y-auto w-full h-full">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
