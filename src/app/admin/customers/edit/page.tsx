'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Upload } from 'lucide-react';
import { updateCustomer, getCustomerById } from '@/services/customerService';
import Label from '@/components/ui/Label';
import Input from '@/components/ui/Input';
// Zod schema to validate customer form fields

const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  mobile: z.string().min(10, "Mobile must be 10 digits").max(10),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  dateOfBirth: z
    .string()
    .min(1, "Date of Birth is required")
    .refine((val) => {
      const dob = new Date(val);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      const dayDiff = today.getDate() - dob.getDate();

      const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

      return actualAge >= 18 && actualAge <= 75;
    }, {
      message: "Please enter a valid date of birth (between 18 and 75 years old)."
    }), gender: z.string().min(1, "Gender is required"),
  landmark: z.string().min(1, "Landmark is required"),
  address: z.string().min(1, "Address is required"),
  categories: z.array(z.string()).min(1, "Select at least one category"),
});
// Infer TypeScript type from schema

type FormData = z.infer<typeof customerSchema>;

const AddCustomerPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  // Initialize react-hook-form with Zod validation
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      categories: [],
    },
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  // Fetch customer data when editing (i.e., when id is present)
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const res = await getCustomerById(id); // Fetch customer by ID
        const data = res?.result;

        if (data) {
          setValue('name', data.name || '');
          setValue('email', data.email || '');
          setValue('mobile', data.mobile || '');
          setValue('country', data.country || '');
          setValue('state', data.state || '');
          setValue('city', data.city || '');
          setValue('address', data.address || '');
          setValue('landmark', data.landmark || '');
          setValue('dateOfBirth', data.dob || '');
          setValue('gender', data.gender || '');
          setValue('categories', JSON.parse(data.categories || '[]'));
        }
      } catch (error) {
        console.error('Failed to fetch customer:', error);
      }
    };

    fetchData();
  }, [id, setValue]);

  const countries = [
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' }
  ];
  const categories = ['Healthcare', 'Technology', 'Education', 'Finance', 'Marketing', 'Legal'];
    // Form submission handler for updating customer




  const onSubmit = async (data: FormData) => {
    try {
      const formDataToSend = new FormData();

      formDataToSend.append('name', data.name);
      formDataToSend.append('email', data.email);
      formDataToSend.append('mobile', data.mobile);
      formDataToSend.append('country', data.country);
      formDataToSend.append('state', data.state);
      formDataToSend.append('city', data.city);
      formDataToSend.append('address', data.address);
      formDataToSend.append('landmark', data.landmark || '');
      formDataToSend.append('dob', data.dateOfBirth || '');
      formDataToSend.append('gender', data.gender || '');
      formDataToSend.append('status', 'active');
      formDataToSend.append('categories', JSON.stringify(data.categories || []));

      if (profileImage) {
        formDataToSend.append('profile', profileImage);
      }

      const response = await updateCustomer(id, formDataToSend);

      if (response?.status === true) {
        toast.success('Customer updated successfully!');
        router.push('/admin/customers');
      } else {
        toast.error(response?.message || 'Failed to update customer.');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'An error occurred.');
    }
  };
    // Min and max date constraints for DOB input

  const today = new Date();
  const minDOB = new Date(today.getFullYear() - 75, today.getMonth(), today.getDate());
  const maxDOB = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  // Helper to format date as YYYY-MM-DD
  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-medium text-gray-900">Edit Customer</h1>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="name">Name<span className="text-red-600">*</span></Label>
              <Input {...register('name')} id="name" placeholder="Enter Name" />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email<span className="text-red-600">*</span></Label>
              <Input {...register('email')} id="email" type="email" placeholder="Enter Email" />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="mobile">Mobile<span className="text-red-600">*</span></Label>
              <Input {...register('mobile')} id="mobile" type="tel" placeholder="Enter Mobile Number" />
              {errors.mobile && <p className="text-red-600 text-sm mt-1">{errors.mobile.message}</p>}
            </div>

            <div>
              <Label htmlFor="country">Country<span className="text-red-600">*</span></Label>
              <select {...register('country')} id="country" className="form-select w-full px-3 py-2 border rounded-md text-black">
                <option value="">Select Country</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                ))}
              </select>
              {errors.country && <p className="text-red-600 text-sm mt-1">{errors.country.message}</p>}
            </div>

            <div>
              <Label htmlFor="state">State<span className="text-red-600">*</span></Label>
              <Input {...register('state')} id="state" placeholder="Enter State" />
              {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state.message}</p>}
            </div>

            <div>
              <Label htmlFor="city">City<span className="text-red-600">*</span></Label>
              <Input {...register('city')} id="city" placeholder="Enter City" />
              {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>}
            </div>

            <div>
              <Label htmlFor="dateOfBirth">Date of Birth<span className="text-red-600">*</span></Label>
              <Input
                {...register('dateOfBirth')}
                id="dateOfBirth"
                type="date"
                min={formatDate(minDOB)}
                max={formatDate(maxDOB)}
              />              {errors.dateOfBirth && <p className="text-red-600 text-sm mt-1">{errors.dateOfBirth.message}</p>}
            </div>

            <div>
              <Label htmlFor="gender">Gender<span className="text-red-600">*</span></Label>
              <select {...register('gender')} id="gender" className="form-select w-full px-3 py-2 border rounded-md text-black">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <p className="text-red-600 text-sm mt-1">{errors.gender.message}</p>}
            </div>

            <div>
              <Label htmlFor="landmark">Landmark<span className="text-red-600">*</span></Label>
              <Input {...register('landmark')} id="landmark" placeholder="Enter Landmark" />
              {errors.landmark && <p className="text-red-600 text-sm mt-1">{errors.landmark.message}</p>}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="address">Address<span className="text-red-600">*</span></Label>
              <textarea
                {...register('address')}
                id="address"
                rows={3}
                placeholder="Enter Address"
                className="w-full border rounded-md px-3 py-2 text-black"
              />
              {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>}
            </div>
          </div>

          <div>
            <Label>Categories<span className="text-red-600">*</span></Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center">
                  <input
                    type="checkbox"
                    value={cat}
                    {...register('categories')}
                    className="h-4 w-4 text-[#0d9488] focus:ring-[#0d9488] border-gray-300 rounded"
                  />
                  <span className="ml-2 text-base text-gray-700">{cat}</span>
                </label>
              ))}
            </div>
            {errors.categories && <p className="text-red-600 text-sm mt-1">{errors.categories.message}</p>}
          </div>

          <div>
            <Label htmlFor="profile-upload">Profile Image</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                id="profile-upload"
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const validTypes = ['image/jpeg', 'image/png'];
                    if (validTypes.includes(file.type)) {
                      setProfileImage(file);
                    } else {
                      toast.error("Only JPG and PNG images are allowed.");
                    }
                  }
                }}
              />
              <label htmlFor="profile-upload" className="cursor-pointer flex flex-col items-center">
                <Upload className="h-12 w-12 text-gray-400" />
                <span className="mt-2 text-base text-gray-600">Click to upload profile image</span>
              </label>
              {profileImage && <div className="mt-2 text-base text-green-600">Selected: {profileImage.name}</div>}
            </div>
          </div>

          <div className="flex space-x-4 pt-4 justify-between">
            <button
              type="button"
              className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:opacity-90"
              onClick={() => router.push('/admin/customers')}
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:opacity-90"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerPage;
