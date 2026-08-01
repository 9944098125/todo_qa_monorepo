import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'app/components/ui/button';
import { Menu } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

interface NavbarProps {
  onMobileMenuClick: () => void;
}

export function Navbar({ onMobileMenuClick }: NavbarProps) {
  return (
    <header className="h-[70px] shrink-0 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 md:px-6 z-20 relative text-black dark:text-white">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden -ml-2"
          onClick={onMobileMenuClick}
          aria-label="Open Menu"
        >
          <Menu size={24} />
        </Button>
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="TodoQa Souvenir Logo"
            className="w-8 h-8 object-contain"
          />
          <span className="font-bold text-lg hidden sm:inline-block">
            TodoQa Souvenir
          </span>
        </Link>
      </div>
      <div className="flex items-center">
        <ThemeToggle />
      </div>
    </header>
  );
}
