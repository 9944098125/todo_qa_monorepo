import React, { useEffect } from 'react';
import { useQaSlice } from '../slice';
import { useSelector } from 'react-redux';
import { selectUser } from '@/app/slice/selectors';

export function ToolContent({ toolId }: { toolId: string }) {
  const { useLazyGetToolByIdQuery } = useQaSlice();
  const user = useSelector(selectUser);
  const [
    getToolById,
    {
      isLoading: getToolByIdLoading,
      isSuccess: getToolByIdSuccess,
      data: getToolByIdData,
      isError: isGetToolByIdError,
      error: getToolByIdErrorMessage,
    },
  ] = useLazyGetToolByIdQuery();

  useEffect(() => {
    if (toolId && user?._id) {
      getToolById({ toolId: toolId, userId: user?._id });
    }
  }, [user?._id, toolId]);

  const tool = getToolByIdData?.data?.data?.tool;

  return (
    <React.Fragment>
      <div className="h-full w-full">
        <h4 className="text-[3.6rem] font-bold text-green-800/70 underline">
          {tool?.name}
        </h4>
        <p className="text-[1.6rem] font-mediumm">{tool?.description}</p>
      </div>
    </React.Fragment>
  );
}
