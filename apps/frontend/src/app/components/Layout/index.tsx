import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './components/navbar';
import { Sidebar } from './components/sidebar';

export function Layout() {
  return (
    <React.Fragment>
      <div className="h-screen">
        <div id="navbar" className="bg-black w-full h-[7rem]">
          <Navbar />
        </div>
        <div className="flex">
          <aside className="w-1/6 h-[calc(100vh-7rem)] bg-black" id="sidebar">
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
