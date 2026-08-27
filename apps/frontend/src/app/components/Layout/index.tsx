import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './components/navbar';
import { Sidebar } from './components/sidebar';
import { useSelector } from 'react-redux';
import { selectSidebarToggler, selectTheme } from '../../slice/selectors';
import { ToolItem } from '@/app/pages/Qa/slice/types';

type Props = {
  children: React.ReactNode;
  tools: ToolItem[] | undefined;
};

export function Layout(props: Props) {
  const sidebarState = useSelector(selectSidebarToggler);
  const themeState = useSelector(selectTheme);

  return (
    <React.Fragment>
      <div
        className={`${themeState === 'dark' ? 'text-white' : 'text-black'} h-screen`}
      >
        <div
          id="navbar"
          className={`border-b ${themeState === 'dark' ? 'bg-black border-white' : 'bg-white border-black'} w-full h-[7rem]`}
        >
          <Navbar />
        </div>
        <div className="flex">
          <aside
            className={`w-[7rem] ${sidebarState === 'closed' ? 'md:w-[7rem]' : 'md:w-1/6'} border-r ${themeState === 'dark' ? 'bg-black border-white' : 'bg-white border-black'} overflow-hidden transition-all duration-500 ease-in-out h-[calc(100vh-7rem)]`}
            id="sidebar"
          >
            <Sidebar tools={props.tools} />
          </aside>
          <main
            className={`flex-1 ${themeState === 'dark' ? 'bg-black text-white' : 'bg-green-50 text-black'}`}
            id="outlet-container"
          >
            {props.children}
          </main>
        </div>
      </div>
    </React.Fragment>
  );
}
