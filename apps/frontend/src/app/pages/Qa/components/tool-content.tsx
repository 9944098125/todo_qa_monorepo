import React from 'react';
import { useQaSlice } from '../slice';
import { useDispatch } from 'react-redux';
import { ToolItem } from '../slice/types';
import { Button } from '@/app/components/ui/button';

export function ToolContent({
  tool,
  tools,
  open,
  setOpen,
}: {
  tool: ToolItem;
  tools: ToolItem[];
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  const dispatch = useDispatch();
  const { actions } = useQaSlice();

  return (
    <React.Fragment>
      <div className="w-full flex items-center justify-between mb-4">
        <div>
          <h4
            style={{ color: tool?.color }}
            className="text-[3.6rem] font-bold underline mb-2"
          >
            {tool?.name}
          </h4>
          <p className="text-[1.6rem] font-medium">{tool?.description}</p>
        </div>
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
      </div>
    </React.Fragment>
  );
}
