import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './components/navbar';
import { Sidebar } from './components/sidebar';
import { useSelector } from 'react-redux';
import { selectSidebarToggler } from '../../slice/selectors';

export function Layout() {
  const sidebarState = useSelector(selectSidebarToggler);
  return (
    <React.Fragment>
      <div className="h-screen text-white">
        <div id="navbar" className="bg-black w-full h-[7rem]">
          <Navbar />
        </div>
        <div className="flex">
          <aside
            className={`${sidebarState === 'opened' ? 'w-1/6' : 'w-[7rem]'} h-[calc(100vh-7rem)] bg-black`}
            id="sidebar"
          >
            {/* <h1 className="text-white text-2xl">Sidebar</h1> */}
            <Sidebar />
          </aside>
          <main className="flex-1" id="outlet-container">
            <Outlet />
          </main>
        </div>
      </div>
    </React.Fragment>
  );
}
