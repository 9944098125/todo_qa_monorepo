import { DatePicker } from '@/app/components/Parts/date-picker';
import { Button } from '@/app/components/ui/button';
import ErrorMessage from '@/app/components/ui/error-message';
import { Input } from '@/app/components/ui/input';
import Label from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Textarea } from '@/app/components/ui/textarea';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTodoSlice } from '../slice';
import { useSelector } from 'react-redux';
import { selectUser } from '@/app/slice/selectors';
import { toast } from '@/app/components/ui/use-toast';
import { Icons } from '@/app/components/ui/icons';
import { selectEditableTodo } from '../slice/selectors';
import { isValid, parseISO } from 'date-fns';

type Props = {
  closeDialog: () => void;
};

type TodoForm = {
  title: string;
  description: string;
  urgency: 'Yes' | 'No' | '';
  deadline: Date;
};

export const TodoDialog = ({ closeDialog }: Props) => {
  const { useCreateTodoMutation } = useTodoSlice();

  const [createTodo, { isLoading, isSuccess, isError, error, data }] =
    useCreateTodoMutation();

  const user = useSelector(selectUser);
  const editableTodo = useSelector(selectEditableTodo);

  const form = useForm<TodoForm>({
    defaultValues: {
      title: '',
      description: '',
      urgency: '',
      deadline: new Date(),
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = form;

  /**
   * Populate the form when editing a Todo.
   *
   * API deadline is a string, but the UI/form
   * keeps deadline as a Date.
   */
  useEffect(() => {
    if (!editableTodo) {
      reset({
        title: '',
        description: '',
        urgency: '',
        deadline: new Date(),
      });

      return;
    }

    const deadline = parseISO(editableTodo.deadline);

    reset({
      title: editableTodo.title,
      description: editableTodo.description,
      urgency: editableTodo.urgency ? 'Yes' : 'No',
      deadline: isValid(deadline) ? deadline : new Date(),
    });
  }, [editableTodo, reset]);

  const submitTodoForm = (formData: TodoForm) => {
    const body = {
      ...formData,

      // Convert UI value to API value
      urgency: formData.urgency === 'Yes',

      // Convert Date to API string
      deadline: formData.deadline.toISOString(),

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
  }, [isSuccess, data, closeDialog]);

  useEffect(() => {
    if (error || isError) {
      toast({
        description: String(error),
        variant: 'destructive',
      });
    }
  }, [isError, error]);

  return (
    <div className="w-full p-5">
      <form onSubmit={handleSubmit(submitTodoForm)}>
        {/* Title */}
        <div className="mb-4 px-4 py-2">
          <Label htmlFor="todoTitle">Todo Title</Label>

          <Input
            {...register('title', {
              required: 'Title is Required !',
            })}
            id="todoTitle"
            placeholder="Todo Title"
            className="h-[4.5rem] w-full rounded-[.8rem] text-[1.4rem]"
          />

          <ErrorMessage error={errors.title} />
        </div>

        {/* Description */}
        <div className="mb-4 px-4 py-2">
          <Label htmlFor="todoDesc">Todo Description</Label>

          <Textarea
            {...register('description', {
              required: 'Description is Required !',
            })}
            rows={4}
            id="todoDesc"
            placeholder="Todo Description"
            className="w-full rounded-[.8rem] text-[1.4rem]"
          />

          <ErrorMessage error={errors.description} />
        </div>

        {/* Urgency */}
        <div className="mb-4 px-4 py-2">
          <Label htmlFor="urgency">Urgency</Label>

          <Controller
            name="urgency"
            control={control}
            rules={{
              required: 'Please mention the urgency !',
            }}
            render={({ field, fieldState }) => (
              <>
                <RadioGroup value={field.value} onValueChange={field.onChange}>
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
              </>
            )}
          />
        </div>

        {/* Deadline */}
        <div className="mb-4 px-4 py-2">
          <Label htmlFor="deadline">Deadline</Label>

          <Controller
            name="deadline"
            control={control}
            rules={{
              required: 'Deadline is Required !',
            }}
            render={({ field, fieldState }) => (
              <>
                <DatePicker date={field.value} setDate={field.onChange} />

                <ErrorMessage error={fieldState.error} />
              </>
            )}
          />
        </div>

        {/* Submit */}
        <div className="mb-4 px-4 py-2">
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="w-full rounded-[.8rem] py-4"
          >
            {isLoading
              ? editableTodo
                ? 'Editing Todo...'
                : 'Creating Todo...'
              : editableTodo
                ? 'Edit Todo'
                : 'Create Todo'}

            {isLoading && <Icons.Spinner className="h-8 w-8 animate-spin" />}
          </Button>
        </div>
      </form>
    </div>
  );
};
