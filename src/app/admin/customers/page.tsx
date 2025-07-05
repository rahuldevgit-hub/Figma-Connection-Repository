'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Search, RotateCcw, Edit, Trash2, Plus, Eye, ToggleRight, ToggleLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getAllCustomers, deleteCustomer, updateStatusCustomer } from '@/services/customerService';
import Swal from 'sweetalert2';
import { formatDate } from '../../../lib/date';
const DataTable = dynamic(() => import('react-data-table-component'), { ssr: false });

const CustomersPage = () => {
  const router = useRouter();
  const [filters, setFilters] = useState({ name: '', mobile: '' });
  const [filteredData, setFilteredData] = useState([]);
  const [customersData, setcustomersData] = useState([]);

  useEffect(() => {
     // Fetch all customers from API
    const fetchData = async () => {
      const res = await getAllCustomers();
      const data = res.result || [];
      setcustomersData(data);
      setFilteredData(data);
    };

    fetchData();
  }, []);
// Function to handle search filter logic based on name and mobile input
  const handleSearch = () => {
    const filtered = customersData.filter(customer => {
      const nameMatch = !filters.name || customer.name.toLowerCase().includes(filters.name.toLowerCase());
      const mobileMatch = !filters.mobile || customer.mobile.includes(filters.mobile);
      return nameMatch && mobileMatch;
    });
    setFilteredData(filtered);
  };

// Function to reset filters and show full customer list again
  const handleReset = () => {
    setFilters({ name: '', mobile: '' });
    setFilteredData(customersData);
  };

  // Function to delete a customer by ID with confirmation
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure',
      text: 'You won’t be able to delete this customer ?  ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#506ae5',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteCustomer(id);
        Swal.fire('Deleted!', 'Customer has been deleted.', 'success');
        // Refresh the customer list after deletion
        const refreshed = await getAllCustomers();
        setcustomersData(refreshed.result || []);
        setFilteredData(refreshed.result || []);
      } catch (err) {
        Swal.fire('Error!', 'Failed to delete customer.', 'error');
      }
    }
  };

// Function to toggle the status (active/inactive) of a customer with confirmation
  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    const result = await Swal.fire({
      title: 'Are you sure',
      text: `You want to change status to ${newStatus}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, change it!',
    });

    if (result.isConfirmed) {
      try {
        await updateStatusCustomer(id, { status: newStatus });
        Swal.fire('Updated!', 'Customer status updated successfully.', 'success');
         const refreshed = await getAllCustomers();
        setcustomersData(refreshed.result || []);
        setFilteredData(refreshed.result || []);
      } catch (error) {
        Swal.fire('Error', 'Failed to update status', 'error');
      }
    }
  };

 const columns = [
  {
    name: 'S.No',
    selector: (row, index) => index + 1,
    width: '6%' // Small column for serial number
  },
  {
    name: 'Name',
    sortable: true,
    width: '19%',
    cell: row => (
      <div className="flex items-center space-x-3">
        {row.profile ? (
          <img
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/profile/${row.profile}`}
            alt={row.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <></>
        )}
        <span className="text-gray-800">{row.name}</span>
      </div>
    )
  },
  {
    name: 'Mobile No.',    sortable: true,

    selector: row => row.mobile,
    width: '10%'
  },
  {
    name: 'Email',
     sortable: true,
    selector: row => row.email,
    width: '20%'
  },
  {
    name: 'DOB',
     sortable: true,
    selector: row => row.dob,
    width: '10%'
  },
  {
    name: 'Gender',
    selector: row => row.gender,
    width: '7%'
  },
  {
    name: 'Status',
    width: '8%',
    cell: row => (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          row.status?.toLowerCase() === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        {row.status}
      </span>
    )
  },
  {
    name: 'Created',
     cell: row => formatDate(row.dob),
    width: '10%'
  },
  {
    name: 'Action',
    width: '10%',
    cell: row => (
      <div className="flex space-x-2">
        <div
          className="cursor-pointer"
          onClick={() => handleStatusChange(row.id, row.status)}
          title={`Click to mark as ${row.status === 'active' ? 'inactive' : 'active'}`}
        >
          {row.status === 'active' ? (
            <ToggleRight className="text-green-500" size={20} />
          ) : (
            <ToggleLeft className="text-red-500" size={20} />
          )}
        </div>
        <button
          onClick={() => router.push(`/admin/customers/edit?id=${row.id}`)}
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
    )
  }
];


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-medium text-gray-900">Customers Manager</h1>
        <button
          onClick={() => router.push('/admin/customers/add')}
          className="flex items-center px-4 py-2 bg-[#506ae5] text-white rounded-md hover:opacity-90"
        >
          <Plus size={16} className="mr-2" />
          Add Customer
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={filters.name}
              onChange={e => setFilters({ ...filters, name: e.target.value })}
  className="w-full px-3 py-2 border border-gray-300 rounded-md 
             focus:outline-none focus:ring-0 focus:border-2 text-black "
             placeholder="Enter name"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Mobile Number</label>
            <input
              type="text"

              onChange={(e) => {
                const value = e.target.value;
                // Allow only digits and limit to 10 characters
                if (/^\d{0,10}$/.test(value)) {
                  setFilters({ ...filters, mobile: e.target.value })
                }
              }}
              value={filters.mobile}
               className="w-full px-3 py-2 border border-gray-300 rounded-md 
             focus:outline-none focus:ring-0 focus:border-2 text-black "
              placeholder="Enter mobile number"
            />
          </div>
          <button
            onClick={handleSearch}
            className="flex items-center justify-center px-4 py-2 bg-[#506ae5] text-white rounded-md hover:opacity-90"
          >
            <Search size={16} className="mr-2" />
            Search
          </button>
          <button
            onClick={handleReset}
            className="flex items-center justify-center px-4 py-2 bg-[#ebaa3b] text-white rounded-md hover:opacity-90"
          >
            <RotateCcw size={16} className="mr-2" />
            Reset
          </button>
        </div>
      </div>

      {/* Data Table */}
 <div className="bg-white p-4 rounded-lg shadow-sm border">
  <DataTable
    columns={columns}
    data={filteredData}
    pagination
    highlightOnHover
    responsive
    customStyles={{
      headCells: {
        style: {
          fontWeight: 'bold',
          fontSize: '14px',
          borderRight: '1px solid #e5e7eb', // tailwind gray-200
        }
      },
      cells: {
        style: {
          borderRight: '1px solid #e5e7eb', // column border
        }
      },
      rows: {
        style: {
          borderBottom: '1px solid #f1f5f9', // optional: row border
        }
      }
    }}
  />
</div>

    </div>
  );
};

export default CustomersPage;
