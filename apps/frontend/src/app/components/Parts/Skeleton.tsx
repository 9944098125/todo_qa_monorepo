import { selectTheme } from '@/app/slice/selectors';
import React from 'react';
import { useSelector } from 'react-redux';

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const themeState = useSelector(selectTheme);
  return (
    <React.Fragment>
      <div
        className={`animate-shimmer bg-[length:200%_100%] h-10 w-full rounded-md ${
          themeState === 'dark'
            ? 'bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800'
            : 'bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300'
        } ${className}`}
        {...props}
      />
    </React.Fragment>
  );
}
