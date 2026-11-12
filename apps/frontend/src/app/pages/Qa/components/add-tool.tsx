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
import { useQaSlice } from '../slice';
import { toast } from '@/app/components/ui/use-toast';
import { selectEditableTool } from '../slice/selectors';
import { useDispatch } from 'react-redux';
import { Icons } from '@/app/components/ui/icons';
import { ConfirmationDialog } from '@/app/components/Parts/confirmation-dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { Link as LinkIcon, Upload } from 'lucide-react';

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
  const [logoTab, setLogoTab] = useState<'upload' | 'url'>('upload');
  const form = useForm();
  const isDark = themeState === 'dark';

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
  } = form;

  useEffect(() => {
    register('image');
  }, [register]);

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
      clearErrors('image');
      setIsUploading(true);

      const imageUrl = await uploadToCloudinary(file);
      setValue('image', imageUrl, { shouldValidate: true, shouldDirty: true });
    } catch (err: any) {
      setError('image', {
        type: 'manual',
        message: err?.message || 'Failed to upload image',
      });
      toast({
        description: 'Failed to upload image. Please try again or paste a URL.',
        variant: 'destructive',
      });
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
  }, [createSuccess, createdData, form, setOpen]);

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
  }, [updateSuccess, updatedData, form, setOpen]);

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
    if (open) {
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
        setLogoTab('upload');
      }
      if (editableTool) {
        // assigning the clicked item's values to dialog form
        form.reset({
          ...editableTool,
        });
        setLogoTab(editableTool.image ? 'url' : 'upload');
      }
    }
  }, [open, editableTool, form]);

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
                  className={`h-[5rem] focus:h-[5.5rem] rounded-[.8rem] focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all duration-200 ${themeState === 'dark' ? 'bg-black text-white' : ''}`}
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
                  className={`h-[5rem] focus:h-[5.5rem] rounded-[.8rem] focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all duration-200 ${themeState === 'dark' ? 'bg-black text-white' : ''}`}
                />
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4 p-2">
                <div className="w-full sm:w-1/3">
                  <Label htmlFor="color">Color</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Input
                      id="color"
                      type="color"
                      {...register('color', {
                        required: 'Colour is Required !',
                      })}
                      className="h-[5rem] w-[5rem] rounded-[.8rem] p-1 cursor-pointer border border-green-600/70"
                    />
                    <span className="text-sm font-mono uppercase font-semibold text-gray-500">
                      {watch('color') || '#000000'}
                    </span>
                  </div>
                  {errors?.color && (
                    <p className="text-red-600 font-[400] text-[1.2rem] mt-1">
                      {errors.color?.message as string}
                    </p>
                  )}
                </div>

                <div className="w-full sm:w-2/3">
                  <Label
                    htmlFor={
                      logoTab === 'upload' ? 'imageUpload' : 'imageUrlInput'
                    }
                  >
                    Tool Logo
                  </Label>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="relative h-[8rem] w-[8rem] rounded-full border-2 border-green-600/70 overflow-hidden shrink-0 bg-neutral-800/10 flex items-center justify-center">
                      <img
                        src={watch('image') || '/images/tool-placeholder.jpg'}
                        alt="Tool Logo"
                        className="w-full h-full rounded-full object-cover"
                        onError={e => {
                          (e.target as HTMLImageElement).src =
                            '/images/tool-placeholder.jpg';
                        }}
                      />
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Icons.Spinner className="animate-spin h-6 w-6 text-green-500" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 w-full min-w-0">
                      <Tabs
                        value={logoTab}
                        onValueChange={val =>
                          setLogoTab(val as 'upload' | 'url')
                        }
                        className="w-full"
                      >
                        <TabsList
                          className={`p-1 rounded-xl border flex gap-1 mb-2 ${
                            isDark
                              ? 'bg-[#181818] border-gray-800'
                              : 'bg-gray-100 border-gray-200'
                          }`}
                        >
                          <TabsTrigger
                            value="upload"
                            type="button"
                            className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              isDark
                                ? 'text-gray-300 hover:text-white data-[state=active]:bg-green-600 data-[state=active]:text-white'
                                : 'text-gray-600 hover:text-black data-[state=active]:bg-green-600 data-[state=active]:text-white'
                            }`}
                          >
                            <Upload size={14} />
                            <span>Upload File</span>
                          </TabsTrigger>

                          <TabsTrigger
                            value="url"
                            type="button"
                            className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              isDark
                                ? 'text-gray-300 hover:text-white data-[state=active]:bg-green-600 data-[state=active]:text-white'
                                : 'text-gray-600 hover:text-black data-[state=active]:bg-green-600 data-[state=active]:text-white'
                            }`}
                          >
                            <LinkIcon size={14} />
                            <span>Image URL</span>
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent
                          value="upload"
                          className="mt-1 outline-none"
                        >
                          <label
                            htmlFor="imageUpload"
                            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-[.8rem] text-xs font-medium border border-dashed cursor-pointer transition-colors ${
                              isDark
                                ? 'border-gray-700 hover:border-green-500 bg-neutral-900/60 text-gray-200'
                                : 'border-gray-300 hover:border-green-600 bg-white text-gray-800'
                            }`}
                          >
                            <Upload size={14} />
                            <span>
                              {isUploading
                                ? 'Uploading...'
                                : 'Choose file (Max 5MB)'}
                            </span>
                            <input
                              id="imageUpload"
                              accept="image/*"
                              type="file"
                              className="hidden"
                              disabled={isUploading}
                              onChange={handleImageUpload}
                            />
                          </label>
                        </TabsContent>

                        <TabsContent value="url" className="mt-1 outline-none">
                          <Input
                            id="imageUrlInput"
                            type="url"
                            placeholder="Paste image URL (https://...)"
                            value={watch('image') || ''}
                            onChange={e => {
                              clearErrors('image');
                              setValue('image', e.target.value, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                            }}
                            className={`h-[3.8rem] rounded-[.8rem] text-xs focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all duration-200 ${
                              isDark
                                ? 'bg-black text-white border-green-600/70'
                                : 'bg-white text-black'
                            }`}
                          />
                        </TabsContent>
                      </Tabs>

                      {errors?.image && (
                        <p className="text-red-600 font-[400] text-[1.2rem] mt-1">
                          {errors.image?.message as string}
                        </p>
                      )}
                    </div>
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
                  {updateLoading && editableTool
                    ? 'Editing Tool...'
                    : createLoading && !editableTool
                      ? 'Creating Tool...'
                      : editableTool
                        ? 'Edit Tool'
                        : 'Create Tool'}
                  {(updateLoading || createLoading) && (
                    <Icons.Spinner className="animate-spin h-10 w-10 ml-2" />
                  )}
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
