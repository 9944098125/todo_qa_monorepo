import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { selectTheme, selectUser } from '@/app/slice/selectors';
import { useProfileSlice } from '../slice';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import Label from '@/app/components/ui/label';
import ErrorMessage from '@/app/components/ui/error-message';
import { toast } from '@/app/components/ui/use-toast';
import { Icons } from '@/app/components/ui/icons';
import { Eye, EyeOff, KeyRound, Lock } from 'lucide-react';
import { ChangePasswordSkeleton } from './profile-skeleton';

interface ChangePasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordTabProps {
  isLoading?: boolean;
}

export function ChangePasswordTab({
  isLoading = false,
}: ChangePasswordTabProps = {}) {
  const themeState = useSelector(selectTheme);
  const loggedInUser = useSelector(selectUser);
  const { useUpdatePasswordMutation, useGetUserWithIdQuery } =
    useProfileSlice();

  const { isLoading: isProfileLoading } = useGetUserWithIdQuery(
    loggedInUser?._id || '',
    {
      skip: !loggedInUser?._id,
    },
  );

  const [updatePassword, { isLoading: isUpdating }] =
    useUpdatePasswordMutation();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPasswordValue = watch('newPassword');

  const onSubmit = async (data: ChangePasswordFormData) => {
    if (!loggedInUser?._id) return;

    try {
      const response = await updatePassword({
        userId: loggedInUser._id,
        body: {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        },
      }).unwrap();

      const successMsg =
        (response as any)?.data?.message ||
        (response as any)?.message ||
        'Password updated successfully 🤩';

      toast({
        description: successMsg,
        variant: 'success',
      });
      reset();
    } catch (err: any) {
      toast({
        description: String(err),
        variant: 'destructive',
      });
    }
  };

  if (isLoading || isProfileLoading) {
    return <ChangePasswordSkeleton />;
  }

  const isDark = themeState === 'dark';

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`rounded-2xl p-6 md:p-8 max-w-[95%] mx-auto shadow-md border border-green-700 ${
        isDark ? 'bg-black text-white' : 'bg-white text-gray-900'
      }`}
    >
      <div className="flex items-center gap-3 pb-6 border-b border-gray-700/30 mb-6">
        <div className="p-3 rounded-full bg-green-600/20 text-green-500">
          <KeyRound size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold">Change Password</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ensure your account uses a strong, secure password.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <div className="mb-2">
            <Label htmlFor="oldPassword" dark={isDark}>
              Current Password
            </Label>
          </div>
          <div className="relative flex items-center">
            <Lock
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <Input
              id="oldPassword"
              type={showOldPassword ? 'text' : 'password'}
              {...register('oldPassword', {
                required: 'Current password is required',
              })}
              placeholder="Enter current password"
              className={`h-[5rem] focus:h-[5.5rem] pl-14 pr-14 text-base focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all duration-200 ${
                isDark
                  ? 'bg-black border-gray-700'
                  : 'bg-gray-50 border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 flex items-center justify-center p-1 rounded-md transition-colors"
              title={showOldPassword ? 'Hide password' : 'Show password'}
            >
              {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <ErrorMessage error={errors.oldPassword} />
        </div>

        <div>
          <div className="mb-2">
            <Label htmlFor="newPassword" dark={isDark}>
              New Password
            </Label>
          </div>
          <div className="relative flex items-center">
            <Lock
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <Input
              id="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              {...register('newPassword', {
                required: 'New password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              placeholder="Enter new password"
              className={`h-[5rem] focus:h-[5.5rem] pl-14 pr-14 text-base focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all duration-200 ${
                isDark
                  ? 'bg-black border-gray-700'
                  : 'bg-gray-50 border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 flex items-center justify-center p-1 rounded-md transition-colors"
              title={showNewPassword ? 'Hide password' : 'Show password'}
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <ErrorMessage error={errors.newPassword} />
        </div>

        <div>
          <div className="mb-2">
            <Label htmlFor="confirmPassword" dark={isDark}>
              Confirm New Password
            </Label>
          </div>
          <div className="relative flex items-center">
            <Lock
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword', {
                required: 'Please confirm your new password',
                validate: value =>
                  value === newPasswordValue || 'Passwords do not match',
              })}
              placeholder="Confirm new password"
              className={`h-[5rem] focus:h-[5.5rem] pl-14 pr-14 text-base focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all duration-200 ${
                isDark
                  ? 'bg-black border-gray-700'
                  : 'bg-gray-50 border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 flex items-center justify-center p-1 rounded-md transition-colors"
              title={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <ErrorMessage error={errors.confirmPassword} />
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <Button
          type="submit"
          disabled={isUpdating}
          className="h-[5.5rem] px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl flex items-center gap-2"
        >
          {isUpdating && <Icons.Spinner className="h-4 w-4 animate-spin" />}
          <span>{isUpdating ? 'Updating...' : 'Update Password'}</span>
        </Button>
      </div>
    </form>
  );
}
