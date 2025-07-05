'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import SummernoteEditor from '@/components/ui/SummernoteEditor';
import { createFaq } from '@/services/faqService';
import { ArrowLeft } from 'lucide-react';
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";

const faqSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

// ✅ Type for form values
type FaqFormValues = z.infer<typeof faqSchema>;

export default function AddFaqForm() {
  const router = useRouter();
  const [description, setDescription] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FaqFormValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const handleBack = () => {
    router.push('/admin/faqs');
  };

  const onSubmit = async (data: FaqFormValues) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);

      const response = await createFaq(formData);
      if (response?.status === true) {
        SwalSuccess('FAQ created successfully!');
        router.push('/admin/faqs');
      } else {
        SwalError({ title: "Failed!", message: response?.message || 'Failed to create FAQ.' });
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || 'An unexpected error occurred.';
      SwalError({ title: "Failed!", message: message || 'Failed to create FAQ.' });

    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-12">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
            </button>
            <h1 className="text-xl font-medium text-gray-800">Add FAQ</h1>
          </div>
        </div>
      </header>

      {/* Main form */}
      <main className="mx-auto px-4 sm:px-6 lg:px-2 py-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-6 p-6 bg-white rounded-lg shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Title */}
            <div>
              <Label htmlFor="title">
                Title <span className="text-red-600">*</span>
              </Label>
              <Input {...register('title')} id="title" placeholder="Title" />
              {errors.title && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">
              Description <span className="text-red-600">*</span>
            </Label>
            <SummernoteEditor
              value={description}
              onChange={(html) => {
                setDescription(html);
                setValue('description', html, { shouldValidate: true });
              }}
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 pt-4 justify-between">
            <button
              type="button"
              className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:opacity-90"
              onClick={handleBack}
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
