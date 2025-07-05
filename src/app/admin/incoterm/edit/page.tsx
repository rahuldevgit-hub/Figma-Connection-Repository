'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getIncotermById, updateIncoterm } from '@/services/incotermService';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { SwalConfirm, SwalSuccess, SwalError } from "@/components/ui/SwalAlert";

const EditIncotermPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [formData, setFormData] = useState({
    name: '',
  });

  const fetchData = async () => {
    try {
      const data = await getIncotermById(Number(id)); // ✅ No .result here
      console.log(data,'dfbdhf');
      
      setFormData({
        name: data?.name || '',
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to fetch incoterm');
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedData = new FormData();
      updatedData.append('name', formData.name);

      await updateIncoterm(Number(id), updatedData);
              SwalSuccess("Incoterm has been updated successfully.");
      router.push('/admin/incoterm');
    } catch (error: any) {
                SwalError({ title: "Failed!", message:error?.response?.data?.message || 'Something went wrong'});       
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-12">
            <button
              onClick={() => router.push('/admin/incoterm')}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
            </button>
            <h2 className="text-xl font-medium text-gray-800">Edit Incoterm</h2>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6 bg-white rounded-lg shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">
                Title <span className="text-red-600">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Title"
              />
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

export default EditIncotermPage;
