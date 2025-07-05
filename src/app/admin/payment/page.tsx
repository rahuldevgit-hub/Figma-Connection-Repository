"use client";

import { useMemo, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
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
  getAllPayments,
  deletePayment,
  updatePaymentStatus,
} from "@/services/paymentService";
import { formatDate } from "../../../lib/date";
import { Payment } from "@/types/payment";

const DataTable = dynamic(() => import("react-data-table-component"), {
  ssr: false,
});

const PaymentsListPage = () => {
  const router = useRouter();

  const [filteredData, setFilteredData] = useState<Payment[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchText, setSearchText] = useState("");

 const fetchData = useCallback(async (page = 1, limit = 10, search = "") => {
  try {
    const res = await getAllPayments(page, limit, search);
    setFilteredData(res.data || []);
    setTotalRows(res.totalItems || 0);      
    setTotalPages(res.totalPages || 0);
  } catch (error) {
    console.error("Failed to fetch payments:", error);
  }
}, []);


  useEffect(() => {
    fetchData(page, limit, searchKeyword);
  }, [page, limit, searchKeyword, fetchData]);

  const handlePerRowsChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSearch = () => {
    setSearchKeyword(searchText);
    setPage(1);
  };

  const handleReset = () => {
    setSearchText("");
    setSearchKeyword("");
    setPage(1);
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure",
      text: "You want to delete this payment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#506ae5",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deletePayment(id);
        Swal.fire("Deleted!", "Payment has been deleted.", "success");
        fetchData(page, limit, searchKeyword);
      } catch (err) {
        Swal.fire("Error!", "Failed to delete payment.", "error");
      }
    }
  };

  const handleStatusChange = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "N" ? "Y" : "N";
    const readableStatus = newStatus === "Y" ? "active" : "inactive";

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You want to change status to ${readableStatus}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
    });

    if (result.isConfirmed) {
      try {
        await updatePaymentStatus(id, { status: newStatus as "Y" | "N" });
        Swal.fire("Updated!", "Status updated successfully.", "success");
        fetchData(page, limit, searchKeyword);
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
        name: "Title",
        selector: (row: Payment) => row.name,
        sortable: true,
        width: "25%",
      },
      {
        name: "Created",
        selector: (row: Payment) => formatDate(row.createdAt),
        width: "25%",
      },
      {
        name: "Status",
        width: "15%",
        cell: (row: Payment) => {
          const statusClass =
            row.status === "Y"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800";
          return (
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusClass}`}
            >
              {row.status === "Y" ? "Active" : "Inactive"}
            </span>
          );
        },
      },
      {
        name: "Actions",
        width: "25%",
        cell: (row: Payment) => (
          <div className="flex space-x-3 items-center">
            <div
              className="cursor-pointer"
              onClick={() => handleStatusChange(row.id, row.status)}
              title={`Click to mark as ${
                row.status === "Y" ? "inactive" : "active"
              }`}
            >
              {row.status === "Y" ? (
                <ToggleRight className="text-green-500" size={20} />
              ) : (
                <ToggleLeft className="text-red-500" size={20} />
              )}
            </div>

            <button
            title="Edit"
              onClick={() =>
                router.push(`/admin/payment/edit?id=${row.id}`)
              }
              className="text-green-600 hover:text-green-900"
              aria-label="Edit payment"
            >
              <Edit size={18} strokeWidth={2} />
            </button>

            <button
              onClick={() => handleDelete(row.id)}
              className="text-red-600 hover:text-red-900"
              title="Delete"
              aria-label="Delete payment"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    [page, limit, router]
  );

  return (
    <div className="min-h-screen">
      <main className="max-w-10xl py-2">
        <div className="border shadow-xl p-2">
          <div className="flex justify-between items-center mb-6">
            <h2  className="text-xl font-medium text-gray-800">Payment Terms List</h2>
            <button
              title="Add Payment"
              onClick={() => router.push("/admin/payment/add")}
              className="p-2 rounded-[5px] bg-blue-500 text-black hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Table Section */}
          <PaginatedDataTable
            title="Payment Terms"
            columns={columns}
            data={filteredData}
            page={page}
            itemsPerPage={limit}
            totalCount={totalRows}
            onPageChange={setPage}
            onPerPageChange={handlePerRowsChange}
          />
        </div>
      </main>
    </div>
  );
};

export default PaymentsListPage;
