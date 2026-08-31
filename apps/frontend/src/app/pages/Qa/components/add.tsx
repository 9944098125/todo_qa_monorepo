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
  qaDialog: boolean;
  setQaDialog: (value: boolean) => void;
  toolId: string | null;
};

export const Add = (props: Props) => {
  const { toolDialog, setToolDialog, tools, qaDialog, setQaDialog, toolId } =
    props;
  return (
    <React.Fragment>
      <div
        className={`${toolId ? 'hidden' : 'flex items-center justify-between'}`}
      >
        <AddTool open={toolDialog} setOpen={setToolDialog} />
        {tools.length && (
          <AddQa open={qaDialog} setOpen={setQaDialog} tools={tools} />
        )}
      </div>
    </React.Fragment>
  );
};
