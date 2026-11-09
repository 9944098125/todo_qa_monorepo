import * as React from 'react';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';
import { DayButton, DayPicker, getDefaultClassNames } from 'react-day-picker';
import { useSelector } from 'react-redux';
import { selectTheme } from '@/app/slice/selectors';

import { cn } from 'utils/twm';
import { Button, buttonVariants } from 'app/components/ui/button';

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
}) {
  const defaultClassNames = getDefaultClassNames();
  const themeState = useSelector(selectTheme);
  const isDark = themeState === 'dark';

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        'bg-transparent group/calendar p-5 [--cell-size:3rem]',
        '[[data-slot=card-content]_&]:bg-transparent',
        '[[data-slot=popover-content]_&]:bg-transparent',
        String.raw`rtl:**:[.rdp-button_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button_previous>svg]:rotate-180`,
        isDark ? 'text-white' : 'text-slate-900',
        className,
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: date =>
          date.toLocaleString('default', {
            month: 'short',
          }),
        ...formatters,
      }}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),

        months: cn(
          'relative flex flex-col gap-8 md:flex-row',
          defaultClassNames.months,
        ),

        month: cn('flex w-full flex-col gap-6', defaultClassNames.month),

        nav: cn(
          'absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1',
          defaultClassNames.nav,
        ),

        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          'h-10 w-10 rounded-full p-0',
          'border transition-all duration-150',
          isDark
            ? 'border-gray-700 bg-gray-900 text-white hover:border-gray-600 hover:bg-gray-800 hover:text-white'
            : 'border-slate-200 bg-white text-slate-800 hover:border-green-300 hover:bg-green-50 hover:text-green-700',
          'active:scale-95',
          'focus-visible:ring-2 focus-visible:ring-green-500',
          'aria-disabled:pointer-events-none',
          'aria-disabled:opacity-40',
          defaultClassNames.button_previous,
        ),

        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          'h-10 w-10 rounded-full p-0',
          'border transition-all duration-150',
          isDark
            ? 'border-gray-700 bg-gray-900 text-white hover:border-gray-600 hover:bg-gray-800 hover:text-white'
            : 'border-slate-200 bg-white text-slate-800 hover:border-green-300 hover:bg-green-50 hover:text-green-700',
          'active:scale-95',
          'focus-visible:ring-2 focus-visible:ring-green-500',
          'aria-disabled:pointer-events-none',
          'aria-disabled:opacity-40',
          defaultClassNames.button_next,
        ),

        month_caption: cn(
          'flex h-[--cell-size] w-full items-center justify-center',
          'px-[--cell-size]',
          'text-base font-semibold',
          isDark ? 'text-white' : 'text-slate-800',
          defaultClassNames.month_caption,
        ),

        dropdowns: cn(
          'flex h-[--cell-size] w-full items-center justify-center',
          'gap-1.5 text-sm font-medium',
          defaultClassNames.dropdowns,
        ),

        dropdown_root: cn(
          'has-focus:border-ring border-input shadow-xs',
          'has-focus:ring-ring/50 has-focus:ring-[3px]',
          'relative rounded-md border',
          defaultClassNames.dropdown_root,
        ),

        dropdown: cn(
          'bg-popover absolute inset-0 opacity-0',
          defaultClassNames.dropdown,
        ),

        caption_label: cn(
          'select-none font-semibold text-base',
          isDark ? 'text-white' : 'text-slate-800',
          defaultClassNames.caption_label,
        ),

        month_grid: cn('w-full border-collapse', defaultClassNames.month_grid),

        weekdays: cn('flex w-full gap-2', defaultClassNames.weekdays),

        weekday: cn(
          'flex-1 select-none rounded-md text-center text-sm font-semibold',
          isDark ? 'text-gray-400' : 'text-gray-500',
          defaultClassNames.weekday,
        ),

        week: cn('mt-2 flex w-full gap-2', defaultClassNames.week),

        week_number_header: cn(
          'w-[--cell-size] select-none',
          defaultClassNames.week_number_header,
        ),

        week_number: cn(
          'select-none text-[0.8rem]',
          isDark ? 'text-gray-400' : 'text-gray-500',
          defaultClassNames.week_number,
        ),

        day: cn(
          'group/day relative aspect-square h-full w-full',
          'select-none p-0 text-center',
          defaultClassNames.day,
        ),

        range_start: cn(
          'rounded-l-lg bg-green-600 text-white',
          defaultClassNames.range_start,
        ),

        range_middle: cn(
          'rounded-none',
          isDark
            ? 'bg-green-950/50 text-green-300'
            : 'bg-green-100 text-green-800',
          defaultClassNames.range_middle,
        ),

        range_end: cn(
          'rounded-r-lg bg-green-600 text-white',
          defaultClassNames.range_end,
        ),

        today: cn(
          'rounded-lg font-semibold',
          isDark
            ? 'bg-green-950/60 text-green-400'
            : 'bg-green-50 text-green-700',
          'data-[selected=true]:bg-green-600',
          'data-[selected=true]:text-white',
          defaultClassNames.today,
        ),

        outside: cn(
          'opacity-30',
          isDark ? 'text-gray-600' : 'text-gray-400',
          defaultClassNames.outside,
        ),

        disabled: cn(
          'cursor-not-allowed opacity-30',
          isDark ? 'text-gray-600' : 'text-gray-400',
          defaultClassNames.disabled,
        ),

        hidden: cn('invisible', defaultClassNames.hidden),

        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          );
        },

        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === 'left') {
            return (
              <ChevronLeftIcon className={cn('size-5', className)} {...props} />
            );
          }

          if (orientation === 'right') {
            return (
              <ChevronRightIcon
                className={cn('size-5', className)}
                {...props}
              />
            );
          }

          return (
            <ChevronDownIcon className={cn('size-5', className)} {...props} />
          );
        },

        DayButton: CalendarDayButton,

        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-[--cell-size] items-center justify-center text-center">
                {children}
              </div>
            </td>
          );
        },

        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();
  const themeState = useSelector(selectTheme);
  const isDark = themeState === 'dark';

  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (modifiers.focused) {
      ref.current?.focus();
    }
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        'flex aspect-square h-auto w-full min-w-[--cell-size]',
        'items-center justify-center',
        'rounded-lg',
        'font-medium leading-none text-base',
        'transition-all duration-150',

        // Explicit date number text color
        modifiers.disabled
          ? isDark
            ? 'text-gray-600 opacity-30 cursor-not-allowed'
            : 'text-gray-400 opacity-30 cursor-not-allowed'
          : isDark
            ? 'text-white'
            : 'text-gray-900',

        // Selected date
        'data-[selected-single=true]:bg-green-600',
        'data-[selected-single=true]:text-white',
        'data-[selected-single=true]:shadow-md',

        // Hover
        !modifiers.disabled &&
          (isDark
            ? 'hover:bg-gray-800 hover:text-white'
            : 'hover:bg-green-50 hover:text-green-700'),
        'hover:shadow-sm',

        // Selected + hover
        'data-[selected-single=true]:hover:bg-green-700',
        'data-[selected-single=true]:hover:text-white',

        // Keyboard focus
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-green-500',
        'focus-visible:ring-offset-2',

        // Range selection
        'data-[range-middle=true]:bg-green-100 dark:data-[range-middle=true]:bg-green-950/50',
        'data-[range-middle=true]:text-green-700 dark:data-[range-middle=true]:text-green-300',
        'data-[range-start=true]:bg-green-600',
        'data-[range-start=true]:text-white',
        'data-[range-end=true]:bg-green-600',
        'data-[range-end=true]:text-white',

        // Focused day
        'group-data-[focused=true]/day:relative',
        'group-data-[focused=true]/day:z-10',
        'group-data-[focused=true]/day:ring-2',
        'group-data-[focused=true]/day:ring-green-500/50',

        // Range shape
        'data-[range-middle=true]:rounded-none',
        'data-[range-start=true]:rounded-l-lg',
        'data-[range-end=true]:rounded-r-lg',

        // Small text inside the day button
        '[&>span]:text-xs',
        '[&>span]:opacity-70',

        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
