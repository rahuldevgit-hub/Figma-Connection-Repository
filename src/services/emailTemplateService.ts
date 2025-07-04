// src/services/emailTemplateService.ts
import API from './api';
import { EmailTemplateFormValues } from '@/schemas/emailTemplateSchema';

export interface EmailTemplate extends EmailTemplateFormValues {
  id: string;
  createdAt: string;
  updatedAt?: string;
  status?: string;
}

export const getAllEmailTempalte = async (
  page: number = 1,
  limit: number = 10
): Promise<{
  data: EmailTemplate[];
  total: number;
  currentPage: number;
  totalPages: number;
}> => {
  const response = await API.get('/admin/emailtempate/viewAll', {
    params: { page, limit },
  });

  const result = response.data.result;

  return {
    data: result.result || [],
    total: result.total || 0,
    currentPage: result.currentPage || 1,
    totalPages: result.totalPages || 1,
  };
};

export const getEmailTempalteById = async (id: string): Promise<{ result: EmailTemplate }> => {
  const response = await API.get(`/admin/emailtempate/details/${id}`);
  return response.data;
};

export const createEmailTempalte = async (payload: EmailTemplateFormValues) => {
  const res = await API.post('/admin/emailtempate/add', payload);
  return res.data;
};

export const updateEmailTempalte = async (
  id: string,
  data: EmailTemplateFormValues
): Promise<{ status: boolean; message?: string }> => {
  const response = await API.put(`/admin/emailtempate/update/${id}`, data);
  return response.data;
};

export const deleteEmailTempalte = async (id: number) => {
  const res = await API.delete(`/admin/emailtempate/delete/${id}`);
  return res.data;
};

export const updateStatusEmailTempalte = async (id: string, data: { status: string }) => {
  const response = await API.put(`/admin/emailtempate/updatestatus/${id}`, data);
  return response.data;
};
