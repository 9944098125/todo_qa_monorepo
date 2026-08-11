import React, { useState } from 'react';
import { AddTodo } from './components/add-todo';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { TodoDialog } from './components/todo-dialog';
import { useSelector } from 'react-redux';
import { selectTheme } from '@/app/slice/selectors';

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
        <h4 className="text-lg font-[600] md:text-2xl bg-gradient-to-r from-red-900 via-purple-600 to-teal-800 bg-clip-text text-transparent">
          Todo Items
        </h4>
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
            <TodoDialog />
          </DialogContent>
        </Dialog>
      </div>
    </React.Fragment>
  );
}
