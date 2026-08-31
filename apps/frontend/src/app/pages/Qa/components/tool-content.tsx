import React, { useEffect } from 'react';
import { useQaSlice } from '../slice';
import { useSelector } from 'react-redux';
import { selectUser } from '@/app/slice/selectors';
import { ToolItem } from '../slice/types';

export function ToolContent({ tool }: { tool: ToolItem }) {
  return (
    <React.Fragment>
      <div className="w-full">
        <h4
          style={{ color: tool?.color }}
          className="text-[3.6rem] font-bold underline"
        >
          {tool?.name}
        </h4>
        <p className="text-[1.6rem] font-mediumm">{tool?.description}</p>
      </div>
    </React.Fragment>
  );
}
