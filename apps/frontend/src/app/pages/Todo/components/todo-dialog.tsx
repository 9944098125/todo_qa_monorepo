import { DatePicker } from '@/app/components/Parts/date-picker';
import { Button } from '@/app/components/ui/button';
import ErrorMessage from '@/app/components/ui/error-message';
import { Input } from '@/app/components/ui/input';
import Label from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Textarea } from '@/app/components/ui/textarea';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTodoSlice } from '../slice';
import { useSelector } from 'react-redux';
import { selectTheme, selectUser } from '@/app/slice/selectors';
import { toast } from '@/app/components/ui/use-toast';
import { Icons } from '@/app/components/ui/icons';
import { selectEditableTodo } from '../slice/selectors';
import { isValid, parseISO } from 'date-fns';
import { ConfirmationDialog } from '@/app/components/Parts/confirmation-dialog';
import { streamText } from '@/utils/streamText';
import { endpoints } from '@/utils/api/endpoints';

type Props = {
  closeDialog?: any;
  updateTodo?: any;
  createTodo?: any;
  isCreateLoading?: boolean;
  isUpdateLoading?: boolean;
};

type TodoForm = {
  title: string;
  description: string;
  urgency: 'Yes' | 'No' | '';
  deadline: Date;
  isCompleted?: boolean;
};

export const TodoDialog = ({
  updateTodo,
  createTodo,
  isUpdateLoading,
  isCreateLoading,
}: Props) => {
  const { useGenerateTodoDescriptionMutation } = useTodoSlice();

  const [
    generateDescription,
    {
      isLoading: isGdLoading,
      isSuccess: isGdSuccess,
      data: gdData,
      isError: isGdError,
      error: gdErrorMessage,
    },
  ] = useGenerateTodoDescriptionMutation();

  const user = useSelector(selectUser);
  const editableTodo = useSelector(selectEditableTodo);
  const themeState = useSelector(selectTheme);

  const [openEditConfirmation, setOpenEditConfirmation] =
    useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);

  const streamAbortRef = useRef<AbortController | null>(null);
  const form = useForm<TodoForm>({
    defaultValues: {
      title: '',
      description: '',
      urgency: '',
      deadline: new Date(),
      isCompleted: false,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
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
        isCompleted: false,
      });

      return;
    }

    const deadline = parseISO(editableTodo.deadline);

    reset({
      title: editableTodo.title,
      description: editableTodo.description,
      urgency: editableTodo.urgency ? 'Yes' : 'No',
      deadline: isValid(deadline) ? deadline : new Date(),
      isCompleted: editableTodo.isCompleted ?? false,
    });
  }, [editableTodo, reset]);

  const submitTodoForm = (formData: TodoForm) => {
    const body = {
      ...formData,
      // Convert UI value to API value
      urgency: formData.urgency === 'Yes',

      // Convert Date to API string
      deadline: formData.deadline.toISOString(),

      isCompleted: Boolean(formData.isCompleted),

      userId: user?._id,
    };
    editableTodo
      ? updateTodo({ body, todoId: editableTodo?._id })
      : createTodo(body);
  };

  const confirmEdit = () => {
    handleSubmit(submitTodoForm)();
  };

  const gtd = (title: string) => {
    if (!title.trim() || isStreaming) return;

    const controller = new AbortController();
    streamAbortRef.current = controller;

    setIsStreaming(true);
    setStreamError(null);

    setValue('description', '', {
      shouldDirty: true,
      shouldValidate: false,
    });

    streamText({
      url: `${endpoints.baseUrl.replace(/\/+$/, '')}${endpoints.generateTodoDescription.url}`,
      body: { todoTitle: title },
      signal: controller.signal,
      delayMs: 50,
      onText: fullText => {
        setValue('description', fullText, {
          shouldDirty: true,
          shouldValidate: false,
        });
      },
    })
      .catch((error: any) => {
        if (error instanceof Error && error.name !== 'AbortError') {
          setStreamError(error.message);
        }
      })
      .finally(() => {
        if (streamAbortRef.current === controller) {
          streamAbortRef.current = null;
          setIsStreaming(false);
        }
      });
  };

  useEffect(() => {
    if (isGdSuccess && gdData) {
      form.setValue(
        'description',
        gdData?.data?.data?.generatedTodoDescription,
      );
    }
  }, [isGdSuccess, gdData]);

  useEffect(() => {
    if (isGdError || gdErrorMessage) {
      toast({
        description: String(gdErrorMessage) || 'Something went wrong !',
        variant: 'destructive',
      });
    }
  }, [gdErrorMessage, isGdError]);

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
            className={`h-[5rem] focus:h-[5.5rem] w-full mt-4 rounded-[.8rem] text-[1.4rem] focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all duration-200 ${themeState === 'dark' ? 'bg-black text-white' : ''}`}
          />

          <ErrorMessage error={errors.title} />
        </div>

        {/* Description */}
        <div className="mb-4 px-4 py-2">
          <div className="flex items-end justify-between mb-4">
            <Label htmlFor="todoDesc">Todo Description</Label>
            {form.watch('title') && (
              <Button
                variant="special"
                type="button"
                disabled={isGdLoading}
                className="py-2 px-5 rounded-[.8rem]"
                onClick={() => gtd(form.watch('title'))}
              >
                {isGdLoading ? 'Generating...' : 'Generate with AI'}
                {isGdLoading && (
                  <Icons.Spinner className="animate-spin h-8 w-8" />
                )}
              </Button>
            )}
          </div>

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
          <Label htmlFor="urgency" dark={themeState === 'dark'}>
            Urgency
          </Label>

          <Controller
            name="urgency"
            control={control}
            rules={{
              required: 'Please mention the urgency !',
            }}
            render={({ field, fieldState }) => (
              <>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="mt-3"
                >
                  <div className="flex items-center gap-10">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="Yes" id="yes" />

                      <Label
                        htmlFor="yes"
                        dark={themeState === 'dark'}
                        className="cursor-pointer text-[1.6rem] font-medium select-none"
                      >
                        Yes
                      </Label>
                    </div>

                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="No" id="no" />

                      <Label
                        htmlFor="no"
                        dark={themeState === 'dark'}
                        className="cursor-pointer text-[1.6rem] font-medium select-none"
                      >
                        No
                      </Label>
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

        {/* Completion Status */}
        <div className="mb-4 px-4 py-2">
          <Label htmlFor="isCompleted">Completion Status</Label>
          <div className="mt-2 flex items-center gap-3">
            <Controller
              name="isCompleted"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="isCompleted"
                    checked={Boolean(field.value)}
                    onChange={e => field.onChange(e.target.checked)}
                    className="w-6 h-6 rounded text-green-600 focus:ring-green-500 cursor-pointer"
                  />
                  <span
                    className={`text-[1.6rem] font-medium ${
                      themeState === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {field.value ? 'Completed' : 'Pending'}
                  </span>
                </label>
              )}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="mb-4 px-4 py-2">
          <Button
            type={editableTodo ? 'button' : 'submit'}
            onClick={() =>
              editableTodo
                ? setOpenEditConfirmation(true)
                : console.log('create form submitted')
            }
            variant="primary"
            disabled={isCreateLoading || isUpdateLoading}
            className="w-full rounded-[.8rem] py-4"
          >
            {isUpdateLoading && editableTodo
              ? 'Editing Todo...'
              : isCreateLoading && !editableTodo
                ? 'Creating Todo...'
                : editableTodo
                  ? 'Edit Todo'
                  : 'Create Todo'}
            {(isCreateLoading || isUpdateLoading) && (
              <Icons.Spinner className="h-8 w-8 animate-spin" />
            )}
          </Button>
          {openEditConfirmation && (
            <ConfirmationDialog
              module="Todo"
              operation="update"
              buttons={{ cancel: 'No', confirm: 'Yes' }}
              confirm={confirmEdit}
              open={openEditConfirmation}
              setOpen={setOpenEditConfirmation}
            />
          )}
        </div>
      </form>
    </div>
  );
};
