import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { ClipboardList, MenuIcon, MessageCircleQuestion } from 'lucide-react';
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
      <div className="w-full">
        <div
          className={`flex items-center ${sidebarState === 'closed' ? 'justify-center' : 'justify-end'}`}
        >
          <Button
            onClick={toggleSidebar}
            className="h-[5rem] w-[5rem] text-white border border-white rounded-xl"
          >
            <MenuIcon className="h-[3rem] w-[3rem]" />
          </Button>
        </div>
        <div className="mb-4">
          <NavLink
            to="/todo"
            className={({ isActive }) =>
              `${isActive ? 'bg-white/50' : 'border-0'} text-xl font-bold p-4 flex items-center`
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
        <div className="mb-4">
          <NavLink
            to="/qa"
            className={({ isActive }) =>
              `${isActive ? 'bg-white/50' : 'border-0'} text-xl font-bold p-4 flex items-center`
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
      </div>
    </React.Fragment>
  );
}
