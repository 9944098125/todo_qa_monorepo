import React, { useEffect } from 'react';
import { useQaSlice } from '../slice';
import { useSelector } from 'react-redux';
import { selectUser } from '@/app/slice/selectors';
import { ToolItem } from '../slice/types';

export function ToolContent({ tool }: { tool: ToolItem }) {
  return (
    <React.Fragment>
      <div className="w-full">
        <h4 className="text-[3.6rem] font-bold text-green-800/70 underline">
          {tool?.name}
        </h4>
        <p className="text-[1.6rem] font-mediumm">{tool?.description}</p>
      </div>
    </React.Fragment>
  );
}
