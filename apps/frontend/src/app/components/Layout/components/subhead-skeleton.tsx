import React from 'react';
import { useSelector } from 'react-redux';
import { selectSidebarToggler } from '@/app/slice/selectors';
import { Skeleton } from '@/app/components/Parts/Skeleton';

export const SubheadSkeleton = ({ color }: { color?: string }) => {
  const sidebarState = useSelector(selectSidebarToggler);

  return (
    <React.Fragment>
      <div
        style={{
          padding: sidebarState === 'closed' ? '5px' : '5px 5px',
          backgroundColor: color
            ? `color-mix(in srgb, ${color} 20%, transparent)`
            : 'var(--card)',
        }}
        className={`w-full flex items-center ${sidebarState === 'closed' && 'justify-center'} gap-4 mb-4 rounded-[.8rem] border border-transparent`}
      >
        <div className="p-1 rounded-full">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <Skeleton
          className={`h-4 w-20 rounded-md ${sidebarState === 'closed' ? 'hidden' : 'block'}`}
        />
      </div>
    </React.Fragment>
  );
};
