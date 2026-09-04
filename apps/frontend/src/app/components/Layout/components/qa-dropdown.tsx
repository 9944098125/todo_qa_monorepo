import { useGlobalSlice } from '@/app/slice';
import {
  selectSidebarToggler,
  selectSubheadState,
  selectTheme,
} from '@/app/slice/selectors';
import { ArrowBigDown, BadgeCheck, MessageCircleQuestion } from 'lucide-react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { SubheadItem } from './subhead-item';
import { ToolItem } from '@/app/pages/Qa/slice/types';

import { SubheadSkeleton } from './subhead-skeleton';

export default function QaDropdown({
  tools,
  isToolsLoading,
}: {
  tools: ToolItem[] | undefined;
  isToolsLoading?: boolean;
}) {
  const themeState = useSelector(selectTheme);
  const sidebarState = useSelector(selectSidebarToggler);
  const subheadState = useSelector(selectSubheadState);

  const dispatch = useDispatch();
  const { actions } = useGlobalSlice();

  const toggleViewSubheadItems = () => {
    dispatch(
      actions.setSubheadToggler(subheadState === 'view' ? 'hide' : 'view'),
    );
  };

  return (
    <React.Fragment>
      <NavLink
        to="/qa"
        className={({ isActive }) =>
          `${
            isActive
              ? themeState === 'dark'
                ? 'bg-green-700'
                : 'bg-green-700/70 text-white'
              : ''
          } rounded-[.8rem] mb-4 text-xl font-bold p-4 flex items-center`
        }
      >
        <div
          onClick={toggleViewSubheadItems}
          className="w-full flex items-center justify-between"
        >
          <div
            className={`${
              sidebarState === 'closed'
                ? 'flex justify-center items-center'
                : 'flex items-center gap-4'
            }`}
          >
            <MessageCircleQuestion />

            {sidebarState !== 'closed' && <p className="hidden lg:block">Qa</p>}
          </div>

          <div
            className={`transition-transform duration-500 ease-in-out ${
              subheadState === 'view' ? 'rotate-180' : 'rotate-0'
            } ${sidebarState === 'closed' ? 'hidden' : 'block'}`}
          >
            <ArrowBigDown />
          </div>
        </div>
      </NavLink>

      {/* Keep the wrapper mounted so both opening and closing can animate. */}
      <div
        className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-in-out ${
          subheadState === 'view'
            ? 'grid-rows-[1fr] opacity-100'
            : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          {/* Fixed-height scrollable area */}
          <div
            style={{
              padding: sidebarState === 'closed' ? '15px 5px' : '15px 10px',
            }}
            className="h-[30rem] rounded-[.8rem] overflow-y-auto border border-green-600/70"
          >
            {isToolsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <SubheadSkeleton
                  key={i}
                  color={['#3b82f6', '#ef4444', '#10b981', '#f59e0b'][i % 4]}
                />
              ))
            ) : tools?.length ? (
              tools?.map(item => <SubheadItem key={item.slug} item={item} />)
            ) : (
              <React.Fragment>
                {sidebarState === 'closed' ? null : (
                  <div
                    className={`flex-col items-center justify-center w-full hidden lg:flex min-h-[10rem]`}
                  >
                    <BadgeCheck className="" />
                    <p className="text-2rem font-800">No Tools</p>
                  </div>
                )}
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
