import React from 'react';
import {
  LayoutDashboard,
  Users, // For Active User Manager
  FileText, // For Quotes Manager and Tender Manager
  Gavel, // For Auction Manager
  ClipboardList, // For Listing Manager
  Mail, // For Manage Email Template
  FileSignature, // For Manage Contract Template
  Rss, // For News Letter (or Newspaper, if available)
  CreditCard, // For Payment Manager
  Settings, // For Configuration Manager
  Search, // For Seo Manager
  ChevronRight // To indicate a submenu, though your current structure doesn't support submenus
} from 'lucide-react';
        import Image from 'next/image';

import { useRouter, usePathname } from 'next/navigation';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { id: 'Customers', label: 'Customers', icon: Users, path: '/admin/customers' },

];

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const router = useRouter(); // Renamed to router for clarity
  const pathname = usePathname();

  const isActive = (path: string) => pathname.startsWith(path); // Use startsWith for broader active state

  return (
    <div style={{ backgroundColor: '#293042', width: '85px' }} className="text-white flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-4 flex items-center justify-center border-b border-gray-600">
        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">

<Image
            src="/assest/image/dashboard-logo.png"
  alt="eboxtenders"
  width={180}
  height={180}
  priority
/>

        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto scrollbar-hide ">
        <div className="">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.id}
                onClick={() => router.push(item.path)} // Use router.push
                className={`w-full border-b-[1px] border-gray-600 flex flex-col items-center py-3 px-2 text-xs transition-colors ${
                  active
                    ? 'bg-[#506ae5] text-white'
                    : 'text-gray-300 hover:bg-[#161a24] hover:text-white'
                }`}
                style={active ? { backgroundColor: '#506ae5' } : {}}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = ' #161a24 ';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Icon size={20} className="mb-1" />
                <span className="text-[10px] leading-tight text-center">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;