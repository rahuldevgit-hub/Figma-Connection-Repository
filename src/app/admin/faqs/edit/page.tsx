'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";

import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import SummernoteEditor from '@/components/ui/SummernoteEditor';
import { getFaqById, updateFaq } from '@/services/faqService';

// Zod schema
const faqSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

type FaqFormValues = z.infer<typeof faqSchema>;

export default function EditFaqForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [initialDescription, setInitialDescription] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FaqFormValues>({
    resolver: zodResolver(faqSchema),
  });

  useEffect(() => {
    if (id) {
      getFaqById(id)
        .then((res) => {
          const faq = res.result;
          setValue('title', faq.title);
          setInitialDescription(faq.description || '');
          setLoading(false);
        })
        .catch(() => {
          router.push('/admin/faqs');
        });
    }
  }, [id, setValue, router]);

  const onSubmit = async (data: FaqFormValues) => {
    try {
      const response = await updateFaq(id as string, {
        title: data.title,
        description: data.description,
      });
      if (response?.status === true) {
        SwalSuccess('FAQ updated successfully!');
        router.push('/admin/faqs');
      } else {
        SwalError({ title: "Failed!", message: response?.message || 'Failed to update FAQ.' });

      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Unexpected error.';
      SwalError({ title: "Failed!", message: msg || 'Failed to update FAQ.' });

    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-12">
            <button
              onClick={() => router.push('/admin/faqs')}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Edit FAQ</h1>
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
              {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">
              Description <span className="text-red-600">*</span>
            </Label>
            <SummernoteEditor
              value={initialDescription}
              onChange={(html) => setValue('description', html, { shouldValidate: true })}
            />
            {errors.description && (
              <p className="text-red-600 text-sm">{errors.description.message}</p>
            )}
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
