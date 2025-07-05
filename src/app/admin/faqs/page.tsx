"use client";
import { useMemo } from "react";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Trash2, ToggleRight, ToggleLeft, Edit, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAllFaqs, deleteFaq, updateStatusFaq } from "@/services/faqService";
import Swal from "sweetalert2";
import { formatDate } from "../../../lib/date";
import PaginatedDataTable from "@/components/PaginatedDataTablet";

const FaqPage = () => {
  const router = useRouter();
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const fetchData = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const res = await getAllFaqs(page, limit);
      const data = Array.isArray(res?.result?.data) ? res.result.data : [];
      const total = res?.result?.totalItems || 0;
      setTotalPages(res.result.totalPages || 0);

      setFilteredData(data);
      setTotalRows(total);
    } catch (error) {
      console.error("Failed to fetch FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, limit);
  }, [page, limit]);

  const handlePerRowsChange = (newLimit, newPage) => {
    setLimit(newLimit);
    setPage(newPage);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure",
      text: "You won’t be able to delete this FAQ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#506ae5",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteFaq(id);
        Swal.fire("Deleted!", "FAQ has been deleted.", "success");
        fetchData(page, limit);
      } catch (err) {
        Swal.fire("Error!", "Failed to delete FAQ.", "error");
      }
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === "N" ? "Y" : "N";
    const readableStatus = newStatus === "N" ? "inactive" : "active";

    const result = await Swal.fire({
      title: "Are you sure",
      text: `You want to change status to ${readableStatus}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
    });

    if (result.isConfirmed) {
      try {
        await updateStatusFaq(id, { status: newStatus });
        Swal.fire("Updated!", "Status updated successfully.", "success");
        fetchData(page, limit);
      } catch (error) {
        Swal.fire("Error", "Failed to update status.", "error");
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        name: "S.No",
        selector: (row, index) => (page - 1) * limit + index + 1,
        width: "10%",
      },
      {
        name: "Title",
        selector: (row) => row.title,
        sortable: true,
        width: "10%",
      },
      {
        name: "Description",
        selector: (row) => {
          // Remove HTML tags
          const textOnly = row.description.replace(/<[^>]+>/g, "").trim();

          // Truncate by characters if too long
          const maxLength = 10; // Change to any limit
          const truncated =
            textOnly.length > maxLength
              ? textOnly.substring(0, maxLength) + "..."
              : textOnly;

          return (
            <div className="prose prose-sm max-w-full text-black">
              {truncated}
            </div>
          );
        },
        sortable: true,
        width: "20%",
      },

      {
        name: "Created",
        selector: (row) => formatDate(row.createdAt),
        width: "20%",
      },
      {
        name: "Status",
        width: "20%",
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
              title={`Click to mark as ${row.status === 'active' ? 'inactive' : 'active'}`}
            >
              {row.status === "Y" ? (
                <ToggleRight size={20} className="text-green-500" />
              ) : (
                <ToggleLeft size={20} className="text-red-500" />
              )}
            </div>
            <button
              onClick={() => router.push(`/admin/faqs/edit?id=${row.id}`)}
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
    [page, limit]
  );

  return (
    <div className="min-h-screen">
      <main className="max-w-10xl py-2">
        <div className="border shadow-xl p-2">
          <div className="flex justify-between items-center mb-6">
            <h2   className="text-xl font-medium text-gray-800">Faq List</h2>
            <button
              title="Add faq"
              onClick={() => router.push("/admin/faqs/add")}
              className="p-2 rounded-[5px] bg-blue-500 text-black hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Table Section with Loading Spinner */}
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
                setPage(1); // reset to first page on limit change
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default FaqPage;
