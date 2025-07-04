'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import SummernoteEditor from '@/components/ui/SummernoteEditor';
import { getEmailTempalteById, updateEmailTempalte } from '@/services/emailTemplateService';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  fromemail: z.string().email('Invalid from email'),
  adminemail: z.string().email('Invalid admin email'),
  subject: z.string().min(1, 'Subject is required'),
  format: z.string().min(1, 'Format is required'),
});

type EmailTemplateFormValues = z.infer<typeof schema>;

export default function EditEmailTemplate() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [initialFormat, setInitialFormat] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EmailTemplateFormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    register('format');
  }, [register]);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (templateId: string) => {
    try {
      const res = await getEmailTempalteById(templateId);
      const data = res?.result;
      if (data) {
        setValue('title', data.title || '');
        setValue('fromemail', data.fromemail || '');
        setValue('adminemail', data.adminemail || '');
        setValue('subject', data.subject || '');
        setValue('format', data.format || '');
        setInitialFormat(data.format || '');
      }
    } catch (err) {
      toast.error('Failed to load template');
    }
  };

  const onSubmit = async (data: EmailTemplateFormValues) => {
    try {
      const clean = data.format.trim();
      if (!clean || clean === '<p><br></p>') {
        toast.error('Format is required');
        return;
      }

      const res = await updateEmailTempalte(id, data);
      if (res.status === true) {
        toast.success('Email Template updated!');
        router.push('/admin/emailtemplate');
      } else {
        toast.error(res?.message || 'Failed to update');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-12">
            <button
              onClick={() => router.push('/admin/emailtemplate')}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Edit Email Template</h1>
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
              value={initialFormat}
              onChange={(html) => setValue('format', html)}
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
