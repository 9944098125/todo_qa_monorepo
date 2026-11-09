import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Check } from 'lucide-react';

import { cn } from 'utils/twm';

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('grid gap-2', className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'aspect-square h-[2.4rem] w-[2.4rem] rounded-[0.6rem] border-2 border-gray-400 dark:border-gray-500 bg-white dark:bg-gray-900/40 text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 transition-all duration-150 flex items-center justify-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center text-white">
        {children || (
          <Check className="h-[1.6rem] w-[1.6rem] stroke-[3] text-white" />
        )}
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
