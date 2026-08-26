import React, { useEffect, useState } from 'react';
import { AddTodo } from './components/add-todo';
import {
  Dialog,
  DialogClose,
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

export interface TodoProps {}

export function Todo({}: TodoProps) {
  const { useLazyGetTodoItemsQuery, actions } = useTodoSlice();

  const [
    getTodoItems,
    {
      isLoading: todoLoading,
      data: todoData,
      isError: isTodoError,
      error: todoError,
    },
  ] = useLazyGetTodoItemsQuery();

  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const themeState = useSelector(selectTheme);
  const [isTodoDialogOpen, setIsTodoDialogOpen] = useState<boolean>(false);
  const [isEditableDialogOpen, setIsEditableDialogOpen] =
    useState<boolean>(false);

  const [page, setPage] = useState({
    pageNumber: 1,
    pageSize: 10,
  });

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
        page: page.pageNumber,
        pageSize: page.pageSize,
      },
    });
  }, [isTodoError, todoError]);

  const todoDocuments = todoData?.data?.documents ?? [];

  return (
    <React.Fragment>
      <div className="p-5">
        {/* Heading & Add Todo Button with dialog  */}
        <div className="flex items-center justify-between p-5">
          <Heading size="4rem" weight="700" text="Todo Collection" />
          <Dialog open={isTodoDialogOpen} onOpenChange={setIsTodoDialogOpen}>
            <DialogTrigger asChild>
              <AddTodo openDialog={openTodoDialog} />
            </DialogTrigger>
            <DialogContent
              onInteractOutside={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className={`w-[90%] md:w-1/2 max-w-none border-0 ${themeState === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}
            >
              <DialogHeader>
                <Heading text="Create Todo" size="2.6rem" weight="600" />
              </DialogHeader>
              <TodoDialog closeDialog={closeTodoDialog} />
            </DialogContent>
          </Dialog>
        </div>

        <Accordion type="multiple" className="w-full">
          {todoDocuments?.map(eachTodo => {
            return (
              <TodoAccordionItem
                eachItem={eachTodo}
                key={eachTodo?._id}
                open={isEditableDialogOpen}
                setOpen={setIsEditableDialogOpen}
              />
            );
          })}
        </Accordion>
      </div>
    </React.Fragment>
  );
}
