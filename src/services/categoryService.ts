import API from "./api";
import { Category } from "@/types/category";
//  Fetches all Categorys
export const getAllCategory = async (
  page = 1,
  limit = 10,
  search = ""
): Promise<any> => {
  const response = await API.get("/admin/category/viewAll", {
    params: { page, limit, search },
  });
  return response.data;
};

// Updates the status of a Category
export const updateStatusCategory = async (
  id: number,
  data: Partial<Category>
): Promise<Category> => {
  const response = await API.put(`/admin/category/status/${id}`, data, {});
  return response.data;
};

// Deletes a Category by their ID.
export const deleteCategory = async (id: number): Promise<void> => {
  await API.delete(`/admin/category/delete/${id}`);
};

// Updates the featured of a Category
export const updateFeaturedCategory = async (
  id: number,
  data: Partial<Category>
): Promise<Category> => {
  const response = await API.put(`/admin/category/feature/${id}`, data);
  return response.data;
};

// Creates a new category record.
export const createCategory = async (data: FormData): Promise<any> => {
  const response = await API.post("/admin/category/add", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// services/CategoryService.ts
export const updateCategory = async (
  id: string,
  data: FormData
): Promise<{ status: boolean; message?: string }> => {
  const response = await API.put(`/admin/Category/update/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Fetches a single category's details using their ID.
export const getCategoryById = async (
  id: string
): Promise<{ result: Category }> => {
  const response = await API.get(`/admin/category/details/${id}`);
  return response.data;
};
