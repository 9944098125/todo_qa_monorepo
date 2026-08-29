import { Button } from '@/app/components/ui/button';
import React from 'react';
import { useSelector } from 'react-redux';
import { AddTool } from './add-tool';
import { ToolItem } from '../slice/types';

type Props = {
  toolDialog: boolean;
  setToolDialog: (value: boolean) => void;
  tools: ToolItem[];
};

export const Add = (props: Props) => {
  const { toolDialog, setToolDialog, tools } = props;
  return (
    <React.Fragment>
      <div className="flex items-center justify-between">
        <AddTool open={toolDialog} setOpen={setToolDialog} />
        {tools.length && (
          <Button variant="special" className="px-4 py-2 rounded-[.8rem]">
            Add Qa
          </Button>
        )}
      </div>
    </React.Fragment>
  );
};
