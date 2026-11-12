import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { selectTheme, selectUser } from '@/app/slice/selectors';
import { useGlobalSlice } from '@/app/slice';
import { useProfileSlice } from '../slice';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import Label from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import ErrorMessage from '@/app/components/ui/error-message';
import { toast } from '@/app/components/ui/use-toast';
import { Icons } from '@/app/components/ui/icons';
import { uploadToCloudinary } from '@/utils/upload-to-cloudinary';
import {
  Camera,
  Link as LinkIcon,
  Mail,
  Upload,
  User as UserIcon,
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { ProfileTabSkeleton } from './profile-skeleton';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { normalizePhoneForInput } from '@/app/pages/Users/components/user-dialog';

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  bio: string;
  profilePicture: string;
}

interface ProfileTabProps {
  isLoading?: boolean;
}

export function ProfileTab({ isLoading = false }: ProfileTabProps = {}) {
  const dispatch = useDispatch();
  const themeState = useSelector(selectTheme);
  const loggedInUser = useSelector(selectUser);
  const { actions: globalActions } = useGlobalSlice();
  const { useGetUserWithIdQuery, useUpdateUserMutation } = useProfileSlice();

  const [isUploading, setIsUploading] = useState(false);
  const [avatarTab, setAvatarTab] = useState<'upload' | 'url'>('upload');

  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: fetchError,
  } = useGetUserWithIdQuery(loggedInUser?._id || '', {
    skip: !loggedInUser?._id,
  });

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const user =
    (profileData as any)?.data?.data?.user ||
    (profileData as any)?.data?.user ||
    loggedInUser;

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      bio: '',
      profilePicture: '',
    },
  });

  const profilePictureWatch = watch('profilePicture');

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        phone: normalizePhoneForInput(user.phone),
        bio: user.bio || '',
        profilePicture: user.profilePicture || '',
      });
      setAvatarTab(user.profilePicture ? 'url' : 'upload');
    }
  }, [user, reset]);

  useEffect(() => {
    if (fetchError) {
      toast({
        description: String(fetchError),
        variant: 'destructive',
      });
    }
  }, [fetchError]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        description: 'File size cannot exceed 5MB',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUploading(true);
      const imageUrl = await uploadToCloudinary(file);
      setValue('profilePicture', imageUrl, { shouldDirty: true });

      if (loggedInUser?._id) {
        const currentValues = getValues();
        const body: ProfileFormData = {
          name: currentValues.name || user?.name || '',
          email: currentValues.email || user?.email || '',
          phone: currentValues.phone || user?.phone || '',
          bio: currentValues.bio || user?.bio || '',
          profilePicture: imageUrl,
        };

        const response = await updateUser({
          userId: loggedInUser._id,
          body,
        }).unwrap();

        const updatedUser =
          (response as any)?.data?.data?.user ||
          (response as any)?.data?.user ||
          (response as any)?.user;

        if (updatedUser) {
          dispatch(globalActions.setUser(updatedUser));
          reset({
            name: updatedUser.name || '',
            email: updatedUser.email || '',
            phone: normalizePhoneForInput(updatedUser.phone),
            bio: updatedUser.bio || '',
            profilePicture: updatedUser.profilePicture || '',
          });
        }

        const successMsg =
          (response as any)?.data?.message ||
          (response as any)?.message ||
          'Profile picture updated successfully 🤩';

        toast({
          description: successMsg,
          variant: 'success',
        });
      } else {
        toast({
          description: 'Profile picture uploaded successfully',
          variant: 'success',
        });
      }
    } catch (err: any) {
      toast({
        description: err?.message || 'Failed to update profile picture',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (formData: ProfileFormData) => {
    if (!loggedInUser?._id) return;

    try {
      const response = await updateUser({
        userId: loggedInUser._id,
        body: formData,
      }).unwrap();

      const updatedUser =
        (response as any)?.data?.data?.user ||
        (response as any)?.data?.user ||
        (response as any)?.user;

      if (updatedUser) {
        dispatch(globalActions.setUser(updatedUser));
        reset({
          name: updatedUser.name || '',
          email: updatedUser.email || '',
          phone: normalizePhoneForInput(updatedUser.phone),
          bio: updatedUser.bio || '',
          profilePicture: updatedUser.profilePicture || '',
        });
      }

      const successMsg =
        (response as any)?.data?.message ||
        (response as any)?.message ||
        'Profile updated successfully 🤩';

      toast({
        description: successMsg,
        variant: 'success',
      });
    } catch (err: any) {
      toast({
        description: String(err),
        variant: 'destructive',
      });
    }
  };

  if (isProfileLoading || isLoading) {
    return <ProfileTabSkeleton />;
  }

  const isDark = themeState === 'dark';

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`rounded-2xl p-6 md:p-8 max-w-[95%] mx-auto shadow-md border border-green-700 ${
        isDark ? 'bg-black text-white' : 'bg-white text-gray-900'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-gray-700/30">
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-green-600/40 shadow-inner bg-gray-200 dark:bg-gray-800 shrink-0 relative flex items-center justify-center">
          {profilePictureWatch ? (
            <img
              src={profilePictureWatch}
              alt={user?.name || 'Avatar'}
              className="w-full h-full object-cover"
              onError={e => {
                (e.target as HTMLImageElement).src = '/images/avatar.webp';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <UserIcon size={48} />
            </div>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Icons.Spinner className="animate-spin h-7 w-7 text-green-500" />
            </div>
          )}
        </div>

        <div className="flex-1 w-full min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-2xl font-bold">{user?.name || 'User'}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>
            </div>
            {user?.isAdmin && (
              <span className="self-start sm:self-auto px-3 py-1 bg-green-600/20 text-green-500 border border-green-600/30 rounded-full text-xs font-semibold">
                Admin
              </span>
            )}
          </div>

          {/* Profile Picture Tabs: Upload vs URL */}
          <div className="max-w-md">
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
                  className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isDark
                      ? 'text-gray-300 hover:text-white data-[state=active]:bg-green-600 data-[state=active]:text-white'
                      : 'text-gray-600 hover:text-black data-[state=active]:bg-green-600 data-[state=active]:text-white'
                  }`}
                >
                  <Upload size={14} />
                  <span>Upload Photo</span>
                </TabsTrigger>

                <TabsTrigger
                  value="url"
                  type="button"
                  className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isDark
                      ? 'text-gray-300 hover:text-white data-[state=active]:bg-green-600 data-[state=active]:text-white'
                      : 'text-gray-600 hover:text-black data-[state=active]:bg-green-600 data-[state=active]:text-white'
                  }`}
                >
                  <LinkIcon size={14} />
                  <span>Photo URL</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="mt-1 outline-none">
                <label
                  htmlFor="profile-picture-upload"
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-[.8rem] text-xs font-medium border border-dashed cursor-pointer transition-colors ${
                    isDark
                      ? 'border-gray-700 hover:border-green-500 bg-neutral-900/60 text-gray-200'
                      : 'border-gray-300 hover:border-green-600 bg-white text-gray-800'
                  }`}
                >
                  <Upload size={14} />
                  <span>
                    {isUploading ? 'Uploading...' : 'Choose photo (Max 5MB)'}
                  </span>
                  <input
                    id="profile-picture-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploading}
                    onChange={handleImageUpload}
                  />
                </label>
              </TabsContent>

              <TabsContent value="url" className="mt-1 outline-none">
                <Input
                  id="profile-picture-url"
                  type="url"
                  placeholder="Paste photo URL (https://...)"
                  value={watch('profilePicture') || ''}
                  onChange={e => {
                    setValue('profilePicture', e.target.value, {
                      shouldDirty: true,
                    });
                  }}
                  className={`h-[3.6rem] rounded-[.8rem] text-xs focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all duration-200 ${
                    isDark
                      ? 'bg-black text-white border-green-600/70'
                      : 'bg-white text-black'
                  }`}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <div className="mb-2">
            <Label htmlFor="name" dark={isDark}>
              Full Name
            </Label>
          </div>
          <div className="relative flex items-center">
            <UserIcon
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <Input
              id="name"
              {...register('name', { required: 'Name is required' })}
              placeholder="Enter full name"
              className={`h-[5rem] focus:h-[5.5rem] pl-14 text-base focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all duration-200 ${
                isDark
                  ? 'bg-black border-gray-700'
                  : 'bg-gray-50 border-gray-300'
              }`}
            />
          </div>
          <ErrorMessage error={errors.name} />
        </div>

        <div>
          <div className="mb-2">
            <Label htmlFor="email" dark={isDark}>
              Email Address
            </Label>
          </div>
          <div className="relative flex items-center">
            <Mail
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <Input
              id="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Please enter a valid email',
                },
              })}
              placeholder="Enter email address"
              className={`h-[5rem] focus:h-[5.5rem] pl-14 text-base focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all duration-200 ${
                isDark
                  ? 'bg-black border-gray-700'
                  : 'bg-gray-50 border-gray-300'
              }`}
            />
          </div>
          <ErrorMessage error={errors.email} />
        </div>

        <div>
          <div className="mb-2">
            <Label htmlFor="phone" dark={isDark}>
              Phone Number
            </Label>
          </div>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInput
                country="in"
                enableSearch
                containerClass={isDark ? 'w-full dark-phone-input' : 'w-full'}
                value={normalizePhoneForInput(field.value)}
                onChange={val => field.onChange(val ? `+${val}` : '')}
                onBlur={field.onBlur}
              />
            )}
          />
        </div>

        <input type="hidden" {...register('profilePicture')} />

        <div className="md:col-span-2">
          <div className="mb-2">
            <Label htmlFor="bio" dark={isDark}>
              Bio
            </Label>
          </div>
          <Textarea
            id="bio"
            {...register('bio')}
            rows={4}
            placeholder="Tell us a little about yourself..."
            className={`resize-none ${
              isDark ? 'bg-black border-gray-700' : 'bg-gray-50 border-gray-300'
            }`}
          />
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <Button
          type="submit"
          disabled={isUpdating || isUploading}
          className="h-[5.5rem] px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl flex items-center gap-2"
        >
          {isUpdating && <Icons.Spinner className="h-4 w-4 animate-spin" />}
          <span>{isUpdating ? 'Saving...' : 'Save Profile'}</span>
        </Button>
      </div>
    </form>
  );
}
