import { Heading } from '@/app/components/Parts/heading';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import Label from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { selectTheme, selectUser } from '@/app/slice/selectors';
import { uploadToCloudinary } from '@/utils/upload-to-cloudinary';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { qaActions, useQaSlice } from '../slice';
import { toast } from '@/app/components/ui/use-toast';
import { selectEditableTool } from '../slice/selectors';
import { useDispatch } from 'react-redux';
import { Icons } from '@/app/components/ui/icons';
import { ConfirmationDialog } from '@/app/components/Parts/confirmation-dialog';

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

export const AddTool = (props: Props) => {
  const { open, setOpen } = props;
  const dispatch = useDispatch();
  const themeState = useSelector(selectTheme);
  const userState = useSelector(selectUser);
  const editableTool = useSelector(selectEditableTool);
  const { actions } = useQaSlice();
  console.log(editableTool);

  const { useCreateToolMutation, useUpdateToolMutation } = useQaSlice();

  const [
    createTool,
    {
      isLoading: createLoading,
      isSuccess: createSuccess,
      data: createdData,
      isError: isCreateError,
      error: createErrorMessage,
    },
  ] = useCreateToolMutation();

  const [
    updateTool,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      data: updatedData,
      isError: isUpdateError,
      error: updateErrorMessage,
    },
  ] = useUpdateToolMutation();

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
  const form = useForm();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
  } = form;

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('image', {
        type: 'manual',
        message: 'File Size cannot exceed 5MB',
      });
      return;
    }

    try {
      setIsUploading(true);

      const imageUrl = await uploadToCloudinary(file);
      setValue('image', imageUrl);
    } catch (err) {
      throw new Error(String(err));
    } finally {
      setIsUploading(false);
    }
  };

  function submitToolForm(data: any) {
    if (data) {
      if (editableTool) {
        updateTool({
          query: { toolId: editableTool?._id, userId: editableTool?.userId },
          body: { ...data },
        });
      } else {
        createTool({
          ...data,
          slug: data?.slug?.toLowerCase(),
          userId: userState?._id,
        });
      }
    }
  }

  useEffect(() => {
    if (createSuccess && createdData) {
      setOpen(false);
      form.reset();
      toast({
        description:
          createdData?.data?.message || 'Tool Created Successfully !',
        variant: 'success',
      });
    }
  }, [createSuccess, createdData]);

  useEffect(() => {
    if (isCreateError || createErrorMessage) {
      toast({
        description:
          String(createErrorMessage) || 'Tool could not be Created !',
        variant: 'destructive',
      });
    }
  }, [createErrorMessage, isCreateError]);

  useEffect(() => {
    if (updateSuccess && updatedData) {
      setOpen(false);
      form.reset();
      toast({
        description:
          updatedData?.data?.message || 'Tool Updated Successfully !',
        variant: 'success',
      });
    }
  }, [updateSuccess, updatedData]);

  useEffect(() => {
    if (isUpdateError || updateErrorMessage) {
      toast({
        description:
          String(updateErrorMessage) || 'Tool could not be Updated !',
        variant: 'destructive',
      });
    }
  }, [updateErrorMessage, isUpdateError]);

  useEffect(() => {
    if (!editableTool) {
      form.reset({
        _id: '',
        name: '',
        userId: '',
        slug: '',
        image: '',
        color: '',
        description: '',
      });
    }
    if (editableTool) {
      // assigning the clicked item's values to dialog form
      form.reset({
        ...editableTool,
      });
    }
  }, [editableTool, form.reset]);

  function confirmEdit() {
    return handleSubmit(submitToolForm)();
  }

  return (
    <React.Fragment>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => dispatch(actions.resetEditableTool())}
            variant="special"
            className="px-4 py-2 rounded-[.8rem]"
          >
            Add Tool
          </Button>
        </DialogTrigger>
        <DialogContent
          onInteractOutside={e => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className={`rounded-[.8rem] max-w-[90%] md:max-w-[40%] ${themeState === 'dark' ? 'bg-black text-white border-green-400' : 'bg-green-50 text-black border-green-600'}`}
        >
          {/* tool form  */}
          {editableTool ? (
            <Heading text="Edit Tool" size="2rem" weight="600" />
          ) : (
            <Heading text="Create Tool" size="2rem" weight="600" />
          )}
          <form onSubmit={handleSubmit(submitToolForm)}>
            <div className="w-full p-4">
              <div className="mb-4 p-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  {...register('name', { required: 'Name is Required !' })}
                  placeholder="Enter Tool Name"
                  className="h-[4.5rem] rounded-[.8rem]"
                />
                {errors?.name && (
                  <p className="text-red-600 font-[400] text-[1.2rem]">
                    {errors.name?.message as string}
                  </p>
                )}
              </div>
              <div className="mb-4 p-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  type="text"
                  {...register('slug', { required: 'Slug is Required !' })}
                  placeholder="Enter Tool Slug"
                  className="h-[4.5rem] rounded-[.8rem]"
                />
              </div>
              <div className="flex items-center">
                <div className="mb-4 p-2 w-1/2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    type="color"
                    {...register('color', { required: 'Colour is Required !' })}
                    placeholder="Enter Tool Name"
                    className="h-[10rem] w-[10rem] rounded-[.8rem]"
                  />
                </div>
                <div className="px-4 py-2 mb-4 grid grid-cols-12 gap-4">
                  <div className="px-2 col-space-12 md:col-span-3">
                    <Label htmlFor="imageUpload">
                      Tool Logo
                      <Input
                        id="imageUpload"
                        accept="image/*"
                        type="file"
                        className="hidden"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleImageUpload(e)
                        }
                      />
                      <div
                        className={`h-[10rem] w-[10rem] rounded-full cursor-pointer border-2 border-cyan-700`}
                      >
                        <img
                          src={watch('image') || '/images/avatar.webp'}
                          alt=""
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    </Label>
                  </div>
                </div>
              </div>
              <div className="mb-4 p-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  rows={4}
                  {...register('description', { required: false })}
                  placeholder="Enter Tool Description"
                  className="rounded-[.8rem]"
                />
              </div>
              <div className="mb-4 p-2">
                <Button
                  disabled={isUploading || createLoading || updateLoading}
                  type={!editableTool ? 'submit' : 'button'}
                  onClick={() =>
                    editableTool
                      ? setOpenConfirmation(true)
                      : console.log('create form submitted')
                  }
                  variant="primary"
                  className="w-full h-[4.5rem] rounded-[.8rem]"
                >
                  {updateLoading && editableTool && 'Editing Tool...'}
                  {createLoading && !editableTool && 'Creating Todo...'}
                  {editableTool ? 'Edit Todo' : 'Create Todo'}
                  {updateLoading ||
                    (createLoading && (
                      <Icons.Spinner className="animate-spin h-10 w-10" />
                    ))}
                </Button>
                {openConfirmation && (
                  <ConfirmationDialog
                    module="Qa"
                    operation="update"
                    buttons={{ cancel: 'No', confirm: 'Yes' }}
                    confirm={confirmEdit}
                    open={openConfirmation}
                    setOpen={setOpenConfirmation}
                  />
                )}
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};
