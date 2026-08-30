import React, { useEffect, useState } from 'react';
import { Add } from './components/add';
import { useQaSlice } from './slice';
import { useSelector } from 'react-redux';
import { selectTheme, selectUser } from '@/app/slice/selectors';
import { ToolItem } from './slice/types';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { ToolItem as ToolItemComponent } from './components/tool-item';
import { ToolContent } from './components/tool-content';
import { toast } from '@/app/components/ui/use-toast';
import { QaItem } from './components/qa-item';
export interface QaProps {}

export function Qa({}: QaProps) {
  const [searchParams] = useSearchParams();
  const { useLazyGetQaByToolQuery, useLazyGetToolByIdQuery } = useQaSlice();
  const user = useSelector(selectUser);
  const [getQaByTool, { isLoading, isSuccess, data, isError, error }] =
    useLazyGetQaByToolQuery();
  const { tools } = useOutletContext<{ tools: ToolItem[] }>();
  const themeState = useSelector(selectTheme);

  const [openToolDialog, setOpenToolDialog] = useState<boolean>(false);

  const toolId = searchParams.get('toolId');

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

  useEffect(() => {
    if (toolId && user?._id) {
      getQaByTool({ toolId: toolId, userId: user?._id });
    }
  }, [toolId, user?._id]);

  useEffect(() => {
    if (isError || error) {
      toast({
        description: String(error),
        variant: 'destructive',
      });
    }
  }, [isError, error]);

  const qaItems = data?.data?.documents || [];

  return (
    <React.Fragment>
      {toolId ? (
        <React.Fragment>
          <ToolContent tool={tool as any} />
          {/* show the qa items according to toolId here */}
          {qaItems?.length ? (
            qaItems?.map(i => {
              return <QaItem item={i} tool={tool as any} key={i?._id} />;
            })
          ) : (
            <div className="flex w-full h-full items-center justify-center">
              Empty View
            </div>
          )}
        </React.Fragment>
      ) : (
        <div className="h-full w-full">
          <Add
            tools={tools}
            toolDialog={openToolDialog}
            setToolDialog={setOpenToolDialog}
          />
          {/* Grid container  */}
          <div className="p-6 grid grid-cols-12 gap-5">
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
      )}
    </React.Fragment>
  );
}
