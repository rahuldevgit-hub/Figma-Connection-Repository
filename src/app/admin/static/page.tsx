"use client";
import PaginatedDataTable from "@/components/PaginatedDataTablet";
import { useMemo, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Trash2, ToggleRight, ToggleLeft, Edit, Plus } from "lucide-react";
import Swal from "sweetalert2";
import {
  getAllstatic,
  deletestatic,
  updatestaticStatus,
} from "@/services/staticService";
import { formatDate } from "../../../lib/date";

const DataTable = dynamic(() => import("react-data-table-component"), {
  ssr: false,
});

const StaticServiceListPage = () => {
  const router = useRouter();

  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async (page = 1, limit = 10, search = "") => {
    setLoading(true);
    try {
      const res = await getAllstatic(page, limit, search);
      console.log(res,'df');
      
      const data = Array.isArray(res?.data) ? res.data : [];

      setFilteredData(data);
      setTotalRows(res.total || 0);
      setTotalPages(res.totalPages || 0);
    } catch (error) {
      console.error("Failed to fetch static data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(page, limit, searchKeyword);
  }, [page, limit, searchKeyword, fetchData]);

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
      text: "You want to delete this static content?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#506ae5",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deletestatic(id);
        Swal.fire("Deleted!", "Static page has been deleted.", "success");
        fetchData(page, limit, searchKeyword);
      } catch (err) {
        Swal.fire("Error!", "Failed to delete static page.", "error");
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
        await updatestaticStatus(id, { status: newStatus });
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
        width: "6%",
      },
      {
        name: "Title",
        selector: (row: any) => row.title,
        sortable: true,
        width: "25%",
      },
      {
        name: "Image",
        selector: (row: any) => row.image || "N/A",
        width: "15%",
        cell: (row: any) =>
          row.image ? (
            <img
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/image/${row.image}`}
              alt="static"
              className="w-16 h-16 object-cover rounded border"
              onError={(e) => {
                if (!e.currentTarget.src.includes("/no-image.png")) {
                  e.currentTarget.src = "/no-image.png";
                }
              }}
            />
          ) : (
            <span className="text-gray-500">N/A</span>
          ),
      },
      {
        name: "Created",
        selector: (row: any) => formatDate(row.createdAt),
        width: "15%",
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
              {row.status === "Y" ? "Active" : "Inactive"}
            </span>
          );
        },
      },
      {
        name: "Actions",
        width: "29%",
        cell: (row: any) => (
          <div className="flex space-x-3 items-center">
            <div
              className="cursor-pointer"
              onClick={() => handleStatusChange(row.id, row.status)}
              title={`Click to mark as ${
                row.status === "Y" ? "Inactive" : "Active"
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
              onClick={() => router.push(`/admin/static/edit?id=${row.id}`)}
              className="text-green-600 hover:text-green-900"
              aria-label="Edit static page"
            >
              <Edit size={18} strokeWidth={2} />
            </button>

            <button
            title="Delete"
              onClick={() => handleDelete(row.id)}
              className="text-red-600 hover:text-red-900"
              aria-label="Delete static page"
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
            <h2 className="text-xl font-medium text-gray-800">Static Pages</h2>
            <button
              title="Add static"
              onClick={() => router.push("/admin/static/add")}
              className="p-2 rounded-[5px] bg-blue-500 text-white hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <div className="flex space-x-3 text-black mb-4">
            <input
              type="text"
              placeholder="Title"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="border px-2 py-1 rounded w-64"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Search
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-1 bg-yellow-500 rounded text-white hover:bg-yellow-500"
            >
              Reset
            </button>
          </div>

          <div className="relative">
            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-70 z-10 flex items-center justify-center rounded">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            <PaginatedDataTable
              title="Static Pages"
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

export default StaticServiceListPage;
