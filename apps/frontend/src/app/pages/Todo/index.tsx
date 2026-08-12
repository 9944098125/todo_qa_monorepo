import React, { useState } from 'react';
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
import { selectTheme } from '@/app/slice/selectors';
import { Heading } from '@/app/components/Parts/heading';

export interface TodoProps {}

export function Todo({}: TodoProps) {
  const themeState = useSelector(selectTheme);
  const [isTodoDialogOpen, setIsTodoDialogOpen] = useState<boolean>(false);

  const openTodoDialog = () => {
    setIsTodoDialogOpen(true);
  };

  const closeTodoDialog = () => {
    setIsTodoDialogOpen(false);
  };

  return (
    <React.Fragment>
      <div className="flex items-center justify-between p-5">
        <Heading size="4rem" weight="700" text="Todo Collection" />
        <Dialog open={isTodoDialogOpen} onOpenChange={setIsTodoDialogOpen}>
          <DialogTrigger>
            <AddTodo />
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
    </React.Fragment>
  );
}
