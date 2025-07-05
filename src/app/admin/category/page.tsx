"use client";

import { useMemo, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Trash2,
  ToggleRight,
  ToggleLeft,
  Edit,
  Star,
  Plus,
} from "lucide-react";
import Swal from "sweetalert2";
import {
  getAllCategory,
  deleteCategory,
  updateStatusCategory,
  updateFeaturedCategory,
} from "@/services/categoryService";
import { formatDate } from "../../../lib/date";
import PaginatedDataTable from "@/components/PaginatedDataTablet";
import { Button } from "@/components/ui/Button";

// ✅ Define the Category type
interface Category {
  id: number;
  name: string;
  cat_for: string;
  status: string;
  featured: "0" | "1";
  createdAt: string;
  subCategoryCount?: number;
}

const categoryLabelMap: Record<string, string> = {
  "0": "eboxTENDERS",
  "1": "Tender",
  "2": "Both",
};

const CategoryListPage = () => {
  const router = useRouter();

  const [allData, setAllData] = useState<Category[]>([]);
  const [filteredData, setFilteredData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedParentName, setSelectedParentName] = useState("");
  const [allParentNames, setAllParentNames] = useState<string[]>([]);
  const [shouldApplyFilters, setShouldApplyFilters] = useState(false);

  const [searchFilters, setSearchFilters] = useState({
    category: "",
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllCategory(1, 10000);
      const data: Category[] = Array.isArray(res?.result?.data)
        ? res.result.data
        : [];

      setAllData(data);

      const uniqueParentNames = Array.from(
        new Set(data.map((item: Category) => item.name))
      ) as string[];

      setAllParentNames(uniqueParentNames);
      setFilteredData(data.slice(0, limit));
      setTotalRows(data.length);
      setTotalPages(Math.ceil(data.length / limit));
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const applyFilters = useCallback(() => {
    let filtered = [...allData];
    const { category } = searchFilters;

    if (category) {
      filtered = filtered.filter((item) => item.name === category);
    }

    if (selectedParentName) {
      filtered = filtered.filter((item) => item.name === selectedParentName);
    }

    const start = (page - 1) * limit;
    const end = start + limit;

    setFilteredData(filtered.slice(start, end));
    setTotalRows(filtered.length);
    setTotalPages(Math.ceil(filtered.length / limit));
  }, [allData, searchFilters, selectedParentName, page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = () => {
    setPage(1);
    applyFilters();
  };

  const handleReset = () => {
    setSearchFilters({ category: "" });
    setSelectedParentName("");
    setPage(1);
    setShouldApplyFilters(true);
  };

  useEffect(() => {
    if (shouldApplyFilters) {
      applyFilters();
      setShouldApplyFilters(false);
    }
  }, [shouldApplyFilters]);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure",
      text: "You want to delete this category?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#506ae5",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteCategory(id);
        Swal.fire("Deleted!", "Category has been deleted.", "success");
        fetchData();
      } catch {
        Swal.fire("Error!", "Failed to delete Category.", "error");
      }
    }
  };

  const handleStatusChange = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "Y" ? "N" : "Y";
    const result = await Swal.fire({
      title: "Are you sure",
      text: `You want to change status to ${newStatus === "Y" ? "active" : "inactive"}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
    });

    if (result.isConfirmed) {
      try {
        await updateStatusCategory(id, { status: newStatus });
        Swal.fire("Updated!", "Category status has been changed.", "success");
        fetchData();
      } catch {
        Swal.fire("Error", "Failed to update status.", "error");
      }
    }
  };

  const handleFeaturedChange = async (id: number, currentStatus: "0" | "1") => {
    const newFeatured: "0" | "1" = currentStatus == "1" ? "0" : "1";
    const result = await Swal.fire({
      title: `Are you sure`,
      text: `You want to mark this category as ${newFeatured == "1" ? "featured" : "unfeatured"}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
    });

    if (result.isConfirmed) {
      try {
        await updateFeaturedCategory(id, { featured: newFeatured });
        Swal.fire("Updated!", "Category featured has been updated.", "success");
        fetchData();
      } catch {
        Swal.fire("Error!", "Failed to update featured status.", "error");
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        name: "S.No",
        selector: (_: Category, index: number) =>
          (page - 1) * limit + index + 1,
      },
      { name: "Parent Category", selector: (row: Category) => row.name },
      {
        name: "SubCategory",
        selector: (row: Category) =>
          `SubCategory(${row.subCategoryCount || 0})`,
      },
      {
        name: "Category",
        selector: (row: Category) =>
          categoryLabelMap[row.cat_for?.toString()] || row.cat_for,
      },
      {
        name: "Created",
        selector: (row: Category) => formatDate(row.createdAt),
      },
      {
        name: "Status",
        cell: (row: Category) => (
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              row.status === "Y"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {row.status === "Y" ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        name: "Actions",
        cell: (row: Category) => (
          <div className="flex space-x-3 items-center">
            <div
              className="cursor-pointer"
              title={`Click to mark as ${row.status === 'active' ? 'inactive' : 'active'}`}
              onClick={() => handleStatusChange(row.id, row.status)}
            >
              {row.status === "Y" ? (
                <ToggleRight size={20} className="text-green-500" />
              ) : (
                <ToggleLeft size={20} className="text-red-500" />
              )}
            </div>
            <div
              className="cursor-pointer"
              title="Change the Featured"
              onClick={() => handleFeaturedChange(row.id, row.featured)}
            >
              {row.featured == "1" ? (
                <Star fill="yellow" stroke="yellow" size={20} />
              ) : (
                <Star size={20} />
              )}
            </div>
            <button
              title="Edit"
              onClick={() => router.push(`/admin/category/edit?id=${row.id}`)}
            >
              <Edit size={18} color="green" />
            </button>
            <button title="Delete" onClick={() => handleDelete(row.id)}>
              <Trash2 size={16} color="red" />
            </button>
          </div>
        ),
      },
    ],
    [page, limit]
  );

  return (
    <div className="min-h-screen">
      <main className="max-w-10xl py-2">
        <div className="border shadow-xl p-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-800">
              Category Manager
            </h2>
            <button
              title="Add category"
              onClick={() => router.push("/admin/category/add")}
              className="p-2 rounded-[5px] bg-blue-500 text-black hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 text-white" />
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border py-4 px-4">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
              <div>
                <select
                  id="category"
                  className="w-full h-10 text-black text-sm border border-gray-200 rounded-[5px] px-3"
                  value={searchFilters.category}
                  onChange={(e) =>
                    setSearchFilters({
                      ...searchFilters,
                      category: e.target.value,
                    })
                  }
                >
                  <option value="">Parent Category</option>
                  {allParentNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSearch}
                  className="w-full bg-blue-500 hover:bg-blue-700 rounded-[5px]"
                >
                  Search
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white rounded-[5px]"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>

          <div className="relative">
            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-70 z-10 flex items-center justify-center rounded">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <PaginatedDataTable
              title="Tenders"
              columns={columns}
              data={filteredData}
              page={page}
              itemsPerPage={limit}
              totalCount={totalRows}
              onPageChange={setPage}
              onPerPageChange={(newLimit) => {
                setLimit(newLimit);
                setPage(1);
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategoryListPage;
