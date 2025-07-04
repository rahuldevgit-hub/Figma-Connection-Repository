'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import {
  Edit, Trash2, Plus, ToggleRight, ToggleLeft, Search, RotateCcw,
  Calendar, CheckCircle, Bell, Mail, Info
} from 'lucide-react';
import Link from 'next/link';
import PaginatedDataTable from "@/components/PaginatedDataTablet";
import { Button } from "@/components/ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Pencil, Calendar as CalendarIcon,  Check, X , Search as SearchIcon } from "lucide-react";
import Swal from 'sweetalert2';
import {
  getAllTenders, updateStatusTender, deleteTender,
  createCalendarEvent, resendEmailToEvaluator, InvitationResendEmail
} from '@/services/tendersService';
import { formatDate } from '@/lib/date';
import {Label} from '@/components/ui/Label';
import {Input} from '@/components/ui/Input';
import toast from 'react-hot-toast';
import Image from 'next/image';
const DataTable = dynamic(() => import('react-data-table-component'), { ssr: false });
export default function EmailTemplateList() {
  const router = useRouter();
  const [tenderlist, setTendersLinst] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [searchCategory, setSearchCategory] = useState('');
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [searchFilters, setSearchFilters] = useState({
    reference: '',
    category: '',
    subcategory: '',
    fromDate: '',
    toDate: '',
  });

  const fetchTemplates = async (page, limit) => {
    setLoading(true);
    try {
      const res = await getAllTenders(page, limit, searchFilters);
      setTendersLinst(res.data || []);
      setTotalRows(res.total || 0);
      setTotalPages(res.totalPages || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates(page, limit);
  }, [page, limit]);

  const handlePerRowsChange = (newLimit, page) => {
    setLimit(newLimit);
    setPage(page);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You wont be able to delete this tender!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#506ae5',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        await deleteTender(id);
        Swal.fire('Deleted!', 'Tender has been deleted.', 'success');
        fetchTemplates(page, limit);
      } catch {
        Swal.fire('Error!', 'Failed to delete template.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    const isActivating = currentStatus === 'N';
    const newStatus = isActivating ? 'Y' : 'N';
    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `You want to ${isActivating ? 'activate' : 'deactivate'} this tender?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#506ae5',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, confirm',
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        await updateStatusTender(id, { status: newStatus });
        Swal.fire('Updated!', `Tender has been ${isActivating ? 'activated' : 'deactivated'}.`, 'success');
        fetchTemplates(page, limit);
      } catch {
        Swal.fire('Error!', 'Failed to change status.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      setPage(1);
      const res = await getAllTenders(1, limit, searchFilters);
      setTendersLinst(res.data || []);
      setTotalRows(res.total || 0);
      setTotalPages(res.totalPages || 0);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      const reset = { reference: '', category: '', subcategory: '', fromDate: '', toDate: '' };
      setSearchFilters(reset);
      setPage(1);
      const res = await getAllTenders(1, limit, reset);
      setTendersLinst(res.data || []);
      setTotalRows(res.total || 0);
      setTotalPages(res.totalPages || 0);
    } finally {
      setLoading(false);
    }
  };

  const handleCalendarClick = async (id, module) => {
    setLoading(true);
    try {
      await createCalendarEvent(id, module);
      toast.success('Calendar event created');
    } catch {
      toast.error('Failed to create calendar event');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmailToEvaluator = async (id) => {
    setLoading(true);
    try {
      await resendEmailToEvaluator(id);
      toast.success('Emails resent to all evaluators successfully');
    } catch {
      toast.error('Failed to resend emails to evaluators');
    } finally {
      setLoading(false);
    }
  };

  const handleInvitationResendEmail = async (id) => {
    setLoading(true);
    try {
      await InvitationResendEmail(id);
      toast.success('Emails resent to all suppliers and users successfully');
    } catch {
      toast.error('Failed to resend invitation emails');
    } finally {
      setLoading(false);
    }
  };


 const columns = [
  {
    name: 'S.No.',
    selector: (_: any, index: number) => (page - 1) * limit + index + 1,
    width: '5%',
  },
  {
    name: 'ID',
    cell: (row: any) => (
      <div>
        {row.genrateid}<br />
        {row.status !== 'Y' && (
          <img
            src="/assest/image/new5.gif"
            alt="Loading animation"
            className="w-5"
          />
        )}
      </div>
    ),
    sortable: true,
    width: '7%',
  },
  {
    name: 'Reference',
    selector: (row: any) => row.ref_id || row.reference,
    sortable: true,
    width: '10%',
  },
  {
    name: 'Title',
    selector: (row: any) => row.title,
    sortable: true,
    width: '10%',
  },
  {
    name: 'Encryption Keys',
    cell: (row: any) => (
      <div>
        <strong>Key-1 :</strong> {row.security_1}<br />
        <strong>Key-2 :</strong> {row.security_2}
      </div>
    ),
    width: '15%',
  },
  {
    name: 'Category',
    selector: (row: any) => row.category ? row.category.name : "N/A",
    sortable: true,
    width: '10%',
  },
  {
    name: 'Created Date',
    selector: (row: any) =>
      formatDate(row.createdAt, 'DD MMM YYYY | hh:mm A'),
    sortable: true,
    width: '12%',
  },
  {
    name: 'Date',
    cell: (row: any) => (
      <div>
        <strong>Close Date</strong>: {formatDate(row.tclose_date, 'DD MMM YYYY | hh:mm A')}<br />
        <strong>Award Date</strong>: {formatDate(row.topen_date, 'DD MMM YYYY | hh:mm A')}
      </div>
    ),
    sortable: true,
    width: '18%',
  },
  {
    name: 'Actions',
    width: '13%',
    cell: (row: any) => (
      <div className="flex space-x-2 items-center justify-center">
        <button onClick={() => handleStatusChange(row.id, row.status)} title="Toggle Status">
          {row.status === 'Y' ? (
            <ToggleRight className="text-green-500" size={20} />
          ) : (
            <ToggleLeft className="text-red-500" size={20} />
          )}
        </button>
        <button onClick={() => handleCalendarClick(row.id, 'T')} title="Calendar">
          <Calendar className="text-blue-500 hover:text-blue-700" size={18} />
        </button>
        <Link href={`/admin/tender/details/${row.id}`} title="View Tender Detail">
          <Info className="text-gray-500 hover:text-gray-700" size={18} />
        </Link>
        <button onClick={() => handleSendEmailToEvaluator(row.id)} title="Resend Evaluator Email">
          <Mail className="text-blue-600 hover:text-blue-800" size={18} />
        </button>
        <button onClick={() => handleInvitationResendEmail(row.id)} title="Resend Tender Invitation Email">
          <Mail className="text-blue-600 hover:text-blue-800" size={18} />
        </button>
        <button onClick={() => handleDelete(row.id)} title="Delete">
          <Trash2 className="text-red-600 hover:text-red-900" size={18} />
        </button>
      </div>
    ),
  },
];


  return (
  <div className="min-h-screen ">
          <main className="max-w-10xl  py-2">
            {/* Filter Section */}
            <div className='border  shadow-xl p-2'>
              <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-gray-800">Tenders List</h2>
       {/* <button
        
          className="p-2 rounded-[5px] bg-blue-500 text-black hover:bg-blue-700 "
        >
          <Plus className="h-5 w-5 text-white" />
        </button> */}
            </div>
        <div className="bg-white rounded-lg shadow-sm border py-4 px-4">
 <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
  {/* Reference Number */}
  <div>
    <Input
      id="reference"
      type="text"
      className="w-full h-10 text-black text-sm  border-gray-200 shadow-lg rounded-[5px]"
      placeholder="Reference Number"
      value={searchFilters.reference}
      onChange={(e) =>
        setSearchFilters({ ...searchFilters, reference: e.target.value })
      }
    />
  </div>

  {/* Category */}
  <div>
    <select
      id="category"
      className="w-full h-10 text-black text-sm border border-gray-200 rounded-[5px] px-3"
      value={searchFilters.category}
      onChange={(e) =>
        setSearchFilters({ ...searchFilters, category: e.target.value })
      }
    >
      <option value="">Select Category</option>
      <option value="Category 1">Category 1</option>
      <option value="Category 2">Category 2</option>
    </select>
  </div>

  {/* SubCategory */}
  <div>
    <select
      id="subcategory"
      className="w-full h-10 text-black  text-sm border border-gray-200 rounded-[5px] px-3"
      value={searchFilters.subcategory}
      onChange={(e) =>
        setSearchFilters({ ...searchFilters, subcategory: e.target.value })
      }
    >
      <option value="">Select SubCategory</option>
      <option value="SubCategory 1">SubCategory 1</option>
      <option value="SubCategory 2">SubCategory 2</option>
    </select>
  </div>

  {/* From Date */}
  <div>
    <Input
      id="fromDate"
      type="date"
      className="w-full text-black text-sm h-10 border-gray-200 shadow-lg rounded-[5px]"
      value={searchFilters.fromDate}
      onChange={(e) =>
        setSearchFilters({ ...searchFilters, fromDate: e.target.value })
      }
    />
  </div>

  {/* To Date */}
  <div>
    <Input
      id="toDate"
      type="date"
      className="w-full  text-black text-sm h-10 border-gray-200 shadow-lg rounded-[5px]"
      value={searchFilters.toDate}
      onChange={(e) =>
        setSearchFilters({ ...searchFilters, toDate: e.target.value })
      }
    />
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
  <PaginatedDataTable
    title="Tenders"
    columns={columns}
    data={tenderlist}
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
}
