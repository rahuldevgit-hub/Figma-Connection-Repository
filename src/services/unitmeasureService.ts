import API from './api';
import { UnitMeasure } from '@/types/unitMeasure';
//  Fetches all UnitMeasures
export const getAllUnitMeasures = async (page = 1, limit = 10): Promise<any> => {
  const response = await API.get('/admin/unitmeasure/viewAll', {
    params: { page, limit },
  });
  return response.data;
};

// Creates a new UnitMeasure 
export const createUnitMeasure = async (data: FormData): Promise<any> => {
  const response = await API.post('/admin/unitmeasure/add', data, {
  });  
  return response.data;
};

//update UnitMeasure
export const updateUnitMeasure = async (id: string, data: FormData): Promise<{ status: boolean, message?: string }> => {
  const response = await API.put(`/admin/unitmeasure/update/${id}`, data,{
  });
  return response.data;
};

// Deletes a UnitMeasure by their ID.
export const deleteUnitMeasure = async (id: number): Promise<void> => {
  await API.delete(`/admin/unitmeasure/delete/${id}`);
};

// Updates the status of a UnitMeasure 
export const updateStatusUnitMeasure = async (id: number, data: Partial<UnitMeasure>): Promise<UnitMeasure> => {
  const response = await API.put(`/admin/unitmeasure/status/${id}`, data,{
  });
  return response.data;
};

  // Fetches a single unitmeasure's details using their ID.
export const getUnitMeasureById = async (id: string): Promise<{ result: UnitMeasure }> => {
  const response = await API.get(`/admin/Unitmeasure/details/${id}`);
  console.log(response.data);
  
  return response.data;
};

