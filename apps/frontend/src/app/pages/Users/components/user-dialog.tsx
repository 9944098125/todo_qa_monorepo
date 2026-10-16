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

export const UserDialog = ({
  createUser,
  updateUser,
  isCreateLoading,
  isUpdateLoading,
  closeDialog,
  isUpdateSuccess,
  updatedData,
}: Props) => {
  const { actions } = useUsersSlice();
  const [isUploading, setIsUploading] = useState<boolean>(false);

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
      phone: editableUser.phone || '',
      profilePicture: editableUser.profilePicture || '',
      bio: editableUser.bio || '',
      isAdmin: editableUser.isAdmin ? 'Yes' : 'No',
    });
  }, [editableUser, reset]);

  const submitUserForm = (formData: UserForm) => {
    const body = {
      ...formData,
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
            className={`h-[4.5rem] w-full rounded-[.8rem] text-[1.4rem] ${themeState === 'dark' ? 'bg-black text-white' : ''}`}
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
            className="w-full rounded-[.8rem] text-[1.4rem]"
          />

          <ErrorMessage error={errors.email} />
        </div>

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
                value={field.value}
                onChange={field.onChange}
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

        {/* profilePicture code for reference */}
        <div className="px-2 col-space-12 md:col-span-3">
          <h4 className="text-[2.6rem] font-bold text-cyan-800">
            Profile Pic...
          </h4>
          <Label htmlFor="imageUpload">
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
              className={`h-[10rem] w-[10rem] rounded-full cursor-pointer border-2 border-cyan-700 ${errors.profilePicture ? 'border-2 border-red-600' : 'border-2 border-cyan-800'}`}
            >
              <img
                src={watch('profilePicture') || '/images/avatar.webp'}
                alt=""
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </Label>
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
