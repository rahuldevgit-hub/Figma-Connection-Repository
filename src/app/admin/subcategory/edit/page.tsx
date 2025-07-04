"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Upload ,ArrowLeft} from "lucide-react";

import {Label} from "@/components/ui/Label";
import {Input} from "@/components/ui/Input";
import {
  getSubCategoryById,
  updateSubCategory,
  getCategory,
} from "@/services/subcategoryService";

// Validation schema
const subcategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  parent_id: z.string().min(1, "Parent category is required"),
});

type FormData = z.infer<typeof subcategorySchema>;

export default function EditSubCategoryForm() {
  const router = useRouter();
  const searchParams = useSearchParams(); // ✅ Used to get query param
  const id = searchParams.get("id"); // ✅ Will get '16' from ?id=16

  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(subcategorySchema),
  });

  // Fetch all parent categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategory();
        setCategories(res.result || []);
      } catch (error) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategory details by ID
  useEffect(() => {
    const fetchSubCategory = async () => {
      if (!id) return;

      try {
        const response = await getSubCategoryById(id);
        const data = response?.result;

        if (data?.name && data?.parent_id !== undefined) {
          reset({
            name: data.name || "",
            parent_id: String(data.parent_id ?? ""),
          });
        } else {
          toast.error("Invalid subcategory data");
        }
      } catch (error) {
        toast.error("Failed to load subcategory");
      }
    };

    fetchSubCategory();
  }, [id, reset]);

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    if (!id) {
      toast.error("Invalid subcategory ID");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", data.name);
      formDataToSend.append("parent_id", data.parent_id);

      const response = await updateSubCategory(id, formDataToSend);

      if (response?.status === true) {
        toast.success("Subcategory updated successfully", {
          position: "top-center",
        });
        router.push("/admin/subcategory");
      } else {
        toast.error(response?.message || "Failed to update subcategory", {
          position: "top-center",
        });
      }
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast.error(message || "An error occurred", { position: "top-center" });
    }
  };

  const handleBack = () => {
    router.push("/admin/category");
  };
  return (
       <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-12">
            <button 
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
            </button>
            <h1  className="text-xl font-medium text-gray-800">Edit  Sub Category</h1>
          </div>
        </div>
      </header>
            <main className="mx-auto px-4 sm:px-6 lg:px-8 py-4">

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="bg-white rounded-lg shadow-sm border p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

            <div>
              <Label htmlFor="parent_id">
                Parent Category   <span className="text-red-500">*</span>
              </Label>
              <select
                {...register("parent_id")}
                id="parent_id"
                className="w-full min-w-[300px] border border-gray-300 rounded-md px-2 py-2 text-black text-sm mt-1"
              >
                <option value="">Main Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.parent_id && <p className="text-red-600 text-sm mt-1">{errors.parent_id.message}</p>}
            </div>   
            {/* Subcategory Name */}
            <div>
              <Label htmlFor="name">
                Name  <span className="text-red-500">*</span>
              </Label>
              <Input {...register("name")} id="name" placeholder="Name" />
              {errors.name && <p className="text-red-600 text-sm mt-1 py-1">{errors.name.message}</p>}
            </div>

          
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 pt-4 justify-between">
            <button
              type="button"
              className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:opacity-90"
              onClick={() => router.push("/admin/subcategory")}
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:opacity-90"
            >
              Submit
            </button>
          </div>
        </form>
        </main>
      </div>
  );
}
