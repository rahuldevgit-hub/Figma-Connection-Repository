'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { AdminLogin } from '@/services/adminService';
import { setToken } from '@/lib/auth';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { SwalConfirm, SwalSuccess, SwalError } from "@/components/ui/SwalAlert";
// Zod Schema
const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof schema>;

const LoginScreen = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const response = await AdminLogin(data as { email: string; password: string });

      if (response.status === true) {
        setToken('admin_token', response.access_token);
        SwalSuccess('Login successful!');
        router.push('/admin/dashboard');
      } else {
        SwalError({ title: "Failed!", message: "Check credentials." });
      }
    } catch (error: any) {
      SwalError({ title: "Failed!", message: "Login failed! Try again." });

    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Form Section */}
          <div className="lg:w-1/2 p-8 lg:p-12">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Login</h1>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Email */}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    {...register('email')}
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="text-black"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      {...register('password')}
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="text-black"
                    />
                    <Button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                  )}
                </div>

                {/* Submit */}
                <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-700  rounded-[5px] w-full "
                  disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </div>
          </div>

          {/* Logo / Image Section */}
          <div className="lg:w-1/2 bg-gradient-to-br from-[#fb923c] to-[#0d9488] p-8 lg:p-12 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-62 h-62 mx-auto mb-6 bg-opacity-20 rounded-full flex items-center justify-center">
                <Image
                  src="/assest/image/logo_white.png"
                  alt="eboxtenders"
                  width={280}
                  height={280}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;