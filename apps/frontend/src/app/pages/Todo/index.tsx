import React from 'react';
import { AddTodo } from './components/add-todo';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { TodoDialog } from './components/todo-dialog';

export interface TodoProps {}

export function Todo({}: TodoProps) {
  return (
    <React.Fragment>
      <div className="flex items-center justify-between p-5">
        <h4 className="text-lg font-[600] md:text-2xl bg-gradient-to-r from-red-900 via-purple-600 to-teal-800 bg-clip-text text-transparent">
          Todo Items
        </h4>
        <Dialog>
          <DialogTrigger>
            <AddTodo />
          </DialogTrigger>
          <DialogContent className="bg-white text-black">
            <TodoDialog />
          </DialogContent>
        </Dialog>
      </div>
    </React.Fragment>
  );
}
