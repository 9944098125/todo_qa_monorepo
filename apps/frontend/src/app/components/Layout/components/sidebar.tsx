import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  CheckSquare,
  LayoutDashboard,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from 'app/components/ui/button';

interface SidebarProps {
  isMobileOpen: boolean;
  isDesktopCollapsed: boolean;
  onCloseMobile: () => void;
  onToggleDesktop: () => void;
}

const navItems = [
  { path: '/', label: 'Todo', icon: CheckSquare },
  { path: '/qa', label: 'Qa', icon: LayoutDashboard },
  { path: '/profile', label: 'Profile', icon: User },
];

export function Sidebar({
  isMobileOpen,
  isDesktopCollapsed,
  onCloseMobile,
  onToggleDesktop,
}: SidebarProps) {
  // Close mobile sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        onCloseMobile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, onCloseMobile]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-30 bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-gray-800 text-black dark:text-white
    flex flex-col transition-all duration-300 ease-in-out
    md:relative md:translate-x-0
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
    ${isDesktopCollapsed ? 'md:w-[72px]' : 'md:w-[260px]'}
    w-[260px]
  `;

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 transition-opacity md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Content */}
      <aside className={sidebarClasses}>
        {/* Toggle Button - Desktop Only */}
        <div className="hidden md:flex items-center justify-end p-3 h-[70px]">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDesktop}
            aria-label={
              isDesktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
            }
          >
            {isDesktopCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </Button>
        </div>

        {/* Mobile Header Spacer */}
        <div className="h-[70px] md:hidden border-b border-gray-200 dark:border-gray-800 flex items-center px-4">
          <span className="font-bold text-lg text-black dark:text-white">
            Menu
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-2">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-3 rounded-md transition-colors
                ${isActive ? 'bg-primary text-primary-foreground' : 'text-black dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900'}
                ${isDesktopCollapsed ? 'md:justify-center' : 'justify-start'}
              `}
              title={isDesktopCollapsed ? item.label : undefined}
            >
              <item.icon size={24} className="shrink-0" />
              <span
                className={`whitespace-nowrap transition-opacity duration-200 ${isDesktopCollapsed ? 'md:hidden' : 'block'}`}
              >
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Profile Section */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-3">
          <div
            className={`flex items-center ${isDesktopCollapsed ? 'md:flex-col md:gap-3' : 'justify-between gap-2'}`}
          >
            <div
              className={`flex items-center gap-3 ${isDesktopCollapsed ? 'md:hidden' : 'flex'} flex-1 min-w-0`}
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center shrink-0">
                <User size={20} className="text-black dark:text-white" />
              </div>
              <div className="truncate">
                <p className="text-sm font-medium text-black dark:text-white truncate">
                  User Name
                </p>
              </div>
            </div>

            {/* Show only avatar and logout when collapsed */}
            {isDesktopCollapsed && (
              <div className="hidden md:flex w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 items-center justify-center shrink-0">
                <User size={20} className="text-black dark:text-white" />
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className={`text-muted-foreground hover:text-destructive hover:bg-destructive/10 ${isDesktopCollapsed ? 'md:w-full' : ''}`}
              title="Logout"
            >
              <LogOut size={20} />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
