import React from 'react';
import { Skeleton } from '@/app/components/Parts/Skeleton';

export const UserSkeleton = () => {
  return (
    <div className="col-span-12 lg:col-span-6 xl:col-span-4 relative p-2 flex flex-row lg:flex-col items-center lg:items-stretch justify-between lg:justify-start rounded-[.8rem] shadow-lg border border-gray-200 min-h-[8rem] lg:min-h-[14rem]">
      {/* Top Right Buttons Skeleton */}
      <div className="absolute rounded-[.8rem] p-4 top-1 right-1 md:top-2 md:right-2 flex items-center gap-4">
        {/* Edit Button Skeleton */}
        <Skeleton className="h-[3rem] w-[3rem] md:h-[4rem] md:w-[4rem] rounded-[.8rem]" />

        {/* Delete Button Skeleton */}
        <Skeleton className="h-[3rem] w-[3rem] md:h-[4rem] md:w-[4rem] rounded-[.8rem]" />
      </div>

      {/* User Image and Name Skeleton */}
      <div className="flex items-center gap-4 p-4">
        {/*User Circular Image Skeleton */}
        <div className="p-2 rounded-full">
          <Skeleton className="h-[3rem] w-[3rem] md:h-[5rem] md:w-[5rem] rounded-full" />
        </div>
        {/* User Name Skeleton */}
        {/* <Skeleton className="h-[2rem] w-[10rem] md:w-[15rem] hidden md:block rounded-md" />    */}
        <Skeleton className="h-[2.5rem] w-[15rem] hidden md:block rounded-md" />
      </div>

      {/* User Email Skeleton */}
      <div className="hidden lg:block px-4 pb-3 w-full style=border-left-colored">
        <Skeleton className="h-[1.5rem] w-[80%] mb-3 rounded-md" />

        {/* User Bio Skeleton */}
        <Skeleton className="h-[1.5rem] w-full rounded-md" />
      </div>
    </div>
  );
};
