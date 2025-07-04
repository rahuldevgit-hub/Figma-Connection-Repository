import API from './api';
export const getAllTenders = async (
  page: number = 1,
  limit: number = 10,
  filters: {
    reference?: string;
    category?: string;
    subcategory?: string;
    fromDate?: string;
    toDate?: string;
  } = {}
): Promise<{
  data: [];
  total: number;
  currentPage: number;
  totalPages: number;
}> => {
  const response = await API.post('/admin/tender/viewAll', {
    page,
    limit,
    ...filters,
  });

  const result = response.data.result;

  return {
    data: result.result || [],
    total: result.total || 0,
    currentPage: result.currentPage || 1,
    totalPages: result.totalPages || 1,
  };
};


export const updateStatusTender = async (id: string, data: { status: string }) => {
 const response = await API.put(`/admin/tender/updatestatus/${id}`, data,{
  });
  return response.data;};

  export const deleteTender = async (id: number): Promise<void> => {
  await API.delete(`/admin/tender/delete/${id}`);
};

export const createCalendarEvent = async (id: number, module: 'T' | 'A') => {
  const response = await API.post('/admin/tender/calendar/event', {
    id,
    module,
  });
  
  if (response) {    
    window.location.href = response.data?.result;
  } else {
    throw new Error('No redirect URL received from calendar event API');
  }
};

export const resendEmailToEvaluator = async (id: number) => {
  const response = await API.post(`/admin/tender/resendemailtoevaluator/${id}`);
  return response.data;
};


export const InvitationResendEmail = async (id: number) => {
  const response = await API.post(`/admin/tender/invitationresendemail/${id}`);
  return response.data;
};


export const getTenderById = async (id: number): Promise<any> => {
  try {
    const response = await API.get(`/admin/tender/details/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching tender by ID:', error);
    throw error;
  }
};