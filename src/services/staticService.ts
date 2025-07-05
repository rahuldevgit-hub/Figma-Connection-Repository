import API from './api';
import { Static } from '@/types/static';

export const getAllstatic = async (
  page: number = 1,
  limit: number = 10,
  search: string = ''
): Promise<{ data: Static[]; totalItems: number; currentPage: number; totalPages: number }> => {
  const response = await API.get('/admin/static/viewAll', {
    params: { page, limit, search },
  });
  return response.data.result;
};

export const getstaticById = async (id: number): Promise<Static> => {
  const response = await API.get(`/admin/static/details/${id}`);
  return response.data.result; //  directly returns the object
};

export const createstatic = async (data: FormData): Promise<any> => {
  const response = await API.post('/admin/static/add', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updatestatic = async (id: number, data: FormData): Promise<any> => {
  const response = await API.put(`/admin/static/update/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deletestatic = async (id: number): Promise<void> => {
  await API.delete(`/admin/static/delete/${id}`);
};

export const updatestaticStatus = async (
  id: number,
  data: { status: 'Y' | 'N' }
): Promise<Static> => {
  const response = await API.put(`/admin/static/status/${id}`, data);
  return response.data;
};

export const Searchstatic = async (data: Record<string, any>): Promise<Static> => {
  const response = await API.post(`/admin/static/search`, data);
  return response.data;
};
