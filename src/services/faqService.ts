import API from './api';

export interface Faq {
  id: number;
  title: string;
  description: string;
  status: 'Y' | 'N';
}

// Get all FAQs
export const getAllFaqs = async (page = 1, limit = 10): Promise<any> => {
  const response = await API.get('/admin/faq/viewAll', {
    params: { page, limit },
  });
  return response.data;
};

// Create FAQ (FormData used only if you're uploading files)
export const createFaq = async (data: FormData): Promise<any> => {
  const response = await API.post('/admin/faq/add', data);
  return response.data;
};

// Update FAQ (JSON body)
export const updateFaq = async (
  id: string,
  data: { title: string; description: string }
): Promise<{ status: boolean; message?: string }> => {
  const response = await API.put(`/admin/faq/update/${id}`, data);
  return response.data;
};

// Delete FAQ
export const deleteFaq = async (id: number): Promise<void> => {
  await API.delete(`/admin/faq/delete/${id}`);
};

// Update status
export const updateStatusFaq = async (
  id: number,
  data: Partial<Faq>
): Promise<Faq> => {
  const response = await API.put(`/admin/faq/status/${id}`, data);
  return response.data;
};

// Get single FAQ
export const getFaqById = async (id: string): Promise<{ result: Faq }> => {
  const response = await API.get(`/admin/faq/details/${id}`);
  return response.data;
};
