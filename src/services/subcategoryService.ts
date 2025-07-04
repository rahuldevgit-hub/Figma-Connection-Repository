import API from "./api";
import { SubCategory } from "@/types/subcategory"; // Create this if it doesn't exist

// Fetches all SubCategories
export const getAllSubCategory = async (
  page = 1,
  limit = 10,
  search = "",
  parent_id?: number
): Promise<any> => {
  const response = await API.get("/admin/subcategory/viewAll", {
    params: { page, limit, search, parent_id },
  });
  return response.data;
};

// Updates the status of a SubCategory
export const updateStatusSubCategory = async (
  id: number,
  data: Partial<SubCategory>
): Promise<SubCategory> => {
  const response = await API.put(`/admin/subcategory/status/${id}`, data);
  return response.data;
};

// Deletes a SubCategory by ID
export const deleteSubCategory = async (id: number): Promise<void> => {
  await API.delete(`/admin/subcategory/delete/${id}`);
};

// Creates a new SubCategory
export const createSubCategory = async (data: FormData): Promise<any> => {
  const response = await API.post("/admin/subcategory/add", data);
  return response.data;
};

// Updates a SubCategory by ID
export const updateSubCategory = async (
  id: string,
  data: FormData
): Promise<{ status: boolean; message?: string }> => {
  const response = await API.put(`/admin/subcategory/edit/${id}`, data);
  return response.data;
};

// Fetches a single SubCategory by ID
export const getSubCategoryById = async (
  id: string
): Promise<{ result: SubCategory }> => {
  const response = await API.get(`/admin/subcategory/details/${id}`);
  console.log(response,'djdjcndjcn')  
  return response.data;
};


// Fetches a All category's details using their ID.
export const getCategory = async (): Promise<{ result: SubCategory[] }> => {
  const response = await API.get(`/admin/subcategory/viewAllcategory`);
  return response.data;
};


