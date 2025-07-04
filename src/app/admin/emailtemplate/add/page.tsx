'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import toast from 'react-hot-toast';
import SummernoteEditor from '@/components/ui/SummernoteEditor';
import { createEmailTempalte } from '@/services/emailTemplateService';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const emailTemplateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  fromemail: z.string().email('Invalid from email'),
  adminemail: z.string().email('Invalid admin email'),
  subject: z.string().min(1, 'Subject is required'),
  format: z.string().min(1, 'Format is required'),
});

type FormData = z.infer<typeof emailTemplateSchema>;

export default function EmailTemplateForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(emailTemplateSchema),
    defaultValues: {
      title: '',
      fromemail: '',
      adminemail: '',
      subject: '',
      format: '',
    },
  });

  const formatValue = watch('format');

  useEffect(() => {
    register('format', { required: true });
  }, [register]);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await createEmailTempalte(data);
      if (response?.status === true) {
        toast.success('Email template created successfully!');
        router.push('/admin/emailtemplate');
      } else {
        toast.error(response?.message || 'Failed to create email template.');
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Something went wrong.';
      toast.error(message);
    }
  };

  const handleBack = () => {
    router.push('/admin/emailtemplate');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-12">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Add Email Template</h1>
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
              <Label htmlFor="title">Title <span className="text-red-600">*</span></Label>
              <Input id="title" {...register('title')} placeholder="Enter Title" />
              {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
            </div>

            <div>
              <Label htmlFor="fromemail">From Email <span className="text-red-600">*</span></Label>
              <Input id="fromemail" type="email" {...register('fromemail')} placeholder="Enter From email" />
              {errors.fromemail && <p className="text-red-600 text-sm">{errors.fromemail.message}</p>}
            </div>

            <div>
              <Label htmlFor="adminemail">Admin Email <span className="text-red-600">*</span></Label>
              <Input id="adminemail" type="email" {...register('adminemail')} placeholder="Enter Admin email" />
              {errors.adminemail && <p className="text-red-600 text-sm">{errors.adminemail.message}</p>}
            </div>

            <div>
              <Label htmlFor="subject">Subject <span className="text-red-600">*</span></Label>
              <Input id="subject" {...register('subject')} placeholder="Enter Subject" />
              {errors.subject && <p className="text-red-600 text-sm">{errors.subject.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="format">Format <span className="text-red-600">*</span></Label>
            <SummernoteEditor
              value={formatValue}
              onChange={(html) => setValue('format', html, { shouldValidate: true })}
            />
            {errors.format && <p className="text-red-600 text-sm">{errors.format.message}</p>}
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
