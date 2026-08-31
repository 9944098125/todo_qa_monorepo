import { Skeleton } from '@/app/components/Parts/Skeleton';
import { selectTheme } from '@/app/slice/selectors';
import React from 'react';
import { useSelector } from 'react-redux';
import { ChevronDown } from 'lucide-react';

export function TodoSkeleton() {
  const themeState = useSelector(selectTheme);
  return (
    <div
      className={`${themeState === 'dark' ? 'bg-black' : 'bg-green-100'} mb-4 md:mb-8 border border-green-700 rounded-[.8rem] flex items-center justify-between px-4 py-4 w-full h-[6rem]`}
    >
      <div className="flex items-center px-4 w-full">
        <Skeleton className="h-[2.5rem] w-[40%] rounded-md" />
      </div>
      <div className="px-4">
        <ChevronDown className="h-6 w-6 text-green-700 opacity-50 shrink-0" />
      </div>
    </div>
  );
}
