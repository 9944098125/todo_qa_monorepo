import { Button } from '@/app/components/ui/button';
import { EditIcon, TrashIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAdminSlice } from '../slice';
import { useDispatch } from 'react-redux';
import { toast } from '@/app/components/ui/use-toast';
import { ConfirmationDialog } from '@/app/components/Parts/confirmation-dialog';
import { Icons } from '@/app/components/ui/icons';
import { User } from '@/app/slice/types';
import { useSelector } from 'react-redux';
import { selectTheme, selectUser } from '../../../slice/selectors';
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '@/app/components/ui/dialog';
import { UserDialog } from './user-dialog';
import { Heading } from '@/app/components/Parts/heading';
import './../../../../styles/common.css';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '@/app/components/ui/input';
import Label from '@/app/components/ui/label';
import { uploadToCloudinary } from '@/utils/upload-to-cloudinary';

type Props = {
  users: User[];
  user: User;
  open: boolean;
  setOpen: (value: boolean) => void;
};

export const UserItem = (props: Props) => {
  const { user, open, setOpen } = props;
  const { actions } = useAdminSlice();
  const dispatch = useDispatch();
  const admin = useSelector(selectUser);

  const { useDeleteUserMutation } = useAdminSlice();
  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
  const [deleteUser, { isLoading, isSuccess, data, isError, error }] =
    useDeleteUserMutation();
  const themeState = useSelector(selectTheme);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    if (isSuccess && data) {
      toast({
        description: data?.data?.message,
        variant: 'success',
      });
    } else if (isError || error) {
      toast({
        description: String(error),
        variant: 'destructive',
      });
    }
  }, [isSuccess, isError, error, data]);

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

  return (
    <React.Fragment>
      <div
        style={{
          backgroundColor:
            themeState === 'dark'
              ? 'bg-orange-100 text-white'
              : 'bg-white text-black',
        }}
        // className={`col-span-12 lg:col-span-6 xl:col-span-4 relative p-2 flex flex-row lg:flex-col items-center lg:items-stretch justify-between lg:justify-start rounded-[.8rem] shadow-lg border border-gray-200 rounded-lg p-2 style=new-border`}
        className="user-card"
      >
        <div className="absolute bg-white rounded-[.8rem] p-4 top-1 right-1 md:top-2 md:right-2 flex items-center gap-4">
          <Button
            onClick={() => {
              setOpen(true);
              dispatch(actions.editUser(user));
            }}
            variant="blueBtn"
            className="p-4 rounded-[.8rem]"
          >
            <EditIcon className="text-white h-10 w-10" />
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
              onInteractOutside={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className={`w-[90%] md:w-1/2 max-w-none border border-green-600/70 ${themeState === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}
            >
              <DialogHeader>
                <Heading text="Edit User" size="2.6rem" weight="600" />
              </DialogHeader>
              <UserDialog closeDialog={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
          <Button
            onClick={() => {
              setOpenConfirmation(true);
            }}
            variant="destructive"
            className="p-4 rounded-[.8rem]"
          >
            {isLoading ? (
              <Icons.Spinner className="text-white h-10 w-10 animate-spin" />
            ) : (
              <TrashIcon className="text-white h-10 w-10" />
            )}
          </Button>
          {openConfirmation && (
            <ConfirmationDialog
              module="User"
              operation="delete"
              buttons={{ cancel: 'No', confirm: 'Yes' }}
              confirm={() =>
                deleteUser({ userId: user?._id, adminId: admin?._id }) as any
              }
              open={openConfirmation}
              setOpen={setOpenConfirmation}
            />
          )}
        </div>

        {/* <div className="flex items-center gap-4 p-4">
          <div className="bg-white p-2 rounded-full style=new-border">
            <img
              src={
                user?.profilePicture?.trim()
                  ? user.profilePicture
                  : user?.isAdmin
                    ? '/images/admin.jpeg'
                    : '/images/user.jpeg'
              }
              alt={`${user?.name ?? 'User'} profile`}
              className="h-[3rem] w-[3rem] md:h-[5rem] md:w-[5rem] rounded-full object-cover"
              onError={e => {
                const img = e.currentTarget;
                img.onerror = null;
                img.src = user?.isAdmin
                  ? '/images/admin.jpeg'
                  : '/images/user.jpeg';
              }}
            />
          </div>
          <h4 className="text-[2rem] hidden md:block font-[600]">
            {user?.name}
          </h4>
        </div> */}

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

        <p className="text-[1.6rem] hidden lg:block font-[300]">
          {user?.name} - {user?.email}
        </p>
        <p className="text-[1.6rem] hidden lg:block font-[300]">{user?.bio}</p>
      </div>
    </React.Fragment>
  );
};
