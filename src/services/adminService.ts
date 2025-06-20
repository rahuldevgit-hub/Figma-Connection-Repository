import API from './api';
import { Admin } from '@/types/admin';

// Admin login service Function 
export const AdminLogin = async (data: Partial<Admin>): Promise<Admin> => {
  const response = await API.post('/admin/login', data);
  return response.data;
};
