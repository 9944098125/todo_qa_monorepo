'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { useSelector } from 'react-redux';
import { selectTheme } from '@/app/slice/selectors';

type Props = {
  date: Date;
  setDate: (date: Date | undefined) => void;
};
export function DatePicker(props: Props) {
  const themeState = useSelector(selectTheme);
  const isDark = themeState === 'dark';
  const { date, setDate } = props;
  return (
    <Popover>
      <PopoverTrigger
        className={`flex h-[5rem] focus:h-[5.5rem] items-center gap-5 px-5 py-2 border focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all duration-200 rounded-[.8rem] ${
          isDark
            ? 'bg-black text-white border-gray-700'
            : 'bg-white text-black border-gray-300'
        }`}
      >
        <CalendarIcon />
        {date ? format(date, 'PPP') : <span>Pick a date</span>}
      </PopoverTrigger>
      <PopoverContent
        className={`w-auto p-0 border ${
          isDark
            ? 'dark bg-black text-white border-gray-800'
            : 'bg-white text-black border-gray-200'
        }`}
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={d => d < new Date(new Date().setHours(0, 0, 0, 0))}
        />
      </PopoverContent>
    </Popover>
  );
}
