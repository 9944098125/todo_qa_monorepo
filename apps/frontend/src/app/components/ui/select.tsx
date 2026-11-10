import * as React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from 'utils/twm';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';
import { useSelector } from 'react-redux';
import { selectTheme } from '@/app/slice/selectors';

interface SelectContextType {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextType>({
  open: false,
  setOpen: () => {},
});

interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  value: controlledValue,
  defaultValue,
  onValueChange,
  open: controlledOpen,
  onOpenChange,
  children,
}) => {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue || '',
  );
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);

  const isControlledValue = controlledValue !== undefined;
  const isControlledOpen = controlledOpen !== undefined;

  const value = isControlledValue ? controlledValue : uncontrolledValue;
  const open = isControlledOpen ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (isControlledOpen) {
        onOpenChange?.(newOpen);
      } else {
        setUncontrolledOpen(newOpen);
      }
    },
    [isControlledOpen, onOpenChange],
  );

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (!isControlledValue) {
        setUncontrolledValue(newValue);
      }
      onValueChange?.(newValue);
      setOpen(false);
    },
    [isControlledValue, onValueChange, setOpen],
  );

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange: handleValueChange,
        open,
        setOpen,
      }}
    >
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { open } = React.useContext(SelectContext);
  const themeState = useSelector(selectTheme);
  const isDark = themeState === 'dark';

  return (
    <PopoverTrigger asChild>
      <button
        ref={ref}
        type="button"
        aria-expanded={open}
        className={cn(
          'flex h-[5rem] focus:h-[5.5rem] w-full items-center justify-between rounded-[.8rem] border border-green-600/70 px-4 text-[1.4rem] font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer',
          isDark ? 'bg-black text-white' : 'bg-white text-black',
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown
          className={cn(
            'h-5 w-5 transition-transform duration-200',
            isDark ? 'text-gray-400' : 'text-gray-500',
            open && 'rotate-180 text-green-600',
          )}
        />
      </button>
    </PopoverTrigger>
  );
});
SelectTrigger.displayName = 'SelectTrigger';

export const SelectValue: React.FC<{
  placeholder?: string;
  className?: string;
}> = ({ placeholder, className }) => {
  const { value } = React.useContext(SelectContext);
  return (
    <span className={cn('truncate', !value && 'text-gray-400', className)}>
      {value || placeholder}
    </span>
  );
};

export const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const themeState = useSelector(selectTheme);
  const isDark = themeState === 'dark';

  return (
    <PopoverContent
      ref={ref}
      align="start"
      sideOffset={4}
      className={cn(
        'w-[var(--radix-popover-trigger-width)] min-w-[12rem] p-1.5 rounded-[.8rem] border shadow-2xl backdrop-blur-sm z-50',
        isDark
          ? 'bg-black text-white border-green-600/70 shadow-green-950/20'
          : 'bg-white text-gray-900 border-gray-200 shadow-gray-300/40',
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
        {children}
      </div>
    </PopoverContent>
  );
});
SelectContent.displayName = 'SelectContent';

export interface SelectItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const SelectItem = React.forwardRef<HTMLButtonElement, SelectItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const { value: selectedValue, onValueChange } =
      React.useContext(SelectContext);
    const themeState = useSelector(selectTheme);
    const isDark = themeState === 'dark';
    const isSelected = selectedValue === value;

    return (
      <button
        ref={ref}
        type="button"
        role="option"
        aria-selected={isSelected}
        onClick={() => onValueChange?.(value)}
        className={cn(
          'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[1.4rem] font-medium transition-all duration-150 cursor-pointer select-none text-left',
          isSelected
            ? 'bg-green-600 text-white font-bold shadow-sm'
            : isDark
              ? 'text-white hover:bg-neutral-900 hover:text-white'
              : 'text-gray-800 hover:bg-gray-100 hover:text-black',
          className,
        )}
        {...props}
      >
        <span>{children}</span>
        {isSelected && <Check className="w-4 h-4 text-white stroke-[2.5]" />}
      </button>
    );
  },
);
SelectItem.displayName = 'SelectItem';
