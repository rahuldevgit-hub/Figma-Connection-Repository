'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {Label} from '@/components/ui/Label';
import {Input} from '@/components/ui/Input';
import { createUnitMeasure } from '@/services/unitmeasureService';


import { ArrowLeft } from 'lucide-react';

// Zod schema for validation
const unitofMreasureSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

type FormData = z.infer<typeof unitofMreasureSchema>;

export default function AddunitofMreasureForm() {
  const router = useRouter();


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(unitofMreasureSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', data.title);
     

      const response = await createUnitMeasure(formDataToSend);

      if (response?.status === true) {
        toast.success('Unit measure created successfully!',{ position: 'top-center' });
        router.push('/admin/unitofmeasure');
      } else {
        toast.error(response?.message || 'Failed to create unitMeasure.');
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || 'An unexpected error occurred.';      
      toast.error(message);
    }
  };

  return (
        <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-12">
            <button
              onClick={() => router.push('/admin/unitofmeasure')}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
            </button>
            <h1  className="text-xl font-medium text-gray-800">Add Unit Of Measure</h1>
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
              <Label htmlFor="title">
                Title <span className="text-red-600">*</span>
              </Label>
              <Input id="title" {...register('title')} placeholder="Enter Title" />
              {errors.title && (
                <p className="text-red-600 text-sm">{errors.title.message}</p>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:opacity-90"
              onClick={() => router.push('/admin/unitofmeasure')}
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
}
