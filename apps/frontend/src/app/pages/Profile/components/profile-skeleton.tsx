import React from 'react';
import { useSelector } from 'react-redux';
import { selectTheme } from '@/app/slice/selectors';
import { Skeleton } from '@/app/components/Parts/Skeleton';

export function ProfileTabSkeleton() {
  const themeState = useSelector(selectTheme);
  const isDark = themeState === 'dark';

  return (
    <div
      className={`rounded-2xl p-6 md:p-8 max-w-[95%] mx-auto shadow-md border border-green-700 ${
        isDark ? 'bg-black' : 'bg-green-50/40'
      }`}
    >
      {/* Avatar Header Skeleton */}
      <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-700/30">
        <div className="w-28 h-28 rounded-full border-4 border-green-700 flex items-center justify-center p-1">
          <Skeleton className="w-full h-full rounded-full" />
        </div>

        <div className="flex flex-col items-center sm:items-start gap-2 w-full max-w-sm">
          <Skeleton className="h-[2rem] w-48 rounded-md" />
          <Skeleton className="h-[1.4rem] w-64 rounded-md" />
          <Skeleton className="h-[1.6rem] w-20 rounded-full" />
        </div>
      </div>

      {/* Form Fields Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Full Name */}
        <div>
          <Skeleton className="h-[1.4rem] w-24 mb-2 rounded-md" />
          <Skeleton className="h-[5rem] w-full rounded-[.8rem] border border-green-700/40" />
        </div>

        {/* Email Address */}
        <div>
          <Skeleton className="h-[1.4rem] w-28 mb-2 rounded-md" />
          <Skeleton className="h-[5rem] w-full rounded-[.8rem] border border-green-700/40" />
        </div>

        {/* Phone Number */}
        <div>
          <Skeleton className="h-[1.4rem] w-28 mb-2 rounded-md" />
          <Skeleton className="h-[5rem] w-full rounded-[.8rem] border border-green-700/40" />
        </div>

        {/* Bio */}
        <div className="md:col-span-2">
          <Skeleton className="h-[1.4rem] w-16 mb-2 rounded-md" />
          <Skeleton className="h-[7rem] w-full rounded-[.8rem] border border-green-700/40" />
        </div>
      </div>

      {/* Submit Button Skeleton */}
      <div className="flex justify-end mt-8">
        <Skeleton className="h-[5.5rem] w-40 rounded-xl" />
      </div>
    </div>
  );
}

export function ChangePasswordSkeleton() {
  const themeState = useSelector(selectTheme);
  const isDark = themeState === 'dark';

  return (
    <div
      className={`rounded-2xl p-6 md:p-8 max-w-[95%] mx-auto shadow-md border border-green-700 ${
        isDark ? 'bg-black' : 'bg-green-50/40'
      }`}
    >
      {/* Header Skeleton */}
      <div className="flex items-center gap-3 pb-6 border-b border-gray-700/30 mb-6">
        <div className="w-12 h-12 rounded-full border border-green-700 flex items-center justify-center p-1">
          <Skeleton className="w-full h-full rounded-full" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-[1.8rem] w-44 rounded-md" />
          <Skeleton className="h-[1.2rem] w-64 md:w-80 rounded-md" />
        </div>
      </div>

      {/* Password Fields Skeleton */}
      <div className="space-y-5">
        {/* Current Password */}
        <div>
          <Skeleton className="h-[1.4rem] w-36 mb-2 rounded-md" />
          <Skeleton className="h-[5rem] w-full rounded-[.8rem] border border-green-700/40" />
        </div>

        {/* New Password */}
        <div>
          <Skeleton className="h-[1.4rem] w-32 mb-2 rounded-md" />
          <Skeleton className="h-[5rem] w-full rounded-[.8rem] border border-green-700/40" />
        </div>

        {/* Confirm New Password */}
        <div>
          <Skeleton className="h-[1.4rem] w-44 mb-2 rounded-md" />
          <Skeleton className="h-[5rem] w-full rounded-[.8rem] border border-green-700/40" />
        </div>
      </div>

      {/* Submit Button Skeleton */}
      <div className="flex justify-end mt-8">
        <Skeleton className="h-[5.5rem] w-44 rounded-xl" />
      </div>
    </div>
  );
}
