import React from 'react';
import { useQaSlice } from '../slice';
import { useDispatch } from 'react-redux';
import { QaSortOrder, ToolItem } from '../slice/types';
import { Button } from '@/app/components/ui/button';
import {
  QA_IMPORTANCE_OPTIONS,
  QA_SORT_OPTIONS,
  QaFilterDropdown,
} from './qa-filter-dropdown';

export function ToolContent({
  tool,
  tools,
  open,
  setOpen,
  sortOrder,
  onSortChange,
  importanceFilter,
  onImportanceChange,
}: {
  tool: ToolItem;
  tools: ToolItem[];
  open: boolean;
  setOpen: (value: boolean) => void;
  sortOrder: QaSortOrder;
  onSortChange: (value: QaSortOrder) => void;
  importanceFilter: string;
  onImportanceChange: (value: string) => void;
}) {
  const dispatch = useDispatch();
  const { actions } = useQaSlice();

  return (
    <React.Fragment>
      <div className="w-full mb-4">
        <div>
          <h4
            style={{ color: tool?.color }}
            className="text-[3.6rem] font-bold underline mb-2"
          >
            {tool?.name}
          </h4>
          <p className="text-[1.6rem] font-medium mb-3">{tool?.description}</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button
            onClick={() => {
              dispatch(actions.resetEditableQa());
              setOpen(true);
            }}
            variant="special"
            className="px-6 py-4 rounded-[.8rem] text-[1.4rem]"
          >
            Add Qa
          </Button>
          <div className="flex flex-wrap items-center gap-4">
            <QaFilterDropdown
              label="Sort"
              headerTitle="Sort Questions"
              options={QA_SORT_OPTIONS}
              value={sortOrder}
              defaultValue="new-to-old"
              onChange={value => onSortChange(value as QaSortOrder)}
              icon="sort"
            />
            <QaFilterDropdown
              label="Importance"
              headerTitle="Filter by Importance"
              options={QA_IMPORTANCE_OPTIONS}
              value={importanceFilter}
              defaultValue="all"
              onChange={onImportanceChange}
              icon="filter"
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
