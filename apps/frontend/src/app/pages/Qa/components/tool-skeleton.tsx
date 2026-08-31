import React from 'react';
import { Skeleton } from '@/app/components/Parts/Skeleton';

export const ToolSkeleton = ({ color }: { color?: string }) => {
  return (
    <div
      className="col-span-12 lg:col-span-6 xl:col-span-4 relative p-2 flex flex-row lg:flex-col items-center lg:items-stretch justify-between lg:justify-start rounded-[.8rem] shadow-lg border-2 min-h-[8rem] lg:min-h-[14rem]"
      style={{
        backgroundColor: color
          ? `color-mix(in srgb, ${color} 20%, transparent)`
          : 'var(--card)',
        borderColor: color || 'var(--border)',
      }}
    >
      {/* Top Right Buttons Skeleton */}
      <div className="absolute rounded-[.8rem] p-4 top-1 right-1 md:top-2 md:right-2 flex items-center gap-4">
        <Skeleton className="h-[4rem] w-[4rem] rounded-[.8rem]" />
        <Skeleton className="h-[4rem] w-[4rem] rounded-[.8rem]" />
      </div>

      <div className="flex items-center gap-4 p-4">
        {/* Circular Image Skeleton */}
        <div className="p-2 rounded-full">
          <Skeleton className="h-[3rem] w-[3rem] md:h-[5rem] md:w-[5rem] rounded-full" />
        </div>
        {/* Name Skeleton */}
        <Skeleton className="h-[2.5rem] w-[15rem] hidden md:block rounded-md" />
      </div>

      {/* Description Skeleton */}
      <div className="hidden lg:block px-4 pb-4">
        <Skeleton className="h-[2rem] w-full mb-2 rounded-md" />
        <Skeleton className="h-[2rem] w-[80%] rounded-md" />
      </div>
    </div>
  );
};
