import API from './api';
import { Payment } from '@/types/payment';

export const getAllPayments = async (
  page: number = 1,
  limit: number = 10,
  search: string = ''
): Promise<{ data: Payment[]; totalItems: number; currentPage: number; totalPages: number }> => {
  const response = await API.get('/admin/payment/viewAll', {
    params: { page, limit, search },
  });
  return response.data.result; 
};

export const getPaymentById = async (id: number): Promise<Payment> => {
  const response = await API.get(`/admin/payment/details/${id}`);
  return response.data.result; // ✅ No result wrapper assumed
};

export const createPayment = async (data: FormData): Promise<Payment> => {
  const response = await API.post('/admin/payment/add', data);
  return response.data;
};

export const updatePayment = async (
  id: number,
  data: FormData
): Promise<Payment> => {
  const response = await API.put(`/admin/payment/update/${id}`, data);
  return response.data;
};

export const deletePayment = async (id: number): Promise<void> => {
  await API.delete(`/admin/payment/delete/${id}`);
};

export const updatePaymentStatus = async (
  id: number,
  data: { status: 'Y' | 'N' }
): Promise<Payment> => {
  const response = await API.put(`/admin/payment/status/${id}`, data);
  return response.data;
};

export const searchPayments = async (
  data: Record<string, any>
): Promise<Payment[]> => {
  const response = await API.post('/admin/payment/search', data);
  return response.data;
};
