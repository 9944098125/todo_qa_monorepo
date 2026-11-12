import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  ListFilter,
  RotateCcw,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectTheme } from '@/app/slice/selectors';

export interface QaFilterOption {
  value: string;
  label: string;
  badgeColor: string;
}

export const QA_SORT_OPTIONS: QaFilterOption[] = [
  { value: 'new-to-old', label: 'Show New to Old', badgeColor: 'bg-green-500' },
  { value: 'old-to-new', label: 'Show Old to New', badgeColor: 'bg-blue-500' },
];

export const QA_IMPORTANCE_OPTIONS: QaFilterOption[] = [
  { value: 'all', label: 'All Importance', badgeColor: 'bg-green-500' },
  {
    value: 'Very Important',
    label: 'Very Important',
    badgeColor: 'bg-red-500',
  },
  { value: 'Important', label: 'Important', badgeColor: 'bg-yellow-500' },
  { value: 'Not Important', label: 'Not Important', badgeColor: 'bg-gray-400' },
];

interface QaFilterDropdownProps {
  label: string;
  headerTitle: string;
  options: QaFilterOption[];
  value: string;
  defaultValue: string;
  onChange: (value: string) => void;
  icon?: 'sort' | 'filter';
}

export const QaFilterDropdown: React.FC<QaFilterDropdownProps> = ({
  label,
  headerTitle,
  options,
  value,
  defaultValue,
  onChange,
  icon = 'filter',
}) => {
  const [open, setOpen] = useState(false);
  const themeState = useSelector(selectTheme);
  const isDark = themeState === 'dark';

  const currentOption = options.find(opt => opt.value === value) || options[0];

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setOpen(false);
  };

  const IconComponent = icon === 'sort' ? ArrowUpDown : ListFilter;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-expanded={open}
          aria-label={headerTitle}
          className={`group flex h-[4.5rem] items-center gap-3 px-4 rounded-[.8rem] text-sm font-medium border transition-all duration-200 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 ${
            isDark
              ? 'bg-black text-white border-green-600/70 hover:border-green-500 hover:bg-neutral-900/60 shadow-sm'
              : 'bg-white text-gray-900 border-green-600/70 hover:border-green-600 hover:bg-gray-50 shadow-sm'
          }`}
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-600/10 text-green-600">
            <IconComponent className="w-4 h-4" />
          </span>

          <div className="flex flex-col items-start text-left leading-tight">
            <span className="text-[1.05rem] uppercase font-bold tracking-wider text-gray-400">
              {label}
            </span>
            <span className="text-[1.3rem] font-bold text-green-600 flex items-center gap-2">
              <span
                className={`inline-block w-2 h-2 rounded-full ${currentOption.badgeColor}`}
              />
              {currentOption.label}
            </span>
          </div>

          <ChevronDown
            className={`w-4 h-4 ml-2 text-gray-400 transition-transform duration-200 ${
              open ? 'rotate-180 text-green-600' : ''
            }`}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={6}
        className={`w-72 p-2 rounded-[.8rem] border shadow-2xl backdrop-blur-sm z-50 ${
          isDark
            ? 'bg-black/95 text-white border-green-600/70 shadow-green-950/20'
            : 'bg-white/95 text-gray-900 border-gray-200 shadow-gray-300/40'
        }`}
      >
        <div
          className={`flex items-center justify-between px-3 py-2 border-b ${
            isDark ? 'border-gray-800' : 'border-gray-100'
          }`}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            {headerTitle}
          </span>
          {value !== defaultValue && (
            <button
              type="button"
              onClick={() => handleSelect(defaultValue)}
              className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>

        <div className="flex flex-col gap-1 mt-1 max-h-80 overflow-y-auto">
          {options.map(option => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-green-600 text-white font-bold shadow-sm'
                    : isDark
                      ? 'text-gray-300 hover:bg-neutral-900 hover:text-white border border-transparent'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isSelected ? 'bg-white' : option.badgeColor
                    }`}
                  />
                  <span className={isSelected ? 'text-white font-bold' : ''}>
                    {option.label}
                  </span>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-white stroke-[2.5]" />
                )}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
