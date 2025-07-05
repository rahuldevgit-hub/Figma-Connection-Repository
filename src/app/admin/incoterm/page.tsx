"use client";

import { useMemo, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Trash2,
  ToggleRight,
  ToggleLeft,
  Edit,
  Plus,
} from "lucide-react";
import Swal from "sweetalert2";
import PaginatedDataTable from "@/components/PaginatedDataTablet";
import {
  getAllIncoterm,
  deleteIncoterm,
  updateIncotermStatus,
} from "@/services/incotermService";
import { formatDate } from "../../../lib/date";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const IncotermListPage = () => {
  const router = useRouter();

  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const [searchFilters, setSearchFilters] = useState({ name: "" });

  const fetchData = useCallback(async (page = 1, limit = 10, search = "") => {
    setLoading(true);
    try {
      const res = await getAllIncoterm(page, limit, search);
      const data = Array.isArray(res?.result?.data) ? res.result.data : [];
      setFilteredData(data);
      setTotalRows(res.result.totalItems || 0);
      setTotalPages(res.result.totalPages || 0);
    } catch (error) {
      console.error("Failed to fetch incoterms:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(page, limit, ""); // No auto search based on input
  }, [page, limit, fetchData]);

  const handleSearch = () => {
    setPage(1);
    fetchData(1, limit, searchFilters.name);
  };

  const handleReset = () => {
    setSearchFilters({ name: "" });
    setPage(1);
    fetchData(1, limit, "");
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure",
      text: "You want to delete this incoterm?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#506ae5",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteIncoterm(id);
        Swal.fire("Deleted!", "Incoterm has been deleted.", "success");
        fetchData(page, limit, searchFilters.name);
      } catch (err) {
        Swal.fire("Error!", "Failed to delete incoterm.", "error");
      }
    }
  };

  const handleStatusChange = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "N" ? "Y" : "N";
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
        await updateIncotermStatus(id, { status: newStatus });
        Swal.fire("Updated!", "Status updated successfully.", "success");
        fetchData(page, limit, searchFilters.name);
      } catch (error) {
        Swal.fire("Error", "Failed to update status.", "error");
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        name: "S.No",
        selector: (_: any, index: number) => (page - 1) * limit + index + 1,
        width: "10%",
      },
      {
        name: "Incoterm Name",
        selector: (row: any) => row.name,
        sortable: true,
        width: "40%",
      },
      {
        name: "Created",
        selector: (row: any) => formatDate(row.createdAt),
        width: "20%",
      },
      {
        name: "Status",
        width: "10%",
        cell: (row: any) => {
          const statusClass =
            row.status === "Y"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800";
          return (
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusClass}`}
            >
              {row.status === "Y" ? "Active" : "InActive"}
            </span>
          );
        },
      },
      {
        name: "Actions",
        width: "20%",
        cell: (row: any) => (
          <div className="flex space-x-3 items-center">
            <div
              className="cursor-pointer"
              onClick={() => handleStatusChange(row.id, row.status)}
              title={`Click to mark as ${row.status === 'active' ? 'inactive' : 'active'}`}
              aria-label="Toggle status"
            >
              {row.status === "Y" ? (
                <ToggleRight className="text-green-500" size={20} />
              ) : (
                <ToggleLeft className="text-red-500" size={20} />
              )}
            </div>

            <button
              onClick={() => router.push(`/admin/incoterm/edit?id=${row.id}`)}
              className="text-green-600 hover:text-green-900"
              title="Edit"
              aria-label="Edit Incoterm"
            >
              <Edit size={18} strokeWidth={2} />
            </button>
            <button
              onClick={() => handleDelete(row.id)}
              className="text-red-600 hover:text-red-900"
              title="Delete"
              aria-label="Delete Incoterm"
            >
              <Trash2 size={16} />
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
        <div className="border shadow-xl p-4 rounded">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-800">Incoterm Manager</h2>
            <button
              title="Add incoterm"
              onClick={() => router.push("/admin/incoterm/add")} 
              className="p-2 rounded-[5px] bg-blue-500 text-black hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 text-white" />
            </button>
          </div>

          <div className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-white p-4 border rounded">
              <div>
                <Input
                  id="reference"
                  type="text"
                  className="w-full h-10 text-black text-sm border-gray-200 rounded-[5px]"
                  placeholder="Search"
                  value={searchFilters.name}
                  onChange={(e) =>
                    setSearchFilters({ ...searchFilters, name: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-2 mt-6 md:mt-0">
                <Button
                  onClick={handleSearch}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Search
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
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
              title="Incoterm List"
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

export default IncotermListPage;
