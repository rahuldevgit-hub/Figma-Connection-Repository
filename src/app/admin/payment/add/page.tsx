'use client';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPayment } from '@/services/paymentService';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";

const AddPaymentPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
  });
  const [errors, setErrors] = useState<{ name?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = 'name is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({}); // Clear previous errors

    try {
      const data = new FormData();
      data.append('name', formData.name);


      await createPayment(data);
      SwalSuccess('Payment term added successfully!');
      router.push('/admin/payment');
    } catch (error: any) {
      SwalError({ title: "Failed!", message: error?.response?.data?.message || 'Failed to create Payment term.' });
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-12">
            <button
              onClick={() => router.push('/admin/payment')}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
            </button>
            <h2 className="text-xl font-medium text-gray-800">Add Payment Terms</h2>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-6 lg:px-2 py-4">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6 bg-white rounded-lg shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">
                Name <span className="text-red-600">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-4 justify-between">
            <button
              type="button"
              className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:opacity-90"
              onClick={() => router.push('/admin/payment')}
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

export default AddPaymentPage;
