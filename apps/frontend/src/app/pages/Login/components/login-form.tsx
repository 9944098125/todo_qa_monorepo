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
import { LoginFormValues } from '@/types/login';
import { Check, EyeClosedIcon, EyeIcon } from 'lucide-react';

const SAVED_CREDENTIALS_KEY = 'tq_saved_credentials';

export function LoginForm() {
  const savedCreds = (() => {
    try {
      const item = localStorage.getItem(SAVED_CREDENTIALS_KEY);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  })();

  const form = useForm<LoginFormValues>({
    defaultValues: {
      emailOrPhone: savedCreds?.emailOrPhone || '',
      password: savedCreds?.password || '',
      saveCredentials: Boolean(savedCreds),
    },
  });
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
    watch,
    formState: { errors },
  } = form;

  const isSaveCredsChecked = watch('saveCredentials');

  const authenticate = (formData: LoginFormValues) => {
    if (formData.saveCredentials) {
      localStorage.setItem(
        SAVED_CREDENTIALS_KEY,
        JSON.stringify({
          emailOrPhone: formData.emailOrPhone,
          password: formData.password,
        }),
      );
    } else {
      localStorage.removeItem(SAVED_CREDENTIALS_KEY);
    }

    login({
      emailOrPhone: formData.emailOrPhone,
      password: formData.password,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(actions.setUser(data?.data?.data?.user));
      dispatch(actions.setExpiry(data?.data?.data?.expiryTime));
      if (data?.data?.data?.token) {
        localStorage.setItem('tq_monorepo_token', data?.data?.data?.token);
      }
      if (data?.data?.data?.user?.isAdmin) {
        navigate('/users', { replace: true });
      } else {
        navigate('/todo', { replace: true });
      }
      toast({
        description: data?.data?.message || 'Login Success',
        variant: 'success',
      });
    }
  }, [isSuccess, data, actions, dispatch, navigate]);

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
              className="h-[5rem] focus:h-[5.5rem] w-full rounded-[.8rem] text-[1.8rem] focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all duration-200"
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
                className="h-[5rem] focus:h-[5.5rem] w-full rounded-[.8rem] text-[1.8rem] focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all duration-200"
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
          {/* Save credentials interactive card */}
          <div className="px-4 mb-5">
            <label
              htmlFor="saveCredentials"
              className={`group flex items-center justify-between p-3.5 px-4 rounded-[.8rem] border transition-all duration-200 cursor-pointer select-none active:scale-[0.99] ${
                isSaveCredsChecked
                  ? 'bg-green-50/80 border-green-600/70 shadow-sm'
                  : 'bg-white/60 hover:bg-white border-gray-200 hover:border-gray-300 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-7 h-7 rounded-[0.5rem] flex items-center justify-center border-2 transition-all duration-200 ${
                    isSaveCredsChecked
                      ? 'bg-green-600 border-green-600 text-white shadow-sm scale-100'
                      : 'border-gray-300 group-hover:border-green-600 bg-white'
                  }`}
                >
                  {isSaveCredsChecked && (
                    <Check className="w-4 h-4 stroke-[3] text-white" />
                  )}
                </div>
                <div className="flex flex-col text-left">
                  <span
                    className={`text-[1.4rem] font-semibold transition-colors duration-150 ${
                      isSaveCredsChecked ? 'text-green-800' : 'text-gray-800'
                    }`}
                  >
                    Save credentials
                  </span>
                  <span className="text-[1.1rem] text-gray-500 font-normal">
                    Remember me on this browser
                  </span>
                </div>
              </div>

              <input
                type="checkbox"
                id="saveCredentials"
                {...register('saveCredentials')}
                className="sr-only"
              />
            </label>
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
