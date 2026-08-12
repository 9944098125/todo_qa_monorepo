import { DatePicker } from '@/app/components/Parts/date-picker';
import { Button } from '@/app/components/ui/button';
import ErrorMessage from '@/app/components/ui/error-message';
import { Input } from '@/app/components/ui/input';
import Label from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Textarea } from '@/app/components/ui/textarea';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTodoSlice } from '../slice';
import { useSelector } from 'react-redux';
import { selectUser } from '@/app/slice/selectors';
import { toast } from '@/app/components/ui/use-toast';
import { Icons } from '@/app/components/ui/icons';
import { TodoResponse } from '../slice/types';

type Props = {
  closeDialog: () => void;
};

export const TodoDialog = (props: Props) => {
  const { closeDialog } = props;
  const { useCreateTodoMutation } = useTodoSlice();

  const [createTodo, { isLoading, isSuccess, isError, error, data }] =
    useCreateTodoMutation();
  const user = useSelector(selectUser);
  const form = useForm<TodoForm>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = form;

  const submitTodoForm = (data: any) => {
    const body = {
      ...data,
      urgency: data.urgency.toLowerCase() === 'yes' ? true : false,
      userId: user?._id,
    };
    createTodo(body);
  };

  useEffect(() => {
    if (isSuccess && data) {
      closeDialog();
      toast({
        description: data?.data?.message || 'Todo Created',
        variant: 'success',
      });
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (error || isError) {
      toast({
        description: String(error),
        variant: 'destructive',
      });
    }
  }, [isError, error]);

  return (
    <React.Fragment>
      <div className="p-5 w-full">
        <form onSubmit={handleSubmit(submitTodoForm)}>
          <div className="px-4 py-2 mb-4">
            <Label htmlFor="todoTitle">Todo Title</Label>
            <Input
              {...register('title', {
                required: 'Title is Required !',
              })}
              id="todoTitle"
              placeholder="Todo Title"
              className="w-full h-[4.5rem] text-[1.4rem] rounded-[.8rem]"
            />
            <ErrorMessage error={errors.title} />
          </div>

          <div className="px-4 py-2 mb-4">
            <Label htmlFor="todoDesc">Todo Description</Label>
            <Textarea
              {...register('description', {
                required: 'Description is Required !',
              })}
              rows={4}
              id="todoDesc"
              placeholder="Todo Description"
              className="w-full text-[1.4rem] rounded-[.8rem]"
            />
            <ErrorMessage error={errors.description} />
          </div>

          <div className="px-4 py-2 mb-4">
            <Label htmlFor="urgency">Urgency</Label>
            <Controller
              name="urgency"
              control={control}
              rules={{ required: 'Please mention the urgency !' }}
              render={({ field, fieldState }) => (
                <React.Fragment>
                  <RadioGroup value={field.value} onChange={field.onChange}>
                    <div className="flex items-center gap-10">
                      <div className="flex items-center gap-4">
                        <RadioGroupItem value="Yes" id="yes" />
                        <Label htmlFor="yes">Yes</Label>
                      </div>
                      <div className="flex items-center gap-4">
                        <RadioGroupItem value="No" id="no" />
                        <Label htmlFor="no">No</Label>
                      </div>
                    </div>
                  </RadioGroup>
                  <ErrorMessage error={fieldState.error} />
                </React.Fragment>
              )}
            />
          </div>

          <div className="px-4 py-2 mb-4">
            <Label htmlFor="deadline">Deadline</Label>
            <Controller
              name="deadline"
              control={control}
              rules={{ required: 'Deadline is Required !' }}
              render={({ field, fieldState }) => (
                <React.Fragment>
                  <DatePicker date={field.value} setDate={field.onChange} />
                  <ErrorMessage error={fieldState.error} />
                </React.Fragment>
              )}
            />
          </div>

          <div className="px-4 py-2 mb-4">
            <Button variant="primary" className="w-full py-4 rounded-[.8rem]">
              {isLoading ? 'Creating Todo...' : 'Create Todo'}
              {isLoading ?? <Icons.Spinner className="animate-spin h-8 w-8" />}
            </Button>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
};
