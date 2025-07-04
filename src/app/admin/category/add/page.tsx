"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { createCategory } from "@/services/categoryService";

// Zod schema
const categorySchema = z.object({
  name: z.string().min(1, "Title is required"),
  category: z.union([z.literal("0"), z.literal("1"), z.literal("2")], {
    required_error: "Category is required",
  }),
});

type FormData = z.infer<typeof categorySchema>;

export default function AddCategoryForm() {
  const router = useRouter();
  const [Image, setImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      category: "0",
    },
  });

  const handleBack = () => {
    router.push("/admin/category");
  };

  const onSubmit = async (data: FormData) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", data.name);
      formDataToSend.append("cat_for", String(Number(data.category)));

      if (Image) {
        formDataToSend.append("image", Image);
      }

      const response = await createCategory(formDataToSend);

      if (response?.status === true) {
        toast.success("Category has been saved.", {
          position: "top-center",
        });
        router.push("/admin/category");
      } else {
        toast.error(response?.message || "Failed to create category.", {
          position: "top-center",
        });
      }
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast.error(message || "An error occurred.", {
        position: "top-center",
      });
    }
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
            <h1  className="text-xl font-medium text-gray-800">Add Category</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 p-6 bg-white rounded-lg shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
            {/* Title */}
            <div>
              <Label htmlFor="name">
                Title <span className="text-red-600">*</span>
              </Label>
              <Input id="name" {...register("name")} placeholder="Enter title" />
              {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
            </div>

            {/* Category For (Radio) */}
            <div>
              <Label>
                Category For <span className="text-red-600">*</span>
              </Label>
              <div className="flex flex-row gap-3 mt-2 ">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="0"
                    {...register("category")}
                    className="accent-blue-600"
                  />
                  eboxTENDERS
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="1"
                    {...register("category")}
                    className="accent-blue-600"
                  />
                  Tender
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="2"
                    {...register("category")}
                    className="accent-blue-600"
                  />
                  Both
                </label>
              </div>
              {errors.category && (
                <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>

            {/* Image Upload */}
                 <div>
            <Label htmlFor="profile-upload">Image</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                id="profile-upload"
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const validTypes = ['image/jpeg', 'image/png'];
                    if (validTypes.includes(file.type)) {
                      setImage(file);
                    } else {
                      toast.error("Only JPG and PNG images are allowed.");
                    }
                  }
                }}
              />
              <label htmlFor="profile-upload" className="cursor-pointer flex flex-col items-center">
                <Upload className="h-12 w-12 text-gray-400" />
                <span className="mt-2 text-base text-gray-600">Click to upload profile image</span>
              </label>
              {Image && <div className="mt-2 text-base text-green-600">Selected: {Image.name}</div>}
            </div>
          </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex justify-between">
            <button
              type="button"
              className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:opacity-90"
              onClick={handleBack}
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:opacity-90 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
