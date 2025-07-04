'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, Plus, ToggleRight, ToggleLeft, X } from 'lucide-react';
import Swal from 'sweetalert2';
import {
  getAllEmailTempalte,
  deleteEmailTempalte,
  updateStatusEmailTempalte,
} from '@/services/emailTemplateService';
import PaginatedDataTable from "@/components/PaginatedDataTablet";

const DataTable = dynamic(() => import('react-data-table-component'), { ssr: false });

export default function EmailTemplateList() {
  const router = useRouter();
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const fetchTemplates = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const res = await getAllEmailTempalte(page, limit);
      setEmailTemplates(res.data || []);
      setTotalRows(res.total || 0);
      setTotalPages(res.totalPages || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates(page, limit);
  }, [page, limit]);

  const handlePageChange = (page: number) => setPage(page);

  const handlePerRowsChange = (newLimit: number, page: number) => {
    setLimit(newLimit);
    setPage(page);
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to delete this template!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#506ae5',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await deleteEmailTempalte(id);
        Swal.fire('Deleted!', 'Template has been deleted.', 'success');
        fetchTemplates(page, limit);
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete template.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStatusChange = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Y' ? 'N' : 'Y';
    const result = await Swal.fire({
      title: 'Change Status?',
      text: `Mark as ${newStatus === 'Y' ? 'active' : 'inactive'}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await updateStatusEmailTempalte(id, { status: newStatus });
        Swal.fire('Updated!', 'Status changed.', 'success');
        fetchTemplates(page, limit);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSelectChange = (rows: any[]) => {
    setSelectedRows(rows);
    setSelectAll(rows.length === emailTemplates.length);
  };

  const columns = [
    {
      name: 'S.No.',
      selector: (_: any, index: number) => (page - 1) * limit + index + 1,
      width: '10%',
    },
    {
      name: 'Title',
      selector: (row: any) => row.title,
      sortable: true,
      width: '15%',
    },
    {
      name: 'Subject',
      selector: (row: any) => row.subject,
      sortable: true,
      width: '30%',
    },
    {
      name: 'From Email',
      selector: (row: any) => row.fromemail,
      sortable: true,
      width: '25%',
    },
    {
      name: 'View Format',
      cell: (row: any) => (
        <button
          className="text-blue-600 hover:text-blue-800 underline"
          onClick={() => {
            setSelectedFormat(row.format);
            setIsModalOpen(true);
          }}
        >
          View
        </button>
      ),
      width: '10%',
    },
    {
      name: 'Actions',
      width: '10%',
      cell: (row: any) => (
        <div className="flex space-x-2 items-center">
          <button onClick={() => handleStatusChange(row.id, row.status)}>
            {row.status === 'Y' ? (
              <ToggleRight className="text-green-500" size={20} />
            ) : (
              <ToggleLeft className="text-red-500" size={20} />
            )}
          </button>

          <button
            onClick={() => router.push(`/admin/emailtemplate/edit/${row.id}`)}
            className="text-green-600 hover:text-green-900"
          >
            <Edit size={16} />
          </button>
          <button
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
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md max-w-2xl w-full relative overflow-y-auto max-h-[80vh]">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4 text-black">Email Template Preview</h2>
            <div
              className="prose prose-sm max-w-full text-black"
              dangerouslySetInnerHTML={{ __html: selectedFormat }}
            />
          </div>
        </div>
      )}

      <main className="max-w-10xl py-2">
        <div className="border shadow-xl p-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Email Templates</h2>
            <button
              title="Add Email Template"
              onClick={() => router.push('/admin/emailtemplate/add')}
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
              data={emailTemplates}
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
}
