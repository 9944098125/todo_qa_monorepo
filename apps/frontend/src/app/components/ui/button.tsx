import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from 'utils/twm';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none  disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-gray-200',
        greenBtn: 'text-base h-[50px] rounded-[11px] bg-[#00c687] text-white ',
        inactiveBtn:
          'bg-red-100 text-red-600 text-[1.2rem] font-medium px-[1rem] py-2',
        blueBtn:
          'text-base h-[50px] rounded-[11px] bg-blue text-primary text-white font-normal; py-6 hover:text-#0606a6 border hover:border-[#0606a6] hover:bg-[#0606a6]',
        blackBtn: 'text-xs rounded-10 font-poppins bg-[#101828] text-white',
        destructive: 'bg-red-600/70 text-white hover:bg-red-600/90',
        outline:
          'border border-teal-600 shadow-sm shadow-teal-600 bg-background hover:bg-accent hover:text-accent-foreground text-base',
        ghost: '',
        link: 'text-primary underline-offset-4 hover:underline',
        primary:
          'bg-blue-600/70 text-white hover:bg-blue-800/90 text-xs leading-loose',
        special:
          'bg-gradient-to-tr from-green-800 via-green-500 to-green-700 hover:bg-gradient-to-tl text-white',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'size-10',
        blueBtn: 'h-[4.4rem]',
        whiteBtn: 'h-[4rem]',
        carouselArrow: 'h-20 w-15 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      // size: 'default',
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
