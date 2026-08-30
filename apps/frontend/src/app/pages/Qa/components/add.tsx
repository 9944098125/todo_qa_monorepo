import { Button } from '@/app/components/ui/button';
import React from 'react';
import { useSelector } from 'react-redux';
import { AddTool } from './add-tool';
import { ToolItem } from '../slice/types';
import { AddQa } from './add-qa';

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
        {tools.length && <AddQa tools={tools} />}
      </div>
    </React.Fragment>
  );
};
