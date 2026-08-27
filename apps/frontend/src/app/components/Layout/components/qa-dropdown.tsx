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

export default function QaDropdown() {
  const themeState = useSelector(selectTheme);
  const sidebarState = useSelector(selectSidebarToggler);
  const subheadState = useSelector(selectSubheadState);

  const dispatch = useDispatch();
  const { actions } = useGlobalSlice();

  const tools = [
    {
      _id: '654656456456456456',
      userId: '685ec8256a3964581b1c8357',
      name: 'ReactJs',
      slug: 'react',
      image:
        'https://static.vecteezy.com/system/resources/thumbnails/067/565/536/small/react-logo-rounded-free-png.png',
      color: '#61DAFB',
      description: 'A JavaScript library for building user interfaces.',
    },
    {
      _id: '654656456456456457',
      userId: '685ec8256a3964581b1c8357',
      name: 'Node.js',
      slug: 'node-js',
      image: 'https://cdn.simpleicons.org/nodedotjs/339933',
      color: '#339933',
      description: 'A JavaScript runtime built on Chrome’s V8 engine.',
    },
    {
      _id: '654656456456456458',
      userId: '685ec8256a3964581b1c8357',
      name: 'JavaScript',
      slug: 'javascript',
      image: 'https://cdn.simpleicons.org/javascript/F7DF1E',
      color: '#F7DF1E',
      description: 'A programming language commonly used for web development.',
    },
    {
      _id: '654656456456456459',
      userId: '685ec8256a3964581b1c8357',
      name: 'TypeScript',
      slug: 'typescript',
      image: 'https://cdn.simpleicons.org/typescript/3178C6',
      color: '#3178C6',
      description:
        'A strongly typed programming language built on top of JavaScript.',
    },
    {
      _id: '654656456456456460',
      userId: '685ec8256a3964581b1c8357',
      name: 'Express.js',
      slug: 'express-js',
      image: 'https://cdn.simpleicons.org/express/FFFFFF',
      color: '#000000',
      description: 'A minimal and flexible Node.js web application framework.',
    },
    {
      _id: '654656456456456461',
      userId: '685ec8256a3964581b1c8357',
      name: 'MongoDB',
      slug: 'mongodb',
      image: 'https://cdn.simpleicons.org/mongodb/47A248',
      color: '#47A248',
      description:
        'A document-oriented NoSQL database designed for scalability and flexibility.',
    },
  ];

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
            {tools.map(item => (
              <SubheadItem key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
