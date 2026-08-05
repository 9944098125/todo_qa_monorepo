import React, { useState } from 'react';
import { Button } from '../../ui/button';
import {
  ClipboardList,
  LogOut,
  MenuIcon,
  MessageCircleQuestion,
} from 'lucide-react';
import { useGlobalSlice } from '../../../slice';
import { useDispatch, useSelector } from 'react-redux';
import { selectSidebarToggler } from '../../../slice/selectors';
import { NavLink } from 'react-router-dom';

export function Sidebar() {
  const { actions } = useGlobalSlice();
  const sidebarState = useSelector(selectSidebarToggler);
  const dispatch = useDispatch();

  const [sidebarClosed, setSidebarClosed] = useState<boolean>(false);

  const toggleSidebar = () => {
    setSidebarClosed(prev => !prev);
    dispatch(actions.sidebarToggler(sidebarClosed ? 'closed' : 'opened'));
  };

  return (
    <React.Fragment>
      <div className="w-full h-full relative">
        <div
          className={`flex items-center mt-4 mb-4 px-4 ${sidebarState === 'closed' ? 'justify-center' : 'justify-end'}`}
        >
          <Button
            onClick={toggleSidebar}
            className="h-[5rem] w-[5rem] border border-cyan-600 rounded-xl"
          >
            <MenuIcon className="h-[3rem] w-[3rem]" />
          </Button>
        </div>
        <div className="mb-4 px-4">
          <NavLink
            to="/todo"
            className={({ isActive }) =>
              `${isActive ? 'bg-white/50' : 'border-0'} rounded-[.8rem] text-xl font-bold p-4 flex items-center`
            }
          >
            <div
              className={`${sidebarState === 'closed' ? 'flex justify-center items-center' : 'flex items-center gap-4'}`}
            >
              <ClipboardList />
              {sidebarState === 'closed' ? null : <p>Todo</p>}
            </div>
          </NavLink>
        </div>
        <div className="mb-4 px-4">
          <NavLink
            to="/qa"
            className={({ isActive }) =>
              `${isActive ? 'bg-white/50' : 'border-0'} rounded-[.8rem] text-xl font-bold p-4 flex items-center`
            }
          >
            <div
              className={`${sidebarState === 'closed' ? 'flex justify-center items-center' : 'flex items-center gap-4'}`}
            >
              <MessageCircleQuestion />
              {sidebarState === 'closed' ? null : <p>Qa</p>}
            </div>
          </NavLink>
        </div>
        <div className="absolute bottom-0 px-5 py-2 border-t border-white">
          <div
            className={`flex items-center ${sidebarState === 'closed' ? 'justify-center' : 'gap-4'}`}
          >
            <img
              src="https://images.unsplash.com/photo-1615109398623-88346a601842?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFufGVufDB8fDB8fHww"
              alt=""
              className={`${sidebarState === 'closed' ? 'hidden' : 'block'} rounded-full h-20 w-20`}
            />
            <h4
              className={`${sidebarState === 'closed' ? 'hidden' : 'block'} text-xl font-700`}
            >
              Srinivas
            </h4>
            <LogOut
              className={`${sidebarState === 'closed' ? '-ml-2' : 'ml-10'} h-[6rem] w-[6rem] bg-red-600 rounded-[.8rem] p-4`}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
