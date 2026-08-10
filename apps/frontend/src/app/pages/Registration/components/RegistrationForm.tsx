import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import Label from '@/app/components/ui/label';
import { useGlobalSlice } from '@/app/slice';
import { Icons } from '@/app/components/ui/icons';
import { useDispatch } from 'react-redux';
import { toast } from '@/app/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  RegistrationFormValues,
  RegistrationResponse,
} from '@/types/registration';
import ImageUpload from './ImageUpload';

export function RegistrationForm() {
  const form = useForm<RegistrationFormValues>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // show/hide password
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { useRegistrationMutation, actions } = useGlobalSlice();
  const [registerUser, { isLoading, isSuccess, isError, error, data }] =
    useRegistrationMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (isSuccess) {
      dispatch(actions.setUser(data?.data?.data?.user));
      navigate('/todo', { replace: true });
      toast({
        description: data?.data?.message,
        variant: 'success',
      });
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError || error) {
      toast({
        description: (error as string) || 'Something went wrong',
        variant: 'destructive',
      });
    }
  }, [isError, error]);

  return (
    <React.Fragment>
      <div className="bg-white/50 backdrop-blue-xl w-[50%] md:w-2/4 h-2/4 rounded-[0.8rem] border border-blue-600/70 p-15">
        <div className="px-4 py-2 md-4">
          <h4 className="text-xl font-bold bg-gradient-to-r from-blue-700 via-pink-600 to-yellow-400 bg-clip-text text-transparent">
            Register
          </h4>
          <p className="text-md font-medium">
            Don't have an account ? Please Register
          </p>
        </div>

        <form onSubmit={handleSubmit(data => registerUser(data))}>
          <div className="px-4 py-2 mb-4">
            <Label htmlFor="emailOrPhone">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your Name"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <span>{errors.name.message}</span>}
          </div>

          <div className="px-4 py-2 mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="text"
              placeholder="Enter your Email"
              {...register('email', { required: 'Email   is required' })}
            />
            {errors.email && <span>{errors.email.message}</span>}
          </div>

          <div className="px-4 py-2 mb-4">
            <Label htmlFor="email">Password</Label>
            <Input
              id="password"
              type="text"
              placeholder="Enter your Password"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <span>{errors.password.message}</span>}
          </div>

          <div className="px-4 py-2 mb-4">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="text"
              placeholder="Enter your Phone"
              {...register('phone', { required: 'Phone is required' })}
            />
            {errors.phone && <span>{errors.phone.message}</span>}
          </div>

          <div className="px-4 py-2 mb-4">
            <Label htmlFor="phone">Profile Picture</Label>
            <Input
              id="profilePicture"
              type="text"
              placeholder="Upload your Profile Picture"
              {...register('phone', { required: 'Phone is Profile Picture' })}
            />
            <ImageUpload />
            {/* {errors.phone && <span>{errors.pic.profilePicture}</span>}   */}
          </div>

          <div className="px-4 py-2 mb-4">
            <Label htmlFor="phone">Bio</Label>
            <Input
              id="bio"
              type="text"
              placeholder="Enter your Bio"
              {...register('phone', { required: 'Bio is required' })}
            />
            {errors.phone && <span>{errors.phone.message}</span>}
          </div>

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
}
