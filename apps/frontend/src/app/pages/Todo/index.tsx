import React, { useEffect, useMemo, useState } from 'react';
import { AddTodo } from './components/add-todo';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { TodoDialog } from './components/todo-dialog';
import { useSelector } from 'react-redux';
import { selectTheme, selectUser } from '@/app/slice/selectors';
import { Heading } from '@/app/components/Parts/heading';
import { useTodoSlice } from './slice';
import { Accordion } from '@/app/components/ui/accordion';
import { TodoAccordionItem } from './components/todo-accordion';
import { useDispatch } from 'react-redux';
import { toast } from '@/app/components/ui/use-toast';
import { TodoSkeleton } from './components/todo-skeleton';
import { EmptyView } from '@/app/components/Parts/EmptyView';
import { Pagination } from '@/app/components/Parts/pagination';
import { TodoFilterDropdown } from './components/todo-filter-dropdown';

export function Todo() {
  const {
    useLazyGetTodoItemsQuery,
    useCreateTodoMutation,
    useUpdateTodoMutation,
    useDeleteTodoMutation,
    actions,
  } = useTodoSlice();

  const [
    getTodoItems,
    {
      isFetching: todoLoading,
      data: todoData,
      isError: isTodoError,
      error: todoError,
    },
  ] = useLazyGetTodoItemsQuery();

  const [
    createTodo,
    {
      isLoading: isCreateLoading,
      isSuccess: isCreateSuccess,
      isError: isCreateError,
      error: createErrorMessage,
      data: createdData,
    },
  ] = useCreateTodoMutation();

  const [
    updateTodo,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateErrorMessage,
      data: updatedData,
    },
  ] = useUpdateTodoMutation();

  const [
    deleteTodo,
    {
      isLoading: deleteLoading,
      isSuccess: deleteSuccess,
      data: deleteData,
      isError: deleteError,
      error: deleteErrorMessage,
    },
  ] = useDeleteTodoMutation();

  const [deletingTodoId, setDeletingTodoId] = useState<string | null>(null);

  const handleDeleteTodo = (params: { todoId: string; userId: string }) => {
    setDeletingTodoId(params.todoId);
    return deleteTodo(params);
  };

  useEffect(() => {
    if (!deleteLoading) {
      setDeletingTodoId(null);
    }
  }, [deleteLoading]);

  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const themeState = useSelector(selectTheme);
  const [isTodoDialogOpen, setIsTodoDialogOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>('all');
  const [page, setPage] = useState<number>(1);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setPage(1);
  };

  const openTodoDialog = () => {
    dispatch(actions.resetEditableTodo());
    setIsTodoDialogOpen(true);
  };

  const closeTodoDialog = () => {
    setIsTodoDialogOpen(false);
  };

  useEffect(() => {
    if (!user?._id) {
      return;
    }
    if (todoError || isTodoError) {
      toast({
        description: String(todoError),
        variant: 'destructive',
      });
      return;
    }
    getTodoItems({
      requestParams: {
        userId: user?._id,
      },
      query: {
        page,
        pageSize: 10,
        filter,
      },
    });
  }, [isTodoError, todoError, page, filter, user?._id, getTodoItems]);

  const totalPages = todoData?.data?.totalPages || 1;

  // Render incomplete/pending tasks first with the nearest deadline at the top, and completed tasks last
  const sortedTodoDocuments = useMemo(() => {
    const docs = todoData?.data?.documents ?? [];
    return [...docs].sort((a, b) => {
      // 1. Pending / Incomplete first, Completed last
      const aCompleted = Boolean(a.isCompleted);
      const bCompleted = Boolean(b.isCompleted);
      if (aCompleted !== bCompleted) {
        return aCompleted ? 1 : -1;
      }

      // 2. Nearest deadline first
      const aTime = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      const bTime = b.deadline ? new Date(b.deadline).getTime() : Infinity;
      const validATime = isNaN(aTime) ? Infinity : aTime;
      const validBTime = isNaN(bTime) ? Infinity : bTime;

      if (validATime !== validBTime) {
        return validATime - validBTime;
      }

      return 0;
    });
  }, [todoData?.data?.documents]);

  // If items on current page become 0 (e.g. after deletion) and page > totalPages, step back
  useEffect(() => {
    if (page > 1 && totalPages < page && !todoLoading) {
      setPage(totalPages);
    }
  }, [totalPages, page, todoLoading]);

  useEffect(() => {
    if (isCreateSuccess && createdData) {
      closeTodoDialog();

      toast({
        description: createdData?.data?.message || 'Todo Created',
        variant: 'success',
      });
    }
    if (isUpdateSuccess && updatedData) {
      closeTodoDialog();

      toast({
        description: updatedData?.data?.message || 'Todo updated',
        variant: 'success',
      });
    }
  }, [isCreateSuccess, createdData, isUpdateSuccess, updatedData]);

  useEffect(() => {
    if (createErrorMessage || isCreateError) {
      toast({
        description: String(createErrorMessage),
        variant: 'destructive',
      });
    }
    if (updateErrorMessage || isUpdateError) {
      toast({
        description: String(updateErrorMessage),
        variant: 'destructive',
      });
    }
  }, [isCreateError, createErrorMessage, isUpdateError, updateErrorMessage]);

  useEffect(() => {
    if (deleteSuccess && deleteData) {
      toast({
        description: deleteData?.data?.message || 'Deleted Successfully !',
        variant: 'success',
      });
    }
  }, [deleteSuccess, deleteData]);

  useEffect(() => {
    if (deleteError || deleteErrorMessage) {
      toast({
        description: String(deleteErrorMessage) || 'Delete Todo Failed !',
        variant: 'destructive',
      });
    }
  }, [deleteError, deleteErrorMessage]);

  return (
    <React.Fragment>
      <div className="">
        {/* Heading & Add Todo Button with dialog  */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5">
          <Heading size="3rem" weight="700" text="Todo Collection" />
          <div className="flex flex-wrap items-center gap-4">
            {/* Filter Dropdown */}
            <TodoFilterDropdown value={filter} onChange={handleFilterChange} />

            <Dialog open={isTodoDialogOpen} onOpenChange={setIsTodoDialogOpen}>
              <DialogTrigger asChild>
                <AddTodo openDialog={openTodoDialog} />
              </DialogTrigger>
              <DialogContent
                onInteractOutside={e => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className={`w-[90%] md:w-1/2 max-w-none border border-green-600/70 ${themeState === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}
              >
                <DialogHeader>
                  <Heading text="Create Todo" size="2.6rem" weight="600" />
                </DialogHeader>
                <TodoDialog
                  createTodo={createTodo}
                  isCreateLoading={isCreateLoading}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Accordion type="multiple" className="w-full">
          {todoLoading ? (
            Array.from({ length: 5 }).map((_, index) => {
              return <TodoSkeleton key={index} />;
            })
          ) : sortedTodoDocuments?.length ? (
            sortedTodoDocuments?.map(eachTodo => {
              return (
                <TodoAccordionItem
                  eachItem={eachTodo}
                  key={eachTodo?._id}
                  updateTodo={updateTodo}
                  isUpdateLoading={isUpdateLoading}
                  deleteTodo={handleDeleteTodo}
                  deleteLoading={
                    deleteLoading && deletingTodoId === eachTodo?._id
                  }
                />
              );
            })
          ) : (
            <div className="mt-8">
              <EmptyView
                title={filter === 'all' ? 'No Todos Yet' : 'No Tasks Found'}
                description={
                  filter === 'all'
                    ? 'Your todo list is completely clear. Click the button above to add a task!'
                    : `No ${filter} tasks found. Try changing the filter or add a new task!`
                }
              />
            </div>
          )}
        </Accordion>

        {/* Pagination */}
        {sortedTodoDocuments?.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalDocuments={todoData?.data?.totalDocuments}
            pageSize={10}
            onPageChange={setPage}
            isLoading={todoLoading}
          />
        )}
      </div>
    </React.Fragment>
  );
}
