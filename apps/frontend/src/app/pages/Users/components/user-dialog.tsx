import { Button } from '@/app/components/ui/button';
import ErrorMessage from '@/app/components/ui/error-message';
import { Input } from '@/app/components/ui/input';
import Label from '@/app/components/ui/label';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useUsersSlice } from '../slice';
import { useDispatch, useSelector } from 'react-redux';
import { selectTheme, selectUser } from '@/app/slice/selectors';
import { toast } from '@/app/components/ui/use-toast';
import { Icons } from '@/app/components/ui/icons';
import { selectEditableUser } from '../slice/selectors';
import { ConfirmationDialog } from '@/app/components/Parts/confirmation-dialog';
import PhoneInput from 'react-phone-input-2';
import { uploadToCloudinary } from '@/utils/upload-to-cloudinary';
import './../../../../styles/common.css';
import 'react-phone-input-2/lib/style.css';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { EyeClosedIcon, EyeIcon, Link as LinkIcon, Upload } from 'lucide-react';

type Props = {
  createUser?: any;
  isCreateLoading?: any;
  updateUser?: any;
  isUpdateLoading?: any;
  closeDialog?: any;
  isUpdateSuccess?: any;
  updatedData?: any;
};

type UserForm = {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  profilePicture: string;
  bio: string;
  isAdmin: 'Yes' | 'No' | '';
};

export const normalizePhoneForInput = (phone?: string) => {
  if (!phone) return '';
  const trimmed = phone.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('+')) return trimmed.slice(1);
  if (/^\d{10}$/.test(trimmed)) {
    return `91${trimmed}`;
  }
  return trimmed;
};

export const UserDialog = ({
  createUser,
  updateUser,
  isCreateLoading,
  isUpdateLoading,
  closeDialog,
  isUpdateSuccess,
  updatedData,
}: Props) => {
  const isLoading = Boolean(isCreateLoading || isUpdateLoading);
  const { actions } = useUsersSlice();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [avatarTab, setAvatarTab] = useState<'upload' | 'url'>('upload');

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('profilePicture', {
        type: 'manual',
        message: 'File Size cannot exceed 5MB',
      });
      return;
    }

    try {
      clearErrors('profilePicture');
      setIsUploading(true);

      const imageUrl = await uploadToCloudinary(file);
      setValue('profilePicture', imageUrl, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } catch (err: any) {
      setError('profilePicture', {
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

  const user = useSelector(selectUser);
  const editableUser = useSelector(selectEditableUser);
  const themeState = useSelector(selectTheme);
  const isDark = themeState === 'dark';
  const dispatch = useDispatch();

  const [openEditConfirmation, setOpenEditConfirmation] =
    useState<boolean>(false);

  const form = useForm<UserForm>({
    defaultValues: {
      _id: '',
      name: '',
      email: '',
      password: '',
      phone: '',
      profilePicture: '',
      bio: '',
      isAdmin: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
    setError,
    clearErrors,
    setValue,
  } = form;

  useEffect(() => {
    register('profilePicture');
  }, [register]);

  /**
   * Populate the form when editing a Todo.
   *
   * API deadline is a string, but the UI/form
   * keeps deadline as a Date.
   */
  useEffect(() => {
    if (!editableUser) {
      reset({
        _id: '',
        name: '',
        email: '',
        password: '',
        phone: '',
        profilePicture: '',
        bio: '',
        isAdmin: '',
      });
      setAvatarTab('upload');
      return;
    }

    reset({
      name: editableUser.name || '',
      email: editableUser.email || '',
      password: '',
      phone: normalizePhoneForInput(editableUser.phone),
      profilePicture: editableUser.profilePicture || '',
      bio: editableUser.bio || '',
      isAdmin: editableUser.isAdmin ? 'Yes' : 'No',
    });
    setAvatarTab(editableUser.profilePicture ? 'url' : 'upload');
  }, [editableUser, reset]);

  const submitUserForm = (formData: UserForm) => {
    const { password, ...rest } = formData;
    const payload = editableUser ? rest : formData;
    const body = {
      ...payload,
      isAdmin: formData.isAdmin === 'Yes' ? true : false,
    };
    editableUser
      ? updateUser({ userId: editableUser._id, body })
      : createUser({ adminId: user?._id, body });

    setTimeout(() => {
      closeDialog?.();
    }, 4000);
  };

  const confirmEdit = () => {
    handleSubmit(submitUserForm)();
  };

  return (
    <div className="w-full p-5">
      <form onSubmit={handleSubmit(submitUserForm)}>
        {/* Name */}
        <div className="Textbox-design common-shadow">
          <Label htmlFor="userName">Name</Label>

          <Input
            {...register('name', {
              required: 'Name is Required !',
            })}
            id="userName"
            placeholder="userName"
            className={`h-[5rem] focus:h-[5.5rem] w-full rounded-[.8rem] text-[1.4rem] focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all duration-200 ${themeState === 'dark' ? 'bg-black text-white' : ''}`}
          />

          <ErrorMessage error={errors.name} />
        </div>

        {/* Email */}
        <div className="Textbox-design common-shadow">
          <Label htmlFor="userEmail">Email</Label>

          <Input
            {...register('email', {
              required: 'Email is Required !',
            })}
            id="userEmail"
            placeholder="User Email"
            className={`h-[5rem] focus:h-[5.5rem] w-full rounded-[.8rem] text-[1.4rem] focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all duration-200 ${themeState === 'dark' ? 'bg-black text-white' : ''}`}
          />

          <ErrorMessage error={errors.email} />
        </div>

        {/* Password - only shown when creating user, completely removed when updating user/admin */}
        {!editableUser && (
          <div className="Textbox-design common-shadow">
            <Label htmlFor="userPassword">Password</Label>
            <div className="relative flex items-center">
              <Input
                id="userPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your Password"
                className={`h-[5rem] focus:h-[5.5rem] w-full rounded-[.8rem] text-[1.4rem] pr-12 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all duration-200 ${themeState === 'dark' ? 'bg-black text-white' : ''}`}
                {...register('password', {
                  required: !editableUser ? 'Password is required' : false,
                  pattern: !editableUser
                    ? {
                        value:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()[\]{}\-_=+|;:'",.<>/~`\\])[A-Za-z\d@$!%*?&^#()[\]{}\-_=+|;:'",.<>/~`\\]{8,}$/,
                        message:
                          'Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character.',
                      }
                    : undefined,
                })}
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer flex items-center justify-center p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeIcon className="h-6 w-6" />
                ) : (
                  <EyeClosedIcon className="h-6 w-6" />
                )}
              </button>
            </div>

            <ErrorMessage error={errors.password} />
          </div>
        )}

        {/* Phone */}
        <div className="Textbox-design common-shadow">
          <Label htmlFor="phone">Phone Number</Label>
          <Controller
            name="phone"
            control={control}
            rules={{
              required: 'Phone Number is Required',
            }}
            render={({ field }) => (
              <PhoneInput
                country="in"
                enableSearch
                containerClass={
                  themeState === 'dark' ? 'w-full dark-phone-input' : 'w-full'
                }
                value={normalizePhoneForInput(field.value)}
                onChange={val => field.onChange(val ? `+${val}` : '')}
                onBlur={field.onBlur}
              />
            )}
          />
          {errors.phone && (
            <div className="text-red-600 text-[1rem] mt-1">
              {String(errors?.phone?.message)}
            </div>
          )}
        </div>

        {/* profilePicture */}
        <div className="px-2 mb-4">
          <Label
            htmlFor={
              avatarTab === 'upload' ? 'imageUpload' : 'profilePictureUrlInput'
            }
            className="text-[2rem] font-bold text-cyan-800 dark:text-cyan-400 mb-2 block"
          >
            Profile Picture
          </Label>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
            {/* Avatar Preview */}
            <div className="relative h-[9rem] w-[9rem] rounded-full border-2 border-cyan-700 overflow-hidden shrink-0 bg-neutral-800/10 flex items-center justify-center">
              <img
                src={watch('profilePicture') || '/images/avatar.webp'}
                alt="Profile Preview"
                className="w-full h-full rounded-full object-cover"
                onError={e => {
                  (e.target as HTMLImageElement).src = '/images/avatar.webp';
                }}
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Icons.Spinner className="animate-spin h-7 w-7 text-cyan-400" />
                </div>
              )}
            </div>

            {/* Tabs for Upload File vs Image URL */}
            <div className="flex-1 w-full min-w-0">
              <Tabs
                value={avatarTab}
                onValueChange={val => setAvatarTab(val as 'upload' | 'url')}
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
                        ? 'text-gray-300 hover:text-white data-[state=active]:bg-cyan-700 data-[state=active]:text-white'
                        : 'text-gray-600 hover:text-black data-[state=active]:bg-cyan-700 data-[state=active]:text-white'
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
                        ? 'text-gray-300 hover:text-white data-[state=active]:bg-cyan-700 data-[state=active]:text-white'
                        : 'text-gray-600 hover:text-black data-[state=active]:bg-cyan-700 data-[state=active]:text-white'
                    }`}
                  >
                    <LinkIcon size={14} />
                    <span>Image URL</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="mt-1 outline-none">
                  <label
                    htmlFor="imageUpload"
                    className={`flex items-center justify-center gap-2 px-3 py-3 rounded-[.8rem] text-xs font-medium border border-dashed cursor-pointer transition-colors ${
                      isDark
                        ? 'border-gray-700 hover:border-cyan-500 bg-neutral-900/60 text-gray-200'
                        : 'border-gray-300 hover:border-cyan-600 bg-white text-gray-800'
                    }`}
                  >
                    <Upload size={14} />
                    <span>
                      {isUploading ? 'Uploading...' : 'Choose file (Max 5MB)'}
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
                    id="profilePictureUrlInput"
                    type="url"
                    placeholder="Paste image URL (https://...)"
                    value={watch('profilePicture') || ''}
                    onChange={e => {
                      clearErrors('profilePicture');
                      setValue('profilePicture', e.target.value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                    className={`h-[3.8rem] rounded-[.8rem] text-xs focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600 transition-all duration-200 ${
                      isDark
                        ? 'bg-black text-white border-cyan-700/70'
                        : 'bg-white text-black'
                    }`}
                  />
                </TabsContent>
              </Tabs>

              {errors?.profilePicture && (
                <p className="text-red-600 font-[400] text-[1.2rem] mt-1">
                  {errors.profilePicture?.message as string}
                </p>
              )}
            </div>
          </div>
          {!watch('profilePicture') && !errors?.profilePicture && (
            <div className="text-red-600 text-[1rem] mt-1">
              Profile Picture is Required !
            </div>
          )}
        </div>

        {/* Bio */}
        <div className="Textbox-design common-shadow">
          <Label htmlFor="userBio">Bio</Label>

          <Textarea
            {...register('bio', {
              required: 'Bio is Required !',
            })}
            rows={2}
            id="userBio"
            placeholder="User Bio"
            className={`w-full rounded-[.8rem] text-[1.4rem] ${themeState === 'dark' ? 'bg-black text-white' : ''}`}
          />

          <ErrorMessage error={errors.bio} />
        </div>

        {/* Submit */}
        <div className="Textbox-design common-shadow">
          <Button
            type={editableUser ? 'button' : 'submit'}
            onClick={() =>
              editableUser
                ? setOpenEditConfirmation(true)
                : console.log('create form submitted')
            }
            variant="primary"
            disabled={isCreateLoading || isUpdateLoading}
            className="w-full rounded-[.8rem] py-4"
          >
            {isUpdateLoading && editableUser
              ? 'Editing User...'
              : isCreateLoading && !editableUser
                ? 'Creating User...'
                : editableUser
                  ? 'Edit User'
                  : 'Create User'}

            {(isCreateLoading || isUpdateLoading) && (
              <Icons.Spinner className="h-8 w-8 animate-spin" />
            )}
          </Button>
          {openEditConfirmation && (
            <ConfirmationDialog
              module="User"
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
