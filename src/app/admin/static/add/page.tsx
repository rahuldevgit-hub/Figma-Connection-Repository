'use client';

import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createstatic } from '@/services/staticService';
import { ArrowLeft, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import SummernoteEditor from '@/components/ui/SummernoteEditor';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";

// Zod validation schema
const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  format: z.string().min(1, 'Content is required'),
});

type FormData = z.infer<typeof schema>;

const AddStaticPage = () => {
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.format);
      if (image) formData.append('image', image);

      await createstatic(formData);
      SwalSuccess('Static content added successfully');
      router.push('/admin/static');
    } catch (error: any) {
      SwalError({ title: "Failed!", message: error?.response?.data?.message || 'Something went wrong' });

    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-12">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
            </button>
            <h1 className="text-xl font-medium text-gray-800">Add Static Page</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 p-6 bg-white rounded-lg shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <Label htmlFor="title">
                Title <span className="text-red-600">*</span>
              </Label>
              <Input id="title" {...register('title')} placeholder="Enter Title" />
              {errors.title && (
                <p className="text-red-600 text-sm">{errors.title.message}</p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <Label htmlFor="profile-upload">Image</Label>
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
                        setImage(file);
                      } else {
                        toast.error('Only JPG and PNG images are allowed.');
                      }
                    }
                  }}
                />
                <label
                  htmlFor="profile-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="h-12 w-12 text-gray-400" />
                  <span className="mt-2 text-base text-gray-600">
                    Click to upload profile image
                  </span>
                </label>
                {image && (
                  <div className="mt-2 text-base text-green-600">
                    Selected: {image.name}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Editor */}
          <div>
            <Label htmlFor="format">
              Content <span className="text-red-600">*</span>
            </Label>
            <SummernoteEditor
              value={watch('format')}
              onChange={(html) => setValue('format', html)}
            />
            {errors.format && (
              <p className="text-red-600 text-sm">{errors.format.message}</p>
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
};

export default AddStaticPage;
