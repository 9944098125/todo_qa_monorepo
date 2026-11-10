'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { useSelector } from 'react-redux';
import { selectTheme } from '@/app/slice/selectors';

type Props = {
  date?: Date;
  setDate: (date: Date | undefined) => void;
};

export function DatePicker(props: Props) {
  const themeState = useSelector(selectTheme);
  const isDark = themeState === 'dark';
  const { date, setDate } = props;

  const [open, setOpen] = React.useState(false);
  const [tempDate, setTempDate] = React.useState<Date | undefined>(date);

  React.useEffect(() => {
    setTempDate(date);
  }, [date]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setTempDate(date);
    }
    setOpen(newOpen);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (tempDate) {
      setDate(tempDate);
    }
    setOpen(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTempDate(date);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
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
          selected={tempDate}
          onSelect={setTempDate}
          disabled={d => d < new Date(new Date().setHours(0, 0, 0, 0))}
        />
        {tempDate && (
          <div className="grid grid-cols-2 gap-3 px-5 py-3 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full h-11 flex items-center justify-center text-sm font-medium rounded-lg text-gray-800 bg-gray-200 hover:bg-gray-300 transition-colors duration-150 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="w-full h-11 flex items-center justify-center text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-800 transition-colors duration-150 cursor-pointer"
            >
              Save
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
