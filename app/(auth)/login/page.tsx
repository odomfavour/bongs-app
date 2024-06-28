'use client';
import Image from 'next/image';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { setUser } from '@/provider/redux/userSlice';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.BASEURL}/login`,
        formData
      );
      console.log('Login successful:', response.data?.data?.user);
      console.log('resp', response);
      let currentUser = {
        ...response?.data?.data?.user,
        token: response?.data?.data?.token,
      };
      console.log('first', currentUser);
      dispatch(setUser(currentUser));
      if (typeof window !== 'undefined') {
        localStorage.setItem('bongsUser', JSON.stringify(currentUser));
      }
      toast.success(`${response?.data?.message}`);
      setIsLoading(false);
      router.push('/preferences');
      // Handle success (e.g., redirect to another page)
    } catch (error: any) {
      console.error('Error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      toast.error(`${errorMessage}`);
      // Handle error (e.g., show an error message)
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.email !== '' && formData.password !== '';

  return (
    <div>
      <div className="mb-3">
        <Image src="/bongs.svg" alt="the product logo" width="48" height="48" />
      </div>
      <p className="font-semibold text-2xl text-black mb-4">Login</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-semibold text-black"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-semibold text-black"
          >
            Enter Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
              required
            />
            <div
              className="absolute flex bottom-0 top-0 justify-center items-center right-3 text-primary cursor-pointer"
              onClick={() =>
                setShowPassword((prevShowPassword) => !prevShowPassword)
              }
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>
        </div>
        <div>
          <button
            type="submit"
            className={`py-2 px-5 rounded-md ${
              !isFormValid || isLoading
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-[#00365a] text-white'
            }`}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
