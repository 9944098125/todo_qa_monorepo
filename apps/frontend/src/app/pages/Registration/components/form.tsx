import { Button } from '@/app/components/ui/button';
import { Icons } from '@/app/components/ui/icons';
import { Input } from '@/app/components/ui/input';
import Label from '@/app/components/ui/label';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useForm, Controller } from 'react-hook-form';
import { RegistrationRequest } from '../slice/types';
import { EyeClosedIcon, EyeIcon, Link as LinkIcon, Upload } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { Textarea } from '@/app/components/ui/textarea';
import { Registration } from '@/types/register';
import { uploadToCloudinary } from '@/utils/upload-to-cloudinary';
import { useRegistrationSlice } from '../slice';
import { toast } from '@/app/components/ui/use-toast';

export const RegistrationForm = () => {
  const navigate = useNavigate();
  const { useRegisterMutation } = useRegistrationSlice();
  const [registerMutation, { isLoading, isSuccess, data, isError, error }] =
    useRegisterMutation();
  const form = useForm<Registration>({
    defaultValues: {
      profilePicture: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      bio: '',
    },
  });

  const {
    handleSubmit,
    getValues,
    control,
    register,
    watch,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = form;

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [avatarTab, setAvatarTab] = useState<'upload' | 'url'>('upload');

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(prev => !prev);
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

  const submitForm = (data: Partial<Registration>) => {
    const body = {
      name: data.firstName + ' ' + data.lastName,
      ...data,
    };

    registerMutation(body as RegistrationRequest);
  };

  useEffect(() => {
    if (isSuccess && data) {
      navigate('/');
      toast({
        description: data?.data?.message || 'Registration Success',
        variant: 'success',
      });
    }
  }, [isSuccess, data, navigate]);

  useEffect(() => {
    if (isError || error) {
      toast({
        description: String(error),
        variant: 'destructive',
      });
    }
  }, [isError, error]);

  return (
    <React.Fragment>
      <div className="bg-white/50 backdrop-blue-xl w-[90%] md:w-2/4 h-2/4 rounded-[0.8rem] border border-blue-600/70 p-5">
        <div className="px-4 py-2 md-4">
          <h4 className="text-xl font-bold bg-gradient-to-r from-blue-700 via-pink-600 to-yellow-400 bg-clip-text text-transparent">
            Registration
          </h4>
          <p className="text-md font-medium">
            Already have an account ? Please{' '}
            <Link
              style={{
                textDecoration: 'underline',
                fontWeight: 'bold',
                color: 'blueviolet',
              }}
              to="/login"
            >
              Login
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(submitForm)}>
          {/* First Name & Last Name */}
          <div className="px-4 py-2 mb-4 flex flex-col md:flex-row w-full">
            <div className="w-1/2 px-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                {...register('firstName', {
                  required: 'First Name is Required !',
                })}
                type="text"
                placeholder="Enter your First Name"
                className={`h-[5rem] focus:h-[5.5rem] w-full rounded-[.8rem] text-[1.8rem] focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all duration-200 ${errors?.firstName ? 'border-2 border-red-600' : 'border-2 border-cyan-800'}`}
              />
              {errors.firstName && (
                <div className="text-red-600 text-[1rem] mt-1">
                  {String(errors?.firstName?.message)}
                </div>
              )}
            </div>
            <div className="w-1/2 px-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                type="text"
                {...register('lastName', {
                  required: 'Last Name is Required !',
                })}
                placeholder="Enter your LastName Name"
                className={`h-[5rem] focus:h-[5.5rem] w-full rounded-[.8rem] text-[1.8rem] focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all duration-200 ${errors?.lastName ? 'border-2 border-red-600' : 'border-2 border-cyan-800'}`}
              />
              {errors.lastName && (
                <div className="text-red-600 text-[1rem] mt-1">
                  {String(errors?.lastName?.message)}
                </div>
              )}
            </div>
          </div>

          {/* Email & Phone Number */}
          <div className="px-4 py-2 mb-4 flex flex-col md:flex-row w-full">
            <div className="w-1/2 px-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                {...register('email', {
                  required: 'Email is Required !',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email address',
                  },
                })}
                placeholder="Enter your Email"
                className={`h-[5rem] focus:h-[5.5rem] w-full rounded-[.8rem] text-[1.8rem] focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all duration-200 ${errors?.email ? 'border-2 border-red-600' : 'border-2 border-cyan-800'}`}
              />
              {errors.email && (
                <div className="text-red-600 text-[1rem] mt-1">
                  {String(errors?.email?.message)}
                </div>
              )}
            </div>
            <div className="w-1/2 px-2">
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
          </div>

          {/* Password & Confirm Password  */}
          <div className="px-4 py-2 mb-4 flex flex-col md:flex-row w-full">
            <div className="w-1/2 px-2">
              <Label htmlFor="password">Password</Label>
              <div className="flex items-center">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your Password"
                  className={`h-[5rem] focus:h-[5.5rem] w-full rounded-[.8rem] text-[1.8rem] focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all duration-200 ${errors?.password ? 'border-2 border-red-600' : 'border-2 border-cyan-800'}`}
                  {...register('password', {
                    required: 'Password is required',
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()[\]{}\-_=+|;:'",.<>/~`\\])[A-Za-z\d@$!%*?&^#()[\]{}\-_=+|;:'",.<>/~`\\]{8,}$/,
                      message:
                        'Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character.',
                    },
                  })}
                />
                {showPassword ? (
                  <div onClick={toggleShowPassword} className="pointer">
                    <EyeIcon className="text-blue-800 font-800 text-xl -ml-[4rem]" />
                  </div>
                ) : (
                  <div onClick={toggleShowPassword} className="pointer">
                    <EyeClosedIcon className="text-blue-800 font-800 text-xl -ml-[4rem]" />
                  </div>
                )}
              </div>

              {errors.password && (
                <div className="text-red-600 text-[1rem] mt-1">
                  {String(errors?.password?.message)}
                </div>
              )}
            </div>

            <div className="w-1/2 px-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="flex items-center">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Enter your Password"
                  className={`h-[5rem] focus:h-[5.5rem] w-full rounded-[.8rem] text-[1.8rem] focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all duration-200 ${errors?.confirmPassword ? 'border-2 border-red-600' : 'border-2 border-cyan-800'}`}
                  {...register('confirmPassword', {
                    required: 'Password is required',
                    validate: value =>
                      value === getValues('password') ||
                      'Passwords do not match !',
                  })}
                />
                {showConfirmPassword ? (
                  <div onClick={toggleShowConfirmPassword} className="pointer">
                    <EyeIcon className="text-blue-800 font-800 text-xl -ml-[4rem]" />
                  </div>
                ) : (
                  <div onClick={toggleShowConfirmPassword} className="pointer">
                    <EyeClosedIcon className="text-blue-800 font-800 text-xl -ml-[4rem]" />
                  </div>
                )}
              </div>

              {errors.confirmPassword && (
                <div className="text-red-600 text-[1rem] mt-1">
                  {String(errors?.confirmPassword?.message)}
                </div>
              )}
            </div>
          </div>

          {/* Profile Picture & Bio */}
          <div className="px-4 py-2 mb-4 grid grid-cols-12 gap-4">
            <div className="px-2 col-span-12 md:col-span-5">
              <h4 className="text-[2.2rem] font-bold text-cyan-800 mb-2">
                Profile Picture
              </h4>
              <div className="flex items-center gap-3">
                <div
                  className={`h-[9rem] w-[9rem] rounded-full overflow-hidden shrink-0 border-2 ${errors.profilePicture ? 'border-red-600' : 'border-cyan-800'} relative flex items-center justify-center bg-gray-100`}
                >
                  <img
                    src={watch('profilePicture') || '/images/avatar.webp'}
                    alt="Preview"
                    className="w-full h-full rounded-full object-cover"
                    onError={e => {
                      (e.target as HTMLImageElement).src =
                        '/images/avatar.webp';
                    }}
                  />
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Icons.Spinner className="h-6 w-6 animate-spin text-cyan-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Tabs
                    value={avatarTab}
                    onValueChange={val => setAvatarTab(val as 'upload' | 'url')}
                    className="w-full"
                  >
                    <TabsList className="p-1 rounded-xl border bg-gray-100 border-gray-200 flex gap-1 mb-2">
                      <TabsTrigger
                        value="upload"
                        type="button"
                        className="flex-1 px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer data-[state=active]:bg-cyan-700 data-[state=active]:text-white text-gray-700"
                      >
                        <Upload size={12} />
                        <span>Upload</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="url"
                        type="button"
                        className="flex-1 px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer data-[state=active]:bg-cyan-700 data-[state=active]:text-white text-gray-700"
                      >
                        <LinkIcon size={12} />
                        <span>URL</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="mt-1 outline-none">
                      <label
                        htmlFor="imageUpload"
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-[.8rem] text-xs font-medium border border-dashed border-gray-300 hover:border-cyan-600 bg-white text-gray-800 cursor-pointer"
                      >
                        <Upload size={12} />
                        <span>
                          {isUploading ? 'Uploading...' : 'Choose file'}
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
                        id="regProfilePicUrl"
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
                        className="h-[3.6rem] rounded-[.8rem] text-xs focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
              {!watch('profilePicture') && !errors?.profilePicture && (
                <div className="text-red-600 text-[1rem] mt-1">
                  Profile Picture is Required !
                </div>
              )}
              {errors?.profilePicture && (
                <div className="text-red-600 text-[1rem] mt-1">
                  {errors.profilePicture?.message as string}
                </div>
              )}
            </div>
            <div className="px-2 col-span-12 md:col-span-7">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                rows={4}
                {...register('bio', {
                  required: 'Bio is Required !',
                })}
                placeholder="Enter your Bio"
                className={`w-full rounded-[.8rem] text-[1.8rem] ${errors?.bio ? 'border-2 border-red-600' : 'border-2 border-cyan-800'}`}
              />
              {errors.bio && (
                <div className="text-red-600 text-[1rem] mt-1">
                  {String(errors?.bio?.message)}
                </div>
              )}
            </div>
          </div>

          {/* Button  */}
          <div className="px-4 py-2 mb-4">
            <Button
              disabled={isUploading || isLoading}
              type="submit"
              variant="primary"
              className="w-full h-[5.5rem] rounded-[.8rem] text-[1.8rem] text-white"
            >
              {isLoading ? 'Registering...' : 'Register'}
              {isLoading && <Icons.Spinner className="animate-spin h-8 w-8" />}
            </Button>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
};
