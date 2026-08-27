import { useGlobalSlice } from '@/app/slice';
import {
  selectSidebarToggler,
  selectSubheadState,
  selectTheme,
} from '@/app/slice/selectors';
import { ArrowBigDown, MessageCircleQuestion } from 'lucide-react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { SubheadItem } from './subhead-item';
import { ToolItem } from '@/app/pages/Qa/slice/types';

export default function QaDropdown({
  tools,
}: {
  tools: ToolItem[] | undefined;
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

            {sidebarState !== 'closed' && <p className="hidden md:block">Qa</p>}
          </div>

          <div
            className={`transition-transform duration-500 ease-in-out ${
              subheadState === 'view' ? 'rotate-180' : 'rotate-0'
            }`}
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
          <div className="h-[40rem] overflow-y-auto">
            {tools?.map(item => (
              <SubheadItem key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
