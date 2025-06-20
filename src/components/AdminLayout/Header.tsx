
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User, Key, LogOut, ChevronDown } from 'lucide-react';
import { logout } from '@/lib/auth';
const Header = () => {
  const navigate = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout()
    navigate.push('/admin');
  };
  const handleProfile = () => {
    navigate.push('/admin/profile');
    setDropdownOpen(false);
  };

  const handleChangePassword = () => {
    navigate.push('/admin/profile/changepassword');
    setDropdownOpen(false);
  };

  return (
    <header style={{ backgroundColor: '#293042' }} className="text-white shadow-lg ">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold"></h1>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-3 hover:bg-white hover:bg-opacity-10 rounded-lg px-3 py-2 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
            <span className="font-medium">Admin</span>
            <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
              {/* <button
                onClick={handleProfile}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <User size={16} />
                <span>Profile</span>
              </button>
              <button
                onClick={handleChangePassword}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <Key size={16} />
                <span>Change Password</span>
              </button> */}
              {/* <hr className="my-1" /> */}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
