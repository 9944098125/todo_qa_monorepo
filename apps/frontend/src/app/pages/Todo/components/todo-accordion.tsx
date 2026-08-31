import React, { useEffect, useState } from 'react';
import { TodoItem } from '../slice/types';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion';
import { Edit2Icon, Trash2Icon } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import { useSelector } from 'react-redux';
import { selectTheme } from '@/app/slice/selectors';
import { useTodoSlice } from '../slice';
import { toast } from '@/app/components/ui/use-toast';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { Heading } from '@/app/components/Parts/heading';
import { TodoDialog } from './todo-dialog';
import { ConfirmationDialog } from '@/app/components/Parts/confirmation-dialog';
import { Icons } from '@/app/components/ui/icons';

type Props = {
  eachItem: TodoItem;
  open: boolean;
  setOpen: (value: boolean) => void;
};
export function TodoAccordionItem(props: Props) {
  const themeState = useSelector(selectTheme);
  const dispatch = useDispatch();
  const { _id, title, description, urgency, deadline, userId } = props.eachItem;

  const { useDeleteTodoMutation, actions } = useTodoSlice();

  const [deleteTodo, { isLoading, isSuccess, data, isError, error }] =
    useDeleteTodoMutation();

  const [openDeleteConfirmation, setOpenDeleteConfirmation] =
    useState<boolean>(false);

  useEffect(() => {
    if (isSuccess) {
      toast({
        description: data?.data?.message || 'Deleted Successfully !',
        variant: 'success',
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError || error) {
      toast({
        description: String(error) || 'Delete Todo Failed !',
        variant: 'destructive',
      });
    }
  }, [isError, error]);

  return (
    <React.Fragment>
      <AccordionItem
        value={_id}
        className={`${themeState === 'dark' ? 'bg-black' : 'bg-green-100'} mb-4 md:mb-8 border border-green-700 rounded-[.8rem]`}
      >
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center justify-between px-4 py-2 w-full">
            <div>
              <h4 className="text-xl font-[600]">{title}</h4>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-4 pb-[12rem] min-h-[15rem] relative rounded-b-[.8rem]">
          <p className="text-lg leading-normal font-medium">{description}</p>
          <div
            className={`border-t border-green-700 shadow-lg absolute bottom-0 right-0 left-0 rounded-b-[.8rem] py-2 px-4 bg-black flex items-center justify-between w-full ${themeState === 'dark' ? 'bg-green-700/70' : 'bg-green-200'}`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`${urgency ? 'bg-red-600' : 'bg-green-600'} rounded-full h-10 w-10`}
              ></div>
              <p
                className={`${urgency ? 'text-red-600' : 'text-green-600'} text-[1.2rem] font-[800]`}
              >
                {urgency ? "It's urgent !!!" : 'I can take time !'}
              </p>
            </div>
            <div className="">
              <div className="flex items-center justify-between mb-4">
                <Dialog open={props.open} onOpenChange={props.setOpen}>
                  <DialogTrigger>
                    <div
                      onClick={(e: any) => {
                        e.preventDefault();
                        e.stopPropagation();
                        dispatch(actions.editTodo(props.eachItem));
                        props.setOpen(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-800 text-white p-4 rounded-[.8rem]"
                    >
                      <Edit2Icon className="h-10 w-10" />
                    </div>
                  </DialogTrigger>
                  <DialogContent
                    onInteractOutside={e => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className={`w-[90%] md:w-1/2 max-w-none border border-green-600/70 ${themeState === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}
                  >
                    <DialogHeader>
                      <Heading text="Edit Todo" size="2.6rem" weight="600" />
                    </DialogHeader>
                    <TodoDialog closeDialog={() => props.setOpen(false)} />
                  </DialogContent>
                </Dialog>

                <div
                  onClick={() => setOpenDeleteConfirmation(true)}
                  className="bg-red-600 hover:bg-red-800 text-white p-4 rounded-[.8rem] cursor-pointer ml-4"
                >
                  {isLoading ? (
                    <Icons.Spinner className="h-10 w-10 animate-spin" />
                  ) : (
                    <Trash2Icon className="h-10 w-10" />
                  )}
                </div>
                {openDeleteConfirmation && (
                  <ConfirmationDialog
                    module="Todo"
                    operation="delete"
                    buttons={{ cancel: 'No', confirm: 'Yes' }}
                    open={openDeleteConfirmation}
                    setOpen={setOpenDeleteConfirmation}
                    confirm={() => {
                      deleteTodo({ todoId: _id, userId: userId });
                    }}
                  />
                )}
              </div>
              <p
                className={`${themeState === 'dark' ? 'text-white' : 'text-black-700'} text-[1.4rem] font-[800] pr-8`}
              >
                {formatDate(deadline || new Date().toISOString())}
              </p>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </React.Fragment>
  );
}
