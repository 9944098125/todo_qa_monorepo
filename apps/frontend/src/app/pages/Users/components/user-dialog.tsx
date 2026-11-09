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
import { EyeClosedIcon, EyeIcon } from 'lucide-react';

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
      setIsUploading(true);

      const imageUrl = await uploadToCloudinary(file);
      setValue('profilePicture', imageUrl);
    } catch (err) {
      throw new Error(String(err));
    } finally {
      setIsUploading(false);
    }
  };

  const user = useSelector(selectUser);
  const editableUser = useSelector(selectEditableUser);
  const themeState = useSelector(selectTheme);
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
    setValue,
  } = form;

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
          <h4 className="text-[2.6rem] font-bold text-cyan-800 dark:text-cyan-400 mb-2">
            Profile Pic...
          </h4>
          <div className="flex items-center w-full">
            <Label htmlFor="imageUpload" className="cursor-pointer shrink-0">
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
                className={`h-[10rem] w-[10rem] rounded-full cursor-pointer border-2 border-cyan-700 relative overflow-hidden flex items-center justify-center ${errors.profilePicture ? 'border-2 border-red-600' : 'border-2 border-cyan-800'}`}
              >
                {isUploading ? (
                  <Icons.Spinner className="h-8 w-8 animate-spin text-cyan-800 dark:text-cyan-400" />
                ) : (
                  <img
                    src={watch('profilePicture') || '/images/avatar.webp'}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                )}
              </div>
            </Label>

            {/* Thick wave arcs and straight line design with animation on isLoading */}
            <div
              className={`flex-1 flex items-center h-[10rem] ml-3 text-cyan-800 dark:text-cyan-400 min-w-0 pr-1 transition-all duration-300 ${
                isLoading ? 'animate-pulse' : ''
              }`}
            >
              <svg
                viewBox="0 0 72 100"
                className={`h-[10rem] w-[7.2rem] shrink-0 transition-all duration-300 ${
                  isLoading
                    ? 'text-green-500 dark:text-green-400 scale-105'
                    : ''
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              >
                <path
                  d="M 6 15 Q 38 50 6 85"
                  className={isLoading ? 'animate-pulse' : ''}
                />
                <path
                  d="M 22 22 Q 54 50 22 78"
                  className={isLoading ? 'animate-pulse' : ''}
                />
                <path
                  d="M 38 29 Q 70 50 38 71"
                  className={isLoading ? 'animate-pulse' : ''}
                />
                <path
                  d="M 54 36 Q 86 50 54 64"
                  className={isLoading ? 'animate-pulse' : ''}
                />
              </svg>

              <div className="flex-1 h-[4px] relative overflow-hidden bg-cyan-800 dark:bg-cyan-400 rounded-full -ml-[2px]">
                {isLoading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-shimmer bg-[length:200%_100%]" />
                )}
              </div>

              <div
                className={`w-[4px] h-[6rem] bg-cyan-800 dark:bg-cyan-400 rounded-full shrink-0 transition-all duration-300 ${
                  isLoading
                    ? 'bg-green-500 dark:bg-green-400 shadow-[0_0_12px_rgba(34,197,94,0.8)] scale-y-110'
                    : ''
                }`}
              />
            </div>
          </div>
          {!watch('profilePicture') && (
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
