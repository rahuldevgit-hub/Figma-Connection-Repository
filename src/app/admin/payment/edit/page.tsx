'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getPaymentById, updatePayment } from '@/services/paymentService';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";

const EditPaymentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentIdParam = searchParams.get('id');
  const paymentId = paymentIdParam ? Number(paymentIdParam) : null;

  const [formData, setFormData] = useState({ name: '' });
  const [loading, setLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    if (!paymentId) return;

    const fetchData = async () => {
      try {
        const data = await getPaymentById(paymentId); // ✅ direct
        setFormData({
          name: data?.name || '',
        });
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [paymentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const data = new FormData();
      data.append('name', formData.name);

      if (paymentId) {
        await updatePayment(paymentId, data);
        SwalSuccess('Payment term updated successfully!');
        router.push('/admin/payment');
      }
    } catch (err: any) {
      SwalError({ title: "Failed!", message: err?.response?.data?.message || 'Something went wrong' });

    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600 text-lg">Loading...</div>
    );
  }

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
            <h2 className="text-xl font-medium text-gray-800">Edit Payment Terms</h2>
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
                Name <span className="text-red-600">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Payment Name"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name}</p>
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

export default EditPaymentPage;
