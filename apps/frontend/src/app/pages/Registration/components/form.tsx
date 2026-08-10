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
import { EyeClosedIcon, EyeIcon } from 'lucide-react';
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
    setValue,
    formState: { errors },
  } = form;

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

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
      setIsUploading(true);

      const imageUrl = await uploadToCloudinary(file);
      setValue('profilePicture', imageUrl);
    } catch (err) {
      throw new Error(String(err));
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
        description: 'Registration Success',
        variant: 'success',
      });
    }
  }, [isSuccess, data]);

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
                className={`h-[5.5rem] w-full rounded-[.8rem] text-[1.8rem] ${errors?.firstName ? 'border-2 border-red-600' : 'border-2 border-cyan-800'}`}
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
                className={`h-[5.5rem] w-full rounded-[.8rem] text-[1.8rem] ${errors?.lastName ? 'border-2 border-red-600' : 'border-2 border-cyan-800'}`}
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
                placeholder="Enter your First Name"
                className={`h-[5.5rem] w-full rounded-[.8rem] text-[1.8rem] ${errors?.email ? 'border-2 border-red-600' : 'border-2 border-cyan-800'}`}
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
                  className={`h-[5.5rem] w-full rounded-[.8rem] text-[1.8rem] ${errors?.password ? 'border-2 border-red-600' : 'border-2 border-cyan-800'}`}
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
                  className={`h-[5.5rem] w-full rounded-[.8rem] text-[1.8rem] ${errors?.confirmPassword ? 'border-2 border-red-600' : 'border-2 border-cyan-800'}`}
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
            <div className="px-2 col-span-12 md:col-span-9">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                rows={4}
                {...register('bio', {
                  required: 'Bio is Required !',
                })}
                placeholder="Enter your Bio"
                className={`w-full rounded-[.8rem] text-[1.8rem] ${errors?.firstName ? 'border-2 border-red-600' : 'border-2 border-cyan-800'}`}
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
