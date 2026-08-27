import React, { useEffect, useState } from 'react';
import { Add } from './components/add';
import { useQaSlice } from './slice';
import { useSelector } from 'react-redux';
import { selectTheme, selectUser } from '@/app/slice/selectors';
import { ToolItem } from './slice/types';
import { useOutletContext, useSearchParams } from 'react-router-dom';
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
        {/* flex wrap container  */}
        <div className="flex flex-wrap gap-4 p-6">
          {tools?.map((item: ToolItem) => {
            return (
              <React.Fragment>
                <div
                  className={`${themeState === 'dark' ? 'bg-gray-700 text-white' : 'bg-green-50'} w-[30rem] min-h-[10rem] p-4 rounded-[.8rem] border border-green-600`}
                >
                  <div className="flex items-center gap-4 p-4">
                    <img
                      src={item?.image}
                      alt=""
                      className="h-[5rem] w-[5rem]"
                    />
                    <h4 className="text-[2rem] font-[600]">{item?.name}</h4>
                  </div>
                  <p className="text-[1.6rem] font-[300]">
                    {item?.description}
                  </p>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </React.Fragment>
  );
}
