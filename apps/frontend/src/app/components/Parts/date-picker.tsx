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
  const { date, setDate } = props;
  return (
    <Popover>
      <PopoverTrigger className="flex items-center gap-5 px-5 py-3 border border-teal-800 rounded-[.8rem]">
        <CalendarIcon />
        {date ? format(date, 'PPP') : <span>Pick a date</span>}
      </PopoverTrigger>
      <PopoverContent
        className={`w-auto p-0 ${themeState === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}
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
