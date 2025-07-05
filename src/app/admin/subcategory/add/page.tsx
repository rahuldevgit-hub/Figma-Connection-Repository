"use client";

import { createSubCategory, getCategory } from "@/services/subcategoryService";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { SwalConfirm, SwalSuccess, SwalError } from "@/components/ui/SwalAlert";

const subcategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  parent_id: z.string().min(1, "Parent category is required"),
  cat_for: z.union([z.literal("0"), z.literal("1"), z.literal("2")], {
    required_error: "Category type is required",
  }),
});

type FormData = z.infer<typeof subcategorySchema>;

export default function AddSubcategoryForm() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(subcategorySchema),
    defaultValues: {
      cat_for: "0",
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategory(); // fetch all categories
        setCategories(res.result || []);

      } catch (error) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", data.name);
      formDataToSend.append("parent_id", data.parent_id);


      const response = await createSubCategory(formDataToSend);

      if (response?.status === true) {
        SwalSuccess("Subcategory has been saved.");
        router.push("/admin/subcategory");
      } else {
        SwalError({ title: "Failed!", message: response?.message || "Failed to create subcategory." });

      }
    } catch (error: any) {
      const message = error?.response?.data?.message;
        SwalError({ title: "Failed!", message: message|| "Failed to create subcategory." });
    }
  };
  const handleBack = () => {
    router.push("/admin/subcategory");
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
            <h1 className="text-xl font-medium text-gray-800">Add Sub Category</h1>
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
