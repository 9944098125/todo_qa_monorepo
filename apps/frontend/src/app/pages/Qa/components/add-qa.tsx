import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { selectTheme, selectUser } from '@/app/slice/selectors';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useSelector } from 'react-redux';
import { ToolItem } from '../slice/types';
import { Controller, useForm } from 'react-hook-form';
import Label from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Heading } from '@/app/components/Parts/heading';
import { useQaSlice } from '../slice';
import { Icons } from '@/app/components/ui/icons';
import { toast } from '@/app/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

type Props = {
  tools: ToolItem[];
};
export function AddQa(props: Props) {
  const { tools } = props;
  const navigate = useNavigate();

  const { useCreateQaMutation, useUpdateQaMutation } = useQaSlice();
  const user = useSelector(selectUser);

  const [
    createQa,
    {
      isLoading: createLoading,
      isSuccess: createSuccess,
      data: createdData,
      isError: isCreateError,
      error: createErrorMessage,
    },
  ] = useCreateQaMutation();

  const [
    updateQa,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      data: updatedData,
      isError: isUpdateError,
      error: updateErrorMessage,
    },
  ] = useUpdateQaMutation();

  const themeState = useSelector(selectTheme);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const submitQaForm = data => {
    if (data) {
      createQa({
        ...data,
        userId: user?._id,
        importance: 'Important',
      });
    }
  };

  useEffect(() => {
    if (createSuccess && createdData) {
      setOpen(false);
      navigate(`/qa?toolId=${watch('toolId')}`);
      toast({
        description: createdData?.data?.message,
        variant: 'success',
      });
    } else if (isCreateError || createErrorMessage) {
      toast({
        description: String(createErrorMessage) || 'Create Qa Failure',
        variant: 'destructive',
      });
    }
  }, [createSuccess, createdData, isCreateError, createErrorMessage]);

  return (
    <React.Fragment>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="special" className="px-4 py-2 rounded-[.8rem]">
            Add Qa
          </Button>
        </DialogTrigger>
        <DialogContent
          onInteractOutside={e => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className={`p-4 rounded-[.8rem] max-w-[70%] ${themeState === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
        >
          <Heading text="Create Qa" size="3rem" weight="700" />
          <form onSubmit={handleSubmit(submitQaForm)}>
            <div className="w-full flex flex-wrap gap-4 p-4 items-center">
              {tools?.map(i => {
                return (
                  <div
                    onClick={() => setValue('toolId', i?._id)}
                    style={{
                      borderColor: i?.color,
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      backgroundColor:
                        i?._id === watch('toolId') ? i?.color : '',
                      color: i?._id === watch('toolId') ? 'white' : '',
                    }}
                    className="px-4 py-2 rounded-[.8rem] cursor-pointer"
                  >
                    {i?.name}
                  </div>
                );
              })}
              {!watch('toolId') && (
                <p className="text-1rem text-red-600">Tool ID is Required !</p>
              )}
            </div>
            <div className="w-full py-4">
              <div className="mb-4">
                <Label htmlFor="question">Question</Label>
                <Input
                  type="text"
                  {...register('question', {
                    required: 'Questions is Required !',
                  })}
                  id="question"
                  placeholder="Enter your Question..."
                  className="w-full h-[4.5rem] rounded-[.8rem]"
                />
                {errors?.question && (
                  <p className="text-[1rem] text-red-600">
                    {errors?.question?.message?.toString()}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <Label htmlFor="answer">Answer</Label>
                <div className="rounded-[.8rem] focus-within:ring-2 focus-within:ring-green-600 focus-within:border-green-600 [&_.ql-editor]:min-h-[20rem]">
                  <Controller
                    name="answer"
                    control={control}
                    rules={{ required: 'Answer is required !' }}
                    render={({ field }) => (
                      <ReactQuill
                        theme="snow"
                        value={field.value || ''}
                        onChange={field.onChange}
                        className="h-full"
                      />
                    )}
                  />
                  {errors?.answer && (
                    <p className="text-[1rem] text-red-600">
                      {errors.answer?.message?.toString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-4 py-2">
                <Button
                  type="submit"
                  disabled={createLoading}
                  variant="primary"
                  className="w-full h-[4.5rem] rounded-[.8rem]"
                >
                  {createLoading ? 'Creating Qa...' : 'Create Qa'}
                  {createLoading && (
                    <Icons.Spinner className="animate-spin h-8 w-8" />
                  )}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
