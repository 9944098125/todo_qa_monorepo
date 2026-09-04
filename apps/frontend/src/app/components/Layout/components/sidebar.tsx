import React from 'react';
import { Button } from '../../ui/button';
import { ClipboardList, LogOut, ArrowRight, ArrowLeft } from 'lucide-react';
import { useGlobalSlice } from '../../../slice';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectSidebarToggler,
  selectTheme,
  selectUser,
} from '../../../slice/selectors';
import { NavLink, useNavigate } from 'react-router-dom';
import QaDropdown from './qa-dropdown';
import { ToolItem } from '@/app/pages/Qa/slice/types';

type Props = {
  tools: ToolItem[] | undefined;
  isToolsLoading?: boolean;
};

export function Sidebar(props: Props) {
  const { actions } = useGlobalSlice();
  const sidebarState = useSelector(selectSidebarToggler);
  const themeState = useSelector(selectTheme);
  const userState = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    const newState = sidebarState === 'closed' ? 'opened' : 'closed';
    dispatch(actions.sidebarToggler(newState));
  };

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        if (sidebarState !== 'closed') {
          dispatch(actions.sidebarToggler('closed'));
        }
      }
    };

    // Check on mount
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarState, dispatch, actions]);

  return (
    <React.Fragment>
      <div className="w-full h-full relative">
        <div
          className={`items-center mt-4 mb-4 px-4 ${sidebarState === 'closed' ? 'justify-center' : 'justify-end'} hidden lg:flex`}
        >
          <Button
            variant="ghost"
            onClick={toggleSidebar}
            className={`h-[5rem] w-[5rem] border border-green-600/70 rounded-xl text-inherit ${themeState === 'dark' ? 'bg-black text-white' : 'bg-white'}`}
          >
            {sidebarState === 'closed' ? (
              <ArrowRight className="h-[3rem] w-[3rem]" />
            ) : (
              <ArrowLeft className="h-[3rem] w-[3rem]" />
            )}
          </Button>
        </div>
        <div className="mb-4 px-4">
          <NavLink
            to="/todo"
            className={({ isActive }) =>
              `${isActive ? (themeState === 'dark' ? 'bg-green-700' : 'bg-green-700/70 text-white') : ''} rounded-[.8rem] text-xl font-bold p-4 flex items-center`
            }
          >
            <div
              className={`${sidebarState === 'closed' ? 'flex justify-center items-center' : 'flex items-center gap-4'}`}
            >
              <ClipboardList />
              {sidebarState === 'closed' ? null : (
                <p className="hidden lg:block">Todo</p>
              )}
            </div>
          </NavLink>
        </div>
        <div className="mb-4 px-4">
          {/* qa dropdown */}
          <QaDropdown
            tools={props.tools}
            isToolsLoading={props.isToolsLoading}
          />
        </div>
        <div
          className={`absolute w-full bottom-5 px-5 py-2 border-t border-white flex ${sidebarState === 'closed' ? 'flex-col items-center' : 'flex-row justify-between'}`}
        >
          <div className={`flex items-center flex-1 min-w-0 mr-2`}>
            <div className="h-[5rem] w-[5rem] shrink-0">
              <img
                src={userState?.profilePicture}
                alt=""
                className={`rounded-full h-full w-full object-cover`}
              />
            </div>
            <h4
              title={userState?.name}
              className={`${sidebarState === 'closed' ? 'hidden' : 'block'} text-[1.8rem] ml-2 font-800 truncate`}
            >
              {userState?.name}
            </h4>
          </div>
          <div className="px-2 shrink-0">
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
