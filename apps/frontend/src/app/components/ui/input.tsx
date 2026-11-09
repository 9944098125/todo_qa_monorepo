import * as React from 'react';

import { cn } from 'utils/twm';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-[5rem] focus:h-[5.5rem] w-full border border-input bg-background px-5 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:border-green-600 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
