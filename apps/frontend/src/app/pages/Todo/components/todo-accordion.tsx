import React, { useState } from 'react';
import { TodoItem } from '../slice/types';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion';
import { Check, Edit2Icon, Loader2, Trash2Icon } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import { useSelector } from 'react-redux';
import { selectTheme } from '@/app/slice/selectors';
import { useTodoSlice } from '../slice';
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
  updateTodo?: any;
  isUpdateLoading?: any;
  deleteLoading: boolean;
  deleteTodo: any;
};
export function TodoAccordionItem(props: Props) {
  const themeState = useSelector(selectTheme);
  const dispatch = useDispatch();
  const { _id, title, description, urgency, deadline, userId, isCompleted } =
    props.eachItem;
  const { actions } = useTodoSlice();

  const [isEditableDialogOpen, setIsEditableDialogOpen] =
    useState<boolean>(false);

  const [openDeleteConfirmation, setOpenDeleteConfirmation] =
    useState<boolean>(false);

  const [isToggling, setIsToggling] = useState<boolean>(false);

  const handleToggleComplete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isToggling) return;
    setIsToggling(true);
    try {
      await props
        .updateTodo?.({
          todoId: _id,
          body: {
            title,
            description,
            urgency,
            deadline,
            userId,
            isCompleted: !isCompleted,
          },
        })
        .unwrap();
    } catch (err) {
      // Error is caught and surfaced via parent toast
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <React.Fragment>
      <AccordionItem
        value={_id}
        className={`${themeState === 'dark' ? 'bg-black' : 'bg-green-100'} mb-4 md:mb-8 border border-green-700 rounded-[.8rem]`}
      >
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center justify-between px-4 py-2 w-full">
            <div className="flex items-center gap-4">
              <button
                type="button"
                disabled={isToggling}
                title={
                  isToggling
                    ? 'Updating status...'
                    : isCompleted
                      ? 'Mark as Incomplete'
                      : 'Mark as Completed'
                }
                onClick={handleToggleComplete}
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 border-green-600 p-1.5 transition-all duration-200 cursor-pointer disabled:cursor-wait select-none ${
                  isCompleted
                    ? 'bg-green-600 text-white shadow-sm hover:bg-green-700 hover:border-green-700'
                    : themeState === 'dark'
                      ? 'bg-black text-transparent hover:bg-green-600/15'
                      : 'bg-white text-transparent hover:bg-green-50'
                }`}
              >
                {isToggling ? (
                  <Loader2
                    className={`w-4 h-4 animate-spin ${
                      isCompleted ? 'text-white' : 'text-green-600'
                    }`}
                  />
                ) : isCompleted ? (
                  <Check className="w-4 h-4 stroke-[3] text-white" />
                ) : null}
              </button>
              <div className="flex items-center gap-3">
                <h4
                  className={`text-xl font-[600] text-left ${
                    isCompleted ? 'line-through text-gray-500' : ''
                  }`}
                >
                  {title}
                </h4>
                {isCompleted && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-green-600/20 text-green-600 border border-green-600/30 font-semibold">
                    Completed
                  </span>
                )}
              </div>
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
              <span className="text-gray-400">|</span>
              <button
                type="button"
                disabled={isToggling}
                onClick={handleToggleComplete}
                className={`text-xs px-3 py-1 rounded-full font-bold transition-all cursor-pointer border flex items-center gap-1.5 disabled:opacity-75 disabled:cursor-wait ${
                  isCompleted
                    ? 'bg-green-600 text-white border-green-600 hover:bg-green-700'
                    : 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30'
                }`}
              >
                {isToggling ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>{isCompleted ? 'Completed' : 'Pending'}</span>
                )}
              </button>
            </div>
            <div className="">
              <div className="flex items-center justify-between mb-4">
                <Dialog
                  open={isEditableDialogOpen}
                  onOpenChange={setIsEditableDialogOpen}
                >
                  <DialogTrigger>
                    <div
                      onClick={(e: any) => {
                        e.preventDefault();
                        e.stopPropagation();
                        dispatch(actions.editTodo(props.eachItem));
                        setIsEditableDialogOpen(true);
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
                    <TodoDialog
                      closeDialog={() => setIsEditableDialogOpen(false)}
                      updateTodo={props.updateTodo}
                      isUpdateLoading={props.isUpdateLoading}
                    />
                  </DialogContent>
                </Dialog>

                <div
                  onClick={() => {
                    if (!props.deleteLoading) {
                      setOpenDeleteConfirmation(true);
                    }
                  }}
                  className={`bg-red-600 hover:bg-red-800 text-white p-4 rounded-[.8rem] ml-4 ${props.deleteLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                >
                  {props.deleteLoading ? (
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
                      props.deleteTodo({ todoId: _id, userId: userId });
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
