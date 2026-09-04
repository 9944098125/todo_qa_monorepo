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
import { ToolSkeleton } from './components/tool-skeleton';
import { QaSkeleton } from './components/qa-skeleton';
import { EmptyView } from '@/app/components/Parts/EmptyView';
import { Heading } from '@/app/components/Parts/heading';

export interface QaProps {}

export function Qa(props: QaProps) {
  const [searchParams] = useSearchParams();
  const { useLazyGetQaByToolQuery } = useQaSlice();
  const user = useSelector(selectUser);
  const [
    getQaByTool,
    { isFetching: isQaLoading, isSuccess, data, isError, error },
  ] = useLazyGetQaByToolQuery();
  const { tools, isToolsLoading } = useOutletContext<{
    tools: ToolItem[];
    isToolsLoading: boolean;
  }>();

  const [openToolDialog, setOpenToolDialog] = useState<boolean>(false);
  const [openQaDialog, setOpenQaDialog] = useState(false);

  const toolId = searchParams.get('toolId');

  const tool = tools?.find(t => t._id === toolId);

  useEffect(() => {
    if (toolId && user?._id) {
      getQaByTool({ toolId: toolId, userId: user?._id });
    }
  }, [toolId, user?._id, getQaByTool]);

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
      <Add
        toolId={toolId}
        tools={tools || []}
        toolDialog={openToolDialog}
        setToolDialog={setOpenToolDialog}
        qaDialog={openQaDialog}
        setQaDialog={setOpenQaDialog}
      />
      {toolId ? (
        <React.Fragment>
          {tool ? (
            <ToolContent
              tool={tool as any}
              tools={tools || []}
              open={openQaDialog}
              setOpen={setOpenQaDialog}
            />
          ) : null}
          {/* show the qa items according to toolId here */}
          {isQaLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <QaSkeleton key={i} color={tool?.color} />
            ))
          ) : qaItems?.length ? (
            qaItems?.map(i => {
              return (
                <QaItem
                  item={i}
                  tool={tool as any}
                  openQa={openQaDialog}
                  setOpenQa={setOpenQaDialog}
                  key={i?._id}
                />
              );
            })
          ) : (
            <div className="w-full h-[50vh] flex items-center justify-center">
              <EmptyView
                title="No QA Items"
                description="This tool doesn't have any questions and answers yet. Add some!"
              />
            </div>
          )}
        </React.Fragment>
      ) : (
        <div className="h-full w-full">
          <div className="px-6 pt-6">
            <Heading text="Tools" size="3rem" weight="700" />
          </div>
          {/* Grid container  */}
          <div className="p-6 grid grid-cols-12 gap-5">
            {isToolsLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <ToolSkeleton
                  key={i}
                  color={
                    [
                      '#3b82f6',
                      '#ef4444',
                      '#10b981',
                      '#f59e0b',
                      '#8b5cf6',
                      '#ec4899',
                    ][i % 6]
                  }
                />
              ))
            ) : tools?.length ? (
              tools?.map((item: ToolItem) => {
                return (
                  <ToolItemComponent
                    item={item}
                    key={item?._id}
                    open={openToolDialog}
                    setOpen={setOpenToolDialog}
                  />
                );
              })
            ) : (
              <EmptyView
                title="No Tools Found"
                description="Get started by creating your first tool category!"
              />
            )}
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
