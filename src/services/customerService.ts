import API from './api';
import { Customer } from '@/types/customer';
//  Fetches all customers
// export const getAllCustomers = async (): Promise<Customer[]> => {
//   const response = await API.get('/admin/customer/viewAll');
//   return response.data;
// };

export const getAllCustomers = async (): Promise<{ result: Customer[] }> => {
  const response = await API.get('/admin/customer/viewAll');
  return response.data; // assuming response.data has 'result'
};
  // Fetches a single customer's details using their ID.
export const getCustomerById = async (id: string): Promise<{ result: Customer }> => {
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
// export const updateCustomer = async (id: number, data: Partial<Customer>): Promise<Customer> => {
//   const response = await API.put(`/admin/customer/update/${id}`, data,{
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     }
//   });
//   return response.data;
// };

// services/customerService.ts
export const updateCustomer = async (id: string, data: FormData): Promise<{ status: boolean, message?: string }> => {
  const response = await API.put(`/admin/customer/update/${id}`, data,{
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

  // Deletes a customer by their ID.

export const deleteCustomer = async (id: number): Promise<void> => {
  await API.delete(`/admin/customer/delete/${id}`);
};

// Updates the status of a customer (e.g., active/inactive).
// export const updateStatusCustomer = async (id: number, data: Partial<Customer>): Promise<Customer> => {
//   const response = await API.put(`/admin/customer/status/${id}`, data,{
//   });
//   return response.data;
// };
export const updateStatusCustomer = async (id: string, data: { status: string }) => {
 const response = await API.put(`/admin/customer/status/${id}`, data,{
  });
  return response.data;};
