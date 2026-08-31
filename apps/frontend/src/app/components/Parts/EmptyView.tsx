import React from 'react';
import { Inbox } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectTheme } from '@/app/slice/selectors';

type EmptyViewProps = {
  title: string;
  description: string;
};

export const EmptyView = ({ title, description }: EmptyViewProps) => {
  const themeState = useSelector(selectTheme);

  return (
    <div
      className={`col-span-12 flex flex-col items-center justify-center w-full min-h-[30rem] p-10 rounded-[1.5rem] border-2 border-dashed transition-all duration-300 hover:scale-[1.01] ${themeState === 'dark' ? 'border-gray-800 bg-gray-900/20' : 'border-gray-300 bg-gray-50'}`}
    >
      <div
        className={`p-6 rounded-full mb-6 ${themeState === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-400 shadow-sm'}`}
      >
        <Inbox className="w-20 h-20" strokeWidth={1.5} />
      </div>
      <h3
        className={`text-3xl font-bold mb-3 ${themeState === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}
      >
        {title}
      </h3>
      <p
        className={`text-[1.6rem] text-center max-w-md ${themeState === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}
      >
        {description}
      </p>
    </div>
  );
};
