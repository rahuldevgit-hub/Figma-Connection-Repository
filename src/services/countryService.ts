import API from './api';
import { Country } from '@/types/country';

export const getAllCountries = async (
  page: number = 1,
  limit: number = 10
): Promise<{
  data: Country[];
  total: number;
  currentPage: number;
  totalPages: number;
}> => {
  const response = await API.get('/admin/country/viewAll', {
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

export const getCountryById = async (id: number): Promise<Country> => {
  const response = await API.get(`/admin/country/details/${id}`);
  return response.data.result;
};

export const createCountry = async (data: FormData): Promise<any> => {
  const response = await API.post('/admin/country/add', data);
  return response.data;
};

export const updateCountry = async (
  id: number,
  data: FormData | Record<string, any>
): Promise<any> => {
  const response = await API.put(`/admin/country/update/${id}`, data);
  return response.data;
};

export const deleteCountry = async (id: number): Promise<void> => {
  await API.delete(`/admin/country/delete/${id}`);
};

export const updateCountryStatus = async (
  id: number,
  data: { status: 'Y' | 'N' }
): Promise<Country> => {
  const response = await API.put(`/admin/country/status/${id}`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const SearchCountry = async (data: any): Promise<Country> => {
  const response = await API.post(`/admin/country/search`, data);
  return response.data;
};
