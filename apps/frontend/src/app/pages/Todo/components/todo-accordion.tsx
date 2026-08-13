import React, { useEffect } from 'react';
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

  const [deleteTodo, { isSuccess, data, isError, error }] =
    useDeleteTodoMutation();

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
        className={`${themeState === 'dark' ? 'bg-black' : 'bg-teal-100'} mb-4 md:mb-8 border border-teal-700 rounded-[.8rem]`}
      >
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center justify-between px-4 py-2 w-full">
            <div>
              <h4 className="text-xl font-[600]">{title}</h4>
            </div>
            <div className="flex items-center gap-4">
              <Dialog open={props.open} onOpenChange={props.setOpen}>
                <DialogTrigger asChild>
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
                  className={`w-[90%] md:w-1/2 max-w-none border-0 ${themeState === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}
                >
                  <DialogHeader>
                    <Heading text="Edit Todo" size="2.6rem" weight="600" />
                  </DialogHeader>
                  <TodoDialog closeDialog={() => props.setOpen(false)} />
                </DialogContent>
              </Dialog>

              <div
                onClick={() => deleteTodo({ todoId: _id, userId: userId })}
                className="bg-red-600 hover:bg-red-800 text-white p-4 rounded-[.8rem]"
              >
                <Trash2Icon className="h-10 w-10" />
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-4 min-h-[15rem] relative themeState === 'dark' ? 'bg-black' : 'bg-teal-100'} border border-teal-700 rounded-[.8rem]">
          <p className="text-lg font-medium">{description}</p>
          <div className="absolute bottom-2 flex items-center justify-between w-full">
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
