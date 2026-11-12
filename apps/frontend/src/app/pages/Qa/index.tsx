import React, { useEffect, useState } from 'react';
import { Add } from './components/add';
import { useQaSlice } from './slice';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '@/app/slice/selectors';
import { selectQaImportanceFilter, selectQaSortOrder } from './slice/selectors';
import { QaSortOrder, ToolItem } from './slice/types';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { ToolItem as ToolItemComponent } from './components/tool-item';
import { ToolContent } from './components/tool-content';
import { toast } from '@/app/components/ui/use-toast';
import { QaItem } from './components/qa-item';
import { ToolSkeleton } from './components/tool-skeleton';
import { QaSkeleton } from './components/qa-skeleton';
import { EmptyView } from '@/app/components/Parts/EmptyView';
import { Heading } from '@/app/components/Parts/heading';
import { Pagination } from '@/app/components/Parts/pagination';

export interface QaProps {}

export function Qa(props: QaProps) {
  const [searchParams] = useSearchParams();
  const {
    actions,
    useGetQaNewToOldQuery,
    useGetQaOldToNewQuery,
    useGetQaByImportanceQuery,
  } = useQaSlice();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const sortOrder = useSelector(selectQaSortOrder);
  const importanceFilter = useSelector(selectQaImportanceFilter);
  const { tools, isToolsLoading } = useOutletContext<{
    tools: ToolItem[];
    isToolsLoading: boolean;
  }>();

  const [openToolDialog, setOpenToolDialog] = useState<boolean>(false);
  const [openQaDialog, setOpenQaDialog] = useState(false);
  const [page, setPage] = useState<number>(1);

  const toolId = searchParams.get('toolId');

  const tool = tools?.find(t => t._id === toolId);

  const canFetch = Boolean(toolId && user?._id);
  const isImportanceFiltered = importanceFilter !== 'all';

  const newToOldResult = useGetQaNewToOldQuery(
    {
      toolId: toolId || '',
      userId: user?._id || '',
      query: { page, limit: 10 },
    },
    { skip: !canFetch || isImportanceFiltered || sortOrder !== 'new-to-old' },
  );

  const oldToNewResult = useGetQaOldToNewQuery(
    {
      toolId: toolId || '',
      userId: user?._id || '',
      query: { page, limit: 10 },
    },
    { skip: !canFetch || isImportanceFiltered || sortOrder !== 'old-to-new' },
  );

  const importanceResult = useGetQaByImportanceQuery(
    {
      toolId: toolId || '',
      userId: user?._id || '',
      query: {
        page,
        limit: 10,
        importance: importanceFilter,
        sort: sortOrder,
      },
    },
    { skip: !canFetch || !isImportanceFiltered },
  );

  const activeResult = isImportanceFiltered
    ? importanceResult
    : sortOrder === 'old-to-new'
      ? oldToNewResult
      : newToOldResult;
  const { isFetching: isQaLoading, data, isError, error } = activeResult;

  const handleSortChange = (nextSort: QaSortOrder) => {
    dispatch(actions.setSortOrder(nextSort));
    setPage(1);
  };

  const handleImportanceChange = (nextImportance: string) => {
    dispatch(actions.setImportanceFilter(nextImportance));
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
  }, [toolId, sortOrder, importanceFilter]);

  useEffect(() => {
    if (isError || error) {
      toast({
        description: String(error),
        variant: 'destructive',
      });
    }
  }, [isError, error]);

  const qaItems = data?.data?.documents || [];
  const totalPages = data?.data?.totalPages || 1;

  useEffect(() => {
    if (page > 1 && totalPages < page && !isQaLoading) {
      setPage(totalPages);
    }
  }, [totalPages, page, isQaLoading]);

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
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              importanceFilter={importanceFilter}
              onImportanceChange={handleImportanceChange}
            />
          ) : null}
          {/* show the qa items according to toolId here */}
          {isQaLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <QaSkeleton key={i} color={tool?.color} />
            ))
          ) : qaItems?.length ? (
            <React.Fragment>
              {qaItems?.map(i => {
                return (
                  <QaItem
                    item={i}
                    tool={tool as any}
                    openQa={openQaDialog}
                    setOpenQa={setOpenQaDialog}
                    key={i?._id}
                  />
                );
              })}
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalDocuments={data?.data?.totalDocuments}
                pageSize={data?.data?.pageSize || 10}
                onPageChange={setPage}
                isLoading={isQaLoading}
              />
            </React.Fragment>
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
