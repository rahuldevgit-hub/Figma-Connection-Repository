'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Edit, Trash2, Plus, ToggleRight, ToggleLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import PaginatedDataTable from "@/components/PaginatedDataTablet";
import {
  getAllCountries,
  deleteCountry,
  updateCountryStatus
} from '@/services/countryService';
import { formatDate } from "../../../lib/date";
const CountryPage = () => {
  const router = useRouter();

  const [allData, setAllData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllCountries();
      const data = res?.data || [];
      setTotalRows(res.total || 0);
      setTotalPages(res.totalPages || 0);
       setAllData(data);
      setFilteredData(data.slice((page - 1) * limit, page * limit));
    } catch (err: any) {
      console.error(err);
      setError('Failed to load countries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const paginatedData = allData.slice((page - 1) * limit, page * limit);
    setFilteredData(paginatedData);
    setTotalPages(Math.ceil(allData.length / limit));
  }, [page, limit, allData]);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure',
      text: 'You won’t be able to delete this country?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#506ae5',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await deleteCountry(id);
        Swal.fire('Deleted!', 'Country has been deleted.', 'success');
        fetchData();
      } catch (err) {
        Swal.fire('Error!', 'Failed to delete country.', 'error');
      }
    }
  };

  const handleStatusChange = async (id: number, currentStatus: 'Y' | 'N') => {
    const newStatus = currentStatus === 'Y' ? 'N' : 'Y';

    const result = await Swal.fire({
      title: 'Are you sure',
      text: `You want to change status to ${newStatus === 'Y' ? 'active' : 'inactive'}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, change it!',
    });

    if (result.isConfirmed) {
      try {
        setUpdatingId(id);
        await updateCountryStatus(id, { status: newStatus });
        Swal.fire('Updated!', 'Country status updated successfully.', 'success');
        fetchData();
      } catch (err) {
        Swal.fire('Error', 'Failed to update status', 'error');
      } finally {
        setUpdatingId(null);
      }
    }
  };

  const handleEdit = useCallback((id: number) => {
    router.push(`/admin/country/edit?id=${id}`);
  }, [router]);

  const columns = [
    {
      name: 'S.No',
      selector: (_row: any, index: number) => (page - 1) * limit + index + 1,
      width: '10%',
    },
    {
      name: 'Name',
      selector: (row: any) => row.name,
      sortable: true,
      width: '20%',
    },
    {
      name: 'Code',
      selector: (row: any) => row.words,
      sortable: true,
      width: '20%',
    },
    {
      name: 'Created',
        selector: (row: any) => formatDate(row.createdAt,'DD MMM YYYY'),
      width: '20%',
    },
   
    {
      name: 'Actions',
      width: '30%',
      cell: (row: any) => (
        <div className="flex space-x-2 items-center">
          <div
            className={`cursor-pointer ${updatingId === row.id ? 'opacity-50 pointer-events-none' : ''}`}
            onClick={() => handleStatusChange(row.id, row.status)}
            title={`Click to mark as ${row.status === 'Y' ? 'InActive' : 'Active'}`}
          >
            {row.status === 'Y' ? (
              <ToggleRight className="text-green-500" size={20} />
            ) : (
              <ToggleLeft className="text-red-500" size={20} />
            )}
          </div>

          <button
          title='Edit'
            onClick={() => handleEdit(row.id)}
            className="text-green-600 hover:text-green-900"
          >
            <Edit size={16} />
          </button>

          <button
          title='Delete'
            onClick={() => handleDelete(row.id)}
            className="text-red-600 hover:text-red-900"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <main className="max-w-10xl py-2">
        <div className="border shadow-xl p-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-800">
              Country List</h2>
            <button
              title="Add faq"
              onClick={() => router.push("/admin/country/add")}
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

export default CountryPage;
