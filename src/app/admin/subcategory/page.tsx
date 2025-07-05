"use client";

import { useMemo, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  Trash2,
  ToggleRight,
  ToggleLeft,
  Edit,
  Plus,
} from "lucide-react";
import Swal from "sweetalert2";
import {
  getAllSubCategory,
  deleteSubCategory,
  updateStatusSubCategory,
} from "@/services/subcategoryService";
import { formatDate } from "../../../lib/date";
import { Button } from "@/components/ui/Button";
import { SubCategory } from '@/types/subcategory'; // your interface file

import PaginatedDataTable from "@/components/PaginatedDataTablet";
const LoaderOverlay = () => (
  <div className="fixed inset-0 z-50 bg-white bg-opacity-60 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
  </div>
);

const SubCategoryListPage = () => {
  const router = useRouter();
   const [allData, setAllData] = useState<SubCategory[]>([]);
  const [filteredFullData, setFilteredFullData] = useState<SubCategory[]>([]);
  const [filteredData, setFilteredData] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedParentName, setSelectedParentName] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [allParentNames, setAllParentNames] = useState<string[]>([]);
  const [allSubCategoryNames, setAllSubCategoryNames] = useState<string[]>([]);

   const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllSubCategory(1, 10000);
      const data: SubCategory[] = Array.isArray(res?.result?.data) ? res.result.data : [];

      setAllData(data);

    const parentNames = [
  ...new Set(
    data
      .map((item) => item.parentCategory?.name)
      .filter((name): name is string => Boolean(name))
  ),
];

      setAllParentNames(parentNames);

      setFilteredFullData(data);
      setFilteredData(data.slice(0, limit));
      setTotalRows(data.length);
      setTotalPages(Math.ceil(data.length / limit));
    } catch (error) {
      console.error('Failed to fetch subcategories:', error);
    } finally {
      setLoading(false);
    }
  }
, [limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (selectedParentName) {
      const filteredSubCats = allData
        .filter((item: any) => item.parentCategory?.name === selectedParentName)
        .map((item: any) => item.name);
      setAllSubCategoryNames([...new Set(filteredSubCats)]);
    } else {
      const allNames = allData.map((item: any) => item.name);
      setAllSubCategoryNames([...new Set(allNames)]);
    }
    setSelectedSubCategory("");
  }, [selectedParentName, allData]);

  const handleSearch = () => {
    let filtered = allData;
    if (selectedParentName) {
      filtered = filtered.filter((item: any) =>
        item.parentCategory?.name?.toLowerCase().includes(selectedParentName.toLowerCase())
      );
    }
    if (selectedSubCategory) {
      filtered = filtered.filter((item: any) =>
        item.name?.toLowerCase().includes(selectedSubCategory.toLowerCase())
      );
    }
    setFilteredFullData(filtered);
    setFilteredData(filtered.slice(0, limit));
    setTotalRows(filtered.length);
    setTotalPages(Math.ceil(filtered.length / limit));
    setPage(1);
  };

  const handleReset = () => {
    setSelectedParentName("");
    setSelectedSubCategory("");
    setPage(1);
    setFilteredFullData(allData);
    setFilteredData(allData.slice(0, limit));
    setTotalRows(allData.length);
    setTotalPages(Math.ceil(allData.length / limit));
  };

  useEffect(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    setFilteredData(filteredFullData.slice(start, end));
  }, [page, limit, filteredFullData]);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure",
      text: "You want to delete this subcategory?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#506ae5",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        await deleteSubCategory(id);
        Swal.fire("Deleted!", "SubCategory has been deleted.", "success");
        fetchData();
      } catch (err) {
        Swal.fire("Error!", "Failed to delete SubCategory.", "error");
      }
    }
  };

  const handleStatusChange = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "Y" ? "N" : "Y";
    const readableStatus = newStatus === "Y" ? "active" : "inactive";
    const result = await Swal.fire({
      title: "Are you sure",
      text: `You want to change status to ${readableStatus}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
    });
    if (result.isConfirmed) {
      try {
        await updateStatusSubCategory(id, { status: newStatus });
        Swal.fire("Updated!", "Status has been changed.", "success");
        fetchData();
      } catch (error) {
        Swal.fire("Error", "Failed to update status.", "error");
      }
    }
  };

  const columns = useMemo(() => [
    {
      name: "S.No",
      selector: (_: any, index: number) => (page - 1) * limit + index + 1,
      width: "10%",
    },
    {
      name: "SubCategory",
      selector: (row: any) => row.name || "-",
      sortable: true,
      width: "20%",
    },
    {
      name: "Category",
      selector: (row: any) => row.parentCategory?.name || "N/A",
      sortable: true,
      width: "20%",
    },
    {
      name: "Created",
      selector: (row: any) => row.createdAt ? formatDate(row.createdAt,'DD MMM YYYY') : "-",
      width: "20%",
    },
   
    {
      name: "Actions",
      width: "30%",
      cell: (row: any) => (
        <div className="flex space-x-3 items-center">
          <button
            title={`Mark as ${row.status === "Y" ? "Inactive" : "Active"}`}
            onClick={() => handleStatusChange(row.id, row.status)}
          >
            {row.status === "Y" ? <ToggleRight size={20} className="text-green-500"/> : <ToggleLeft size={20} className="text-red-500"/>}
          </button>
          <button
            title="Edit"
            onClick={() => router.push(`/admin/subcategory/edit?id=${row.id}`)}
            className="text-green-600 hover:text-green-900"
          >
            <Edit size={18} strokeWidth={2} />
          </button>
          <button
            title="Delete"
            onClick={() => handleDelete(row.id)}
            className="text-red-600 hover:text-red-900"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ], [page, limit]);

  return (
    <>

      <div className="min-h-screen">
        <main className="max-w-10xl py-2">
          <div className="border shadow-xl p-2">
            <div className="flex justify-between items-center mb-6">
              <h2  className="text-xl font-medium text-gray-800">SubCategory Manager</h2>
              <button
                title="Add subcategory"
                onClick={() => router.push('/admin/subcategory/add')}
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
                    value={selectedParentName}
                    onChange={(e) => setSelectedParentName(e.target.value)}
                  >
                    <option value="">Parent Category</option>
                    {allParentNames.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    id="subcategory"
                    className="w-full h-10 text-black text-sm border border-gray-200 rounded-[5px] px-3"
                    value={selectedSubCategory}
                    onChange={(e) => setSelectedSubCategory(e.target.value)}
                  >
                    <option value="">SubCategory</option>
                    {allSubCategoryNames.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Buttons */}
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
              {filteredData.length === 0 && !loading ? (
                <p className="text-center text-gray-500 mt-4">No subcategories found.</p>
              ) : (
                <PaginatedDataTable
                  title="SubCategory List"
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
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default SubCategoryListPage;
