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
import {
  selectSidebarToggler,
  selectTheme,
  selectUser,
} from '../../../slice/selectors';
import { NavLink, useNavigate } from 'react-router-dom';

export function Sidebar() {
  const { actions } = useGlobalSlice();
  const sidebarState = useSelector(selectSidebarToggler);
  const themeState = useSelector(selectTheme);
  const userState = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sidebarClosed, setSidebarClosed] = useState<boolean>(false);

  const toggleSidebar = () => {
    setSidebarClosed(prev => !prev);
    dispatch(actions.sidebarToggler(sidebarClosed ? 'closed' : 'opened'));
  };

  return (
    <React.Fragment>
      <div className="w-full h-full relative">
        <div
          className={`flex items-center mt-4 mb-4 px-4 ${sidebarState === 'closed' ? 'justify-center' : 'justify-end'} hidden md:block`}
        >
          <Button
            onClick={toggleSidebar}
            className="h-[5rem] w-[5rem] border border-cyan-600 rounded-xl text-inherit"
          >
            <MenuIcon className="h-[3rem] w-[3rem]" />
          </Button>
        </div>
        <div className="mb-4 px-4">
          <NavLink
            to="/todo"
            className={({ isActive }) =>
              `${isActive ? (themeState === 'dark' ? 'bg-white/50' : 'bg-green-700/70 text-white') : ''} rounded-[.8rem] text-xl font-bold p-4 flex items-center`
            }
          >
            <div
              className={`${sidebarState === 'closed' ? 'flex justify-center items-center' : 'flex items-center gap-4'}`}
            >
              <ClipboardList />
              {sidebarState === 'closed' ? null : (
                <p className="hidden md:block">Todo</p>
              )}
            </div>
          </NavLink>
        </div>
        <div className="mb-4 px-4">
          <NavLink
            to="/qa"
            className={({ isActive }) =>
              `${isActive ? (themeState === 'dark' ? 'bg-white/50' : 'bg-green-700/70 text-white') : ''} rounded-[.8rem] text-xl font-bold p-4 flex items-center`
            }
          >
            <div
              className={`${sidebarState === 'closed' ? 'flex justify-center items-center' : 'flex items-center gap-4'}`}
            >
              <MessageCircleQuestion />
              {sidebarState === 'closed' ? null : (
                <p className="hidden md:block">Qa</p>
              )}
            </div>
          </NavLink>
        </div>
        <div className="absolute w-full bottom-5 px-5 py-2 border-t border-white flex flex-col md:flex-row justify-between items-center">
          <div className={`flex items-center`}>
            <img
              src={userState?.profilePicture}
              alt=""
              className={`rounded-full h-[5rem] w-[5rem]`}
            />
            <h4
              className={`${sidebarState === 'closed' ? 'hidden' : 'block'} text-[1.8rem] ml-2 font-800`}
            >
              {userState?.name}
            </h4>
          </div>
          <div className="px-2">
            <LogOut
              onClick={() => {
                dispatch(actions.logout());
                navigate('/', { replace: true });
              }}
              className={`${sidebarState === 'closed' ? '-ml-2' : 'ml-10'} cursor-pointer h-[5rem] w-[5rem] bg-red-600 text-white rounded-[.8rem] p-4`}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
