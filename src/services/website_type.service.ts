import API from './api';
import { WebsiteTypeAttribute } from '@/types/website_type';

export const viewAllWebsiteType = async (page = 1, limit = 10): Promise<WebsiteTypeAttribute> => {
    const response = await API.get('/website-types/read-all', { params: { page, limit }, });
    return response.data;
};

export const getWebsiteTypeById = async (id: string): Promise<WebsiteTypeAttribute[]> => {
    const response = await API.get(`/website-types/view/${id}`);
    return response.data;
};

export const getAllWebsiteTypes = async (page = 1, limit = 10,): Promise<WebsiteTypeAttribute[]> => {
    const response = await API.get("/website-types/view-all", { params: { page, limit }, });
    return response.data;
};

export const createWebsiteType = async (payload: WebsiteTypeAttribute): Promise<WebsiteTypeAttribute> => {
    const response = await API.post("/website-types/add", payload);
    return response.data;
};

export const updateWebsiteType = async (id: string | number, payload: WebsiteTypeAttribute,):
    Promise<{ status: boolean; message?: string }> => {
    const response = await API.put(`/website-types/update/${id}`, payload);
    return response.data;
};

export const deleteWebsiteType = async (id: number): Promise<void> => {
    await API.delete(`/website-types/delete/${id}`);
};

export const updateWebsiteTypeStatus = async (id: number, data: { status: string },): Promise<WebsiteTypeAttribute> => {
    const response = await API.patch(`/website-types/status/${id}`, data);
    return response.data;
};
