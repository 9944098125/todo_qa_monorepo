import React, { useEffect, useState } from 'react';
import { Add } from './components/add';
import { useQaSlice } from './slice';
import { useSelector } from 'react-redux';
import { selectTheme, selectUser } from '@/app/slice/selectors';
import { ToolItem } from './slice/types';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { ToolItem as ToolItemComponent } from './components/tool-item';
export interface QaProps {}

export function Qa({}: QaProps) {
  const [searchParams] = useSearchParams();
  const { tools } = useOutletContext<{ tools: ToolItem[] }>();
  const themeState = useSelector(selectTheme);

  const [openToolDialog, setOpenToolDialog] = useState<boolean>(false);

  const toolId = searchParams.get('toolId');

  return (
    <React.Fragment>
      <div className="h-full w-full p-5">
        <Add toolDialog={openToolDialog} setToolDialog={setOpenToolDialog} />
        {/* Grid container  */}
        <div className="p-6 grid grid-cols-12 gap-5 auto-rows-[minmax(5rem, auto)]">
          {tools?.map((item: ToolItem) => {
            return (
              <ToolItemComponent
                item={item}
                key={item?._id}
                open={openToolDialog}
                setOpen={setOpenToolDialog}
              />
            );
          })}
        </div>
      </div>
    </React.Fragment>
  );
}
