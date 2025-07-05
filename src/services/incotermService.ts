import API from './api';
import { Incoterm } from '@/types/incoterm';

export const getAllIncoterm = async (
  page: number = 1,
  limit: number = 10,
  search: string = ''
): Promise<{
  result: {
    data: Incoterm[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}> => {
  const response = await API.get('/admin/incoterms/viewAll', {
    params: { page, limit, search },
  });
  return response.data;
};

export const getIncotermById = async (id: number): Promise<Incoterm> => {
  const response = await API.get(`/admin/incoterms/details/${id}`);
  return response.data.result;
};

export const createIncoterm = async (data: FormData): Promise<any> => {
  const response = await API.post('/admin/incoterms/add', data);
  return response.data;
};

export const updateIncoterm = async (id: number, data: FormData): Promise<any> => {
  const response = await API.put(`/admin/incoterms/update/${id}`, data);
  return response.data;
};

export const deleteIncoterm = async (id: number): Promise<void> => {
  await API.delete(`/admin/incoterms/delete/${id}`);
};

export const updateIncotermStatus = async (
  id: number,
  data: { status: 'Y' | 'N' }
): Promise<Incoterm> => {
  const response = await API.put(`/admin/incoterms/status/${id}`, data);
  return response.data;
};

export const SearchIncoterm = async (data): Promise<Incoterm> => {
  const response = await API.post(`/admin/incoterms/search`, data);
  return response.data;
};
