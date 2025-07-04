"use client";

import { useMemo, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Trash2, ToggleRight, ToggleLeft, Edit, Plus } from "lucide-react";
import Swal from "sweetalert2";
import {
  getAllUnitMeasures,
  deleteUnitMeasure,
  updateStatusUnitMeasure,
} from "@/services/unitmeasureService";
import { formatDate } from "../../../lib/date";
import PaginatedDataTable from "@/components/PaginatedDataTablet";

const UnitMeasurePage = () => {
  const router = useRouter();

  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const fetchData = async (currentPage = 1, currentLimit = 10) => {
    try {
      setLoading(true);
      const res = await getAllUnitMeasures(currentPage, currentLimit);      
      const data = Array.isArray(res?.result?.data) ? res.result.data : [];
      const total = res?.result?.totalItems || 0;
      setFilteredData(data);
      setTotalRows(total);
    } catch (error) {
      console.error("Failed to fetch unit measures:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, limit);
  }, [page, limit]);

  const handleDelete = useCallback(
    async (id) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won’t be able to delete this unit measure!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#506ae5",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        try {
          await deleteUnitMeasure(id);
          Swal.fire("Deleted!", "Unit measure has been deleted.", "success");
          fetchData(page, limit);
        } catch (err) {
          Swal.fire("Error!", "Failed to delete unit measure.", "error");
        }
      }
    },
    [page, limit]
  );

  const handleStatusChange = useCallback(
    async (id, currentStatus) => {
      const newStatus = currentStatus === "N" ? "Y" : "N";
      const readableStatus = newStatus === "Y" ? "Active" : "InActive";

      const result = await Swal.fire({
        title: "Are you sure?",
        text: `You want to change status to ${readableStatus}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, change it!",
      });

      if (result.isConfirmed) {
        try {
          await updateStatusUnitMeasure(id, { status: newStatus });
          Swal.fire("Updated!", "Status updated successfully.", "success");
          fetchData(page, limit);
        } catch (error) {
          Swal.fire("Error", "Failed to update status.", "error");
        }
      }
    },
    [page, limit]
  );

  const columns = useMemo(
    () => [
      {
        name: "S.No",
        selector: (_row, index) => (page - 1) * limit + index + 1,
        width: "10%",
      },
      {
        name: "Title",
        selector: (row) => row.title,
        sortable: true,
        width: "40%",
      },
      {
        name: "Created",
        selector: (row) => formatDate(row.createdAt),
        width: "20%",
      },
      {
        name: "Status",
        width: "10%",
        cell: (row) => {
          const readableStatus = row.status === "Y" ? "Active" : "InActive";
          const statusClass =
            row.status === "Y"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800";
          return (
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusClass}`}
            >
              {readableStatus}
            </span>
          );
        },
      },
      {
        name: "Actions",
        width: "20%",
        cell: (row) => (
          <div className="flex space-x-3 items-center">
            <div
              className="cursor-pointer"
              onClick={() => handleStatusChange(row.id, row.status)}
              title={`Click to mark as ${
                row.status === "Y" ? "InActive" : "Active"
              }`}
            >
              {row.status === "Y" ? (
                <ToggleRight size={20} className="text-green-500" />
              ) : (
                <ToggleLeft size={20} className="text-red-500" />
              )}
            </div>
            <button
              onClick={() =>
                router.push(`/admin/unitofmeasure/edit?id=${row.id}`)
              }
              className="text-green-600 hover:text-green-900"
              title="Edit"
            >
              <Edit size={18} strokeWidth={2} />
            </button>
            <button
              onClick={() => handleDelete(row.id)}
              className="text-red-600 hover:text-red-900"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    [page, limit, handleDelete, handleStatusChange]
  );

  return (
    <div className="min-h-screen">
      <main className="max-w-10xl py-2">
        <div className="border shadow-xl p-4 rounded-lg bg-white">
          <div className="flex justify-between items-center mb-4">
            <h2  className="text-xl font-medium text-gray-800">Unit Measures</h2>
            <button
              title="Add Unit Measure"
              onClick={() => router.push("/admin/unitofmeasure/add")}
              className="p-2 rounded bg-blue-500 text-white hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <div className="relative">
            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-70 z-10 flex items-center justify-center rounded">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            <PaginatedDataTable
              title="Unit Measures"
              columns={columns}
              data={filteredData}
              page={page}
              itemsPerPage={limit}
              totalCount={totalRows}
              onPageChange={(newPage) => setPage(newPage)}
              onPerPageChange={(newLimit) => {
                setLimit(newLimit);
                setPage(1); // reset to first page when limit changes
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default UnitMeasurePage;
