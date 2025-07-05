'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

import { countrySchema, CountryFormValues } from '@/schemas/countrySchema';
import { getCountryById, updateCountry } from '@/services/countryService';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';

const EditCountryPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const id = idParam ? parseInt(idParam, 10) : null;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CountryFormValues>({
    resolver: zodResolver(countrySchema),
    defaultValues: {
      name: '',
      words: '',
    },
  });

  useEffect(() => {
    const fetchCountry = async () => {
      if (!id || isNaN(id)) {
        toast.error('Invalid country ID');
        router.push('/admin/country');
        return;
      }

      try {
        const data = await getCountryById(id);
        reset({
          name: data.name || '',
          words: data.words || '',
        });
      } catch (error) {
        console.error('Error fetching country:', error);
        toast.error('Failed to load country');
      }
    };

    fetchCountry();
  }, [id, reset]);

  const onSubmit = async (formData: CountryFormValues) => {
    if (!id || isNaN(id)) {
      toast.error('Invalid country ID');
      return;
    }

    try {
      await updateCountry(id, formData);
      toast.success('Country updated successfully!');
      router.push('/admin/country');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Update failed');
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
            <h2 className="text-xl font-medium text-gray-800">Edit Country</h2>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 p-6 bg-white rounded-lg shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Country Name <span className="text-red-600">*</span></Label>
              <Input id="name" {...register("name")} placeholder="Enter country name" />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="words">Country Code <span className="text-red-600">*</span></Label>
              <Input id="words" {...register("words")} placeholder="Enter country code" />
              {errors.words && (
                <p className="text-sm text-red-600 mt-1">{errors.words.message}</p>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:opacity-90"
              onClick={() => router.back()}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:opacity-90"
            >
              {isSubmitting ? 'Updating...' : 'Submit'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditCountryPage;
