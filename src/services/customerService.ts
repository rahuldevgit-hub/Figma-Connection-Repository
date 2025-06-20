import API from './api';
import { Customer } from '@/types/customer';
//  Fetches all customers
export const getAllCustomers = async (): Promise<Customer[]> => {
  const response = await API.get('/admin/customer/viewAll');
  return response.data;
};
  // Fetches a single customer's details using their ID.
export const getCustomerById = async (id: number): Promise<Customer> => {
  const response = await API.get(`/admin/customer/details/${id}`);
  return response.data;
};
  // Creates a new customer record.
export const createCustomer = async (data: FormData): Promise<any> => {
  const response = await API.post('/admin/customer/add', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};
  // Updates an existing customer’s information by ID.
export const updateCustomer = async (id: number, data: Partial<Customer>): Promise<Customer> => {
  const response = await API.put(`/admin/customer/update/${id}`, data,{
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};
  // Deletes a customer by their ID.

export const deleteCustomer = async (id: number): Promise<void> => {
  await API.delete(`/admin/customer/delete/${id}`);
};

// Updates the status of a customer (e.g., active/inactive).
export const updateStatusCustomer = async (id: number, data: Partial<Customer>): Promise<Customer> => {
  const response = await API.put(`/admin/customer/status/${id}`, data,{
  });
  return response.data;
};