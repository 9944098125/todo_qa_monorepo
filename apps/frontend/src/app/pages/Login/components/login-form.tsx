import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import Label from '@/app/components/ui/label';
import { useGlobalSlice } from '@/app/slice';
import { Icons } from '@/app/components/ui/icons';
import { useDispatch } from 'react-redux';
import { toast } from '@/app/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { LoginFormValues, LoginResponse } from '@/types/login';
import { EyeClosedIcon, EyeIcon } from 'lucide-react';

export function LoginForm() {
  const form = useForm<LoginFormValues>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // show/hide password
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { useLoginMutation, actions } = useGlobalSlice();
  const [login, { isLoading, isSuccess, isError, error, data }] =
    useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const authenticate = (data: LoginFormValues) => {
    login(data);
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(actions.setUser(data?.data?.data?.user));
      dispatch(actions.setToken(data?.data?.data?.token));
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

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <React.Fragment>
      <div className="bg-white/50 backdrop-blue-xl w-[90%] md:w-2/4 h-2/4 rounded-[0.8rem] border border-blue-600/70 p-5">
        <div className="px-4 py-2 md-4">
          <h4 className="text-xl font-bold bg-gradient-to-r from-blue-700 via-pink-600 to-yellow-400 bg-clip-text text-transparent">
            Login
          </h4>
          <p className="text-md font-medium">
            Don't have an account ? Please{' '}
            <Link
              style={{
                textDecoration: 'underline',
                fontWeight: 'bold',
                color: 'blueviolet',
              }}
              to="/register"
            >
              Register
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(authenticate)}>
          {/* Email/Phone */}
          <div className="px-4 py-2 :mb-4">
            <Label htmlFor="emailOrPhone">Email/Phone Number</Label>
            <Input
              type="text"
              {...register('emailOrPhone', {
                required: 'Email/Phone is Required',
                pattern: {
                  value:
                    /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$|^(\+?\d{1,3}?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9})$/,
                  message: 'Invalid email or phone number format',
                },
              })}
              placeholder="Enter your Email/Phone Number"
              className="h-[5.5rem] w-full rounded-[.8rem] text-[1.8rem]"
            />
            {errors.emailOrPhone && (
              <div className="text-red-600 text-[1rem] mt-1">
                {String(errors?.emailOrPhone?.message)}
              </div>
            )}
          </div>
          {/* Password  */}
          <div className="px-4 py-2 mb-4">
            <Label htmlFor="password">Password</Label>
            <div className="flex items-center">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your Password"
                className="h-[5.5rem] w-full rounded-[.8rem] text-[1.8rem]"
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
          {/* Button  */}
          <div className="px-4 py-2 mb-4">
            <Button
              type="submit"
              variant="primary"
              className="w-full h-[5.5rem] rounded-[.8rem] text-[1.8rem] text-white"
            >
              {isLoading ? 'Logging In...' : 'Login'}
              {isLoading && <Icons.Spinner className="animate-spin h-8 w-8" />}
            </Button>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
}
