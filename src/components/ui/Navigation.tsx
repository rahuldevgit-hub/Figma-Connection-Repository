'use client';

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation"; // ✅ NEW
import {
  LayoutDashboard,
  Users,
  ShieldHalf,
  FileText,
  Mail,
  User,
  Newspaper,
  List,
  PieChart,
  Search,
  BookText,
  ChevronDown,
  CircleUserRound,
} from "lucide-react";

const Navigation = () => {
  const pathname = usePathname(); // ✅ Get current route
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Extract top-level key from pathname
  const getActiveMenuFromPath = () => {
    if (pathname.includes("/admin/emailtemplate")) return "emails";
    if (pathname.includes("/admin/dashboard")) return "dashboard";
    if (pathname.includes("/admin/quotes")) return "quotes";
    if (pathname.includes("/admin/tender")) return "tenders";
    if (pathname.includes("/admin/auctions")) return "auctions";
    if (pathname.includes("/admin/listings")) return "listings";
    if (pathname.includes("/admin/contracts")) return "contracts";
    if (pathname.includes("/admin/newsletters")) return "newsletters";
    if (pathname.includes("/admin/payments")) return "payments";

    if (pathname.includes("/admin/users")) return "users";
    if (pathname.includes("/admin/config")) return "config";
    if (pathname.includes("/admin/seo")) return "seo";

    return null;
  };

  const activeMenu = getActiveMenuFromPath();

  const baseClasses =
    "flex items-center space-x-2 text-xs px-2 py-1 rounded-md transition-colors duration-200";

  const getMenuClasses = (menu: string) =>
    `${baseClasses} ${
      activeMenu === menu ? "bg-blue-500 text-white rounded-[8px]" : "text-blue-500 hover:underline"
    }`;

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} />, href: "/admin/dashboard" },
    { key: "quotes", label: "Quotes", icon: <Users size={16} />, href: "/admin/quotes" },
    { key: "tenders", label: "Tenders", icon: <BookText size={16} />, href: "/admin/tender" },
    { key: "auctions", label: "Auctions", icon: <ShieldHalf size={16} />, href: "/admin/auctions" },
    { key: "listings", label: "Listings", icon: <User size={16} />, href: "/admin/listings" },
    { key: "emails", label: "Emails", icon: <Mail size={16} />, href: "/admin/emailtemplate" },
    { key: "contracts", label: "Contracts", icon: <FileText size={16} />, href: "/admin/contracts" },
    { key: "newsletters", label: "News Letters", icon: <Newspaper size={16} />, href: "/admin/newsletters" },
    { key: "payments", label: "Payments", icon: <List size={16} />, href: "/admin/payments" },
  ];

  const dropdowns = {
    users: {
      icon: <CircleUserRound size={16} />,
      items: [
        { label: "Vendor Manager", href: "/admin/users/vendors" },
        { label: "Buyer Manager", href: "/admin/users/buyers" },
        { label: "VRT User", href: "/admin/users/vrt" },
        { label: "Compliance User", href: "/admin/users/compliance" },
        { label: "Encryption Key Holder", href: "/admin/users/encryption" },
        { label: "Evaluators", href: "/admin/users/evaluators" },
        { label: "Approval Manager", href: "/admin/users/approvals" },
        { label: "Contract Approve Manager", href: "/admin/users/contracts" },
      ],
    },
    config: {
      icon: <PieChart size={16} />,
      items: [
        { label: "Country Manager", href: "/admin/config/countries" },
        { label: "Category Manager", href: "/admin/config/categories" },
        { label: "Subcategory Manager", href: "/admin/config/subcategories" },
        { label: "Incoterms Manager", href: "/admin/config/incoterms" },
        { label: "Static Pages Manager", href: "/admin/config/static-pages" },
        { label: "FAQs Manager", href: "/admin/config/faqs" },
        { label: "Payment Terms Manager", href: "/admin/config/payment-terms" },
        { label: "Requester (Department)", href: "/admin/config/requesters/department" },
        { label: "Requester (Name)", href: "/admin/config/requesters/name" },
        { label: "Delivery Location", href: "/admin/config/delivery-location" },
        { label: "Classification Manager", href: "/admin/config/classifications" },
        { label: "Unit of Measure Manager", href: "/admin/config/uom" },
        { label: "Help Video Manager", href: "/admin/config/help-videos" },
      ],
    },
    seo: {
      icon: <Search size={16} />,
      items: [
        { label: "Add SEO", href: "/admin/seo/add" },
        { label: "View SEO", href: "/admin/seo" },
      ],
    },
  };

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="flex flex-wrap items-center justify-between p-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Static menu items */}
          {menuItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={getMenuClasses(item.key)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}

          {/* Dropdown menus */}
          {Object.entries(dropdowns).map(([key, { icon, items }]) => (
            <div key={key} className="relative">
              <button onClick={() => setActiveDropdown(key)} className={getMenuClasses(key)}>
                {icon}
                <span className="capitalize">{key}</span>
                <ChevronDown size={16} />
              </button>
              {activeDropdown === key && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-50 text-gray-900">
                  <div className="py-2">
                    {items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="block px-4 py-2 text-xs hover:bg-blue-500 hover:text-white"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
