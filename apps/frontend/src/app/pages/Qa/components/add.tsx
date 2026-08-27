import { Button } from '@/app/components/ui/button';
import React from 'react';
import { useSelector } from 'react-redux';
import { AddTool } from './add-tool';

type Props = {
  toolDialog: boolean;
  setToolDialog: (value: boolean) => void;
};

export const Add = (props: Props) => {
  const { toolDialog, setToolDialog } = props;
  return (
    <React.Fragment>
      <div className="flex items-center justify-between">
        <AddTool open={toolDialog} setOpen={setToolDialog} />
        <Button variant="special" className="px-4 py-2 rounded-[.8rem]">
          Add Qa
        </Button>
      </div>
    </React.Fragment>
  );
};
