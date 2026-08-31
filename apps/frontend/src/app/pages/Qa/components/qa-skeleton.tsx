import React from 'react';
import { Skeleton } from '@/app/components/Parts/Skeleton';

export const QaSkeleton = ({ color }: { color?: string }) => {
  return (
    <article
      className="group mb-4 relative w-full overflow-hidden rounded-[0.8rem] bg-card transition-all duration-300"
      style={{
        borderLeftWidth: '6px',
        borderLeftStyle: 'solid',
        borderLeftColor: color || 'var(--border)',
        borderTopWidth: '1px',
        borderRightWidth: '1px',
        borderBottomWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--border)',
      }}
    >
      <div className="p-6">
        {/* Question Section Skeleton */}
        <div className="mb-6 w-full flex items-center justify-between">
          <div className="w-[70%] lg:w-[90%]">
            <Skeleton className="h-[3rem] w-[80%] rounded-md" />
          </div>
          {/* Action Buttons Skeleton */}
          <div className="w-[30%] lg:w-[10%] flex items-center gap-4">
            <Skeleton className="h-[3rem] w-[3rem] lg:h-[5rem] lg:w-[5rem] rounded-[.8rem]" />
            <Skeleton className="h-[3rem] w-[3rem] lg:h-[5rem] lg:w-[5rem] rounded-[.8rem]" />
          </div>
        </div>

        {/* Answer Section Skeleton */}
        <div
          className="rounded-lg border bg-muted/20 p-5 shadow-inner"
          style={{
            borderLeftWidth: '3px',
            borderLeftColor: color || 'var(--border)',
          }}
        >
          <Skeleton className="mb-4 h-[1.5rem] w-[8rem] rounded-md" />
          <Skeleton className="h-[2rem] w-full mb-3 rounded-md" />
          <Skeleton className="h-[2rem] w-[90%] mb-3 rounded-md" />
          <Skeleton className="h-[2rem] w-[60%] rounded-md" />
        </div>

        {/* Footer Metadata Skeleton */}
        <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 md:h-10 md:w-10 rounded-full" />
            <Skeleton className="h-[1.5rem] w-[15rem] rounded-md" />
          </div>
        </div>
      </div>
    </article>
  );
};
