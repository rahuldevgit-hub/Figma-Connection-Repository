'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { countrySchema, CountryFormValues } from '@/schemas/countrySchema'; // adjust path
import { createCountry } from '@/services/countryService';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { ArrowLeft } from 'lucide-react';
import { SwalConfirm, SwalSuccess, SwalError } from "@/components/ui/SwalAlert";

const AddCountryPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CountryFormValues>({
    resolver: zodResolver(countrySchema),
  });

  const onSubmit = async (data: CountryFormValues) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('words', data.words);

      await createCountry(formData);
              SwalSuccess('Country added successfully!');
      router.push('/admin/country');
    } catch (error) {
              SwalError({ title: "Failed!", message: error?.response?.data?.message ||'Something went wrong' });

    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-12">
            <button
              onClick={() => router.push('/admin/country')}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
            </button>
            <h2 className="text-xl font-medium text-gray-800">Add Country</h2>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-6 lg:px-2 py-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 p-6 bg-white rounded-lg shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">
                Country Name <span className="text-red-600">*</span>
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Enter country name"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="words">
                Country Code <span className="text-red-600">*</span>
              </Label>
              <Input
                id="words"
                {...register("words")}
                placeholder="Enter country code (numbers only)"
              />
              {errors.words && (
                <p className="text-sm text-red-600 mt-1">{errors.words.message}</p>
              )}
            </div>
          </div>

          <div className="flex space-x-4 pt-4 justify-between">
            <button
              type="button"
              className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:opacity-90"
              onClick={() => router.push('/admin/country')}
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
      </main>
    </div>
  );
};

export default AddCountryPage;
