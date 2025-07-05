'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
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
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Detect click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setActiveDropdown(null);
  }, [pathname]);

  // Get active menu for highlighting
  const getActiveMenuFromPath = () => {
    if (pathname.includes("/dashboard")) return "dashboard";
    if (pathname.includes("/users")) return "users";
    if (pathname.includes("/quotes")) return "quotes";
    if (pathname.includes("/tender")) return "tender";
    if (pathname.includes("/auctions")) return "auctions";
    if (pathname.includes("/listings")) return "listings";
    if (pathname.includes("/emailtemplate")) return "emailtemplate";
    if (pathname.includes("/contracts")) return "contracts";
    if (pathname.includes("/newsletters")) return "newsletters";
    if (pathname.includes("/payments")) return "payments";

    if (
      pathname.includes("/admin/category") ||
      pathname.includes("/admin/subcategory") ||
      pathname.includes("/admin/incoterm") ||
      pathname.includes("/admin/units") ||
      pathname.includes("/admin/country") ||
      pathname.includes("/admin/payment") ||
      pathname.includes("/admin/unitofmeasure") ||
      pathname.includes("/admin/static") ||
      pathname.includes("/admin/faqs")
    )
      return "config";

    if (pathname.includes("/seo")) return "seo";

    return null;
  };

  const activeMenu = getActiveMenuFromPath();

  const baseClasses =
    "flex items-center space-x-2 text-xs px-2 py-1 rounded-md transition-all";
  const getMenuClasses = (menu: string) =>
    `${baseClasses} ${activeMenu === menu
      ? "bg-blue-500 text-white !rounded-[8px]"
      : "text-blue-500 hover:underline"
    }`;

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="flex flex-wrap items-center justify-between p-4">
        <div className="flex flex-wrap items-center gap-2 text-xs" ref={dropdownRef}>
          <Link href="/admin/dashboard" className={getMenuClasses("dashboard")}>
            <LayoutDashboard size={16} className="text-inherit" />
            <span>Dashboard</span>
          </Link>
          <div className="relative">
            <button onClick={() => toggleDropdown("users")} className={getMenuClasses("users")}>
              <CircleUserRound size={16} className="text-inherit" />
              <span>Users</span>
              <ChevronDown size={16} className="text-inherit" />
            </button>
            {activeDropdown === "users" && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-50">
                <div className="py-2 text-gray-900">
                  {[
                    "Vendor Manager",
                    "Buyer Manager",
                    "VRT User",
                    "Compliance User",
                    "Encryption Key Holder",
                    "Evaluators",
                    "Approval Manager",
                    "Contract Approve Manager",
                  ].map((item) => (
                    <Link
                      key={item}
                      href={`/users/${item.toLowerCase().replace(/ /g, "-")}`}
                      className="block px-2 py-2 text-xs hover:bg-blue-500 hover:text-white"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div> 

          <Link href="/quotes" className={getMenuClasses("quotes")}>
            <Users size={16} className="text-inherit" />
            <span>Quotes</span>
          </Link>

          <Link href="/admin/tender" className={getMenuClasses("tender")}>
            <BookText size={16} className="text-inherit" />
            <span>Tenders</span>
          </Link>
          <Link href="/auctions" className={getMenuClasses("auctions")}>
            <ShieldHalf size={16} className="text-inherit" />
            <span>Auctions</span>
          </Link>

          <Link href="/listings" className={getMenuClasses("listings")}>
            <User size={16} className="text-inherit" />
            <span>Listings</span>
          </Link>
          <Link href="/admin/emailtemplate" className={getMenuClasses("emailtemplate")}>
            <Mail size={16} className="text-inherit" />
            <span>Emails</span>
          </Link>

          <Link href="/contracts" className={getMenuClasses("contracts")}>
            <FileText size={16} className="text-inherit" />
            <span>Contracts</span>
          </Link>

          <Link href="/newsletters" className={getMenuClasses("newsletters")}>
            <Newspaper size={16} className="text-inherit" />
            <span>News Letters</span>
          </Link>

          <Link href="/payments" className={getMenuClasses("payments")}>
            <List size={16} className="text-inherit" />
            <span>Payments</span>
          </Link>

          <div className="relative">
            <button onClick={() => toggleDropdown("config")} className={getMenuClasses("config")}>
              <PieChart size={16} className="text-inherit" />
              <span>Configuration</span>
              <ChevronDown size={16} className="text-inherit" />
            </button>
            {activeDropdown === "config" && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-50">
                <div className="py-2 text-gray-900">
                  {[
                    { name: "Country Manager", href: "/admin/country" },
                    { name: "Category Manager", href: "/admin/category" },
                    { name: "Subcategory Manager", href: "/admin/subcategory" },
                    { name: "Incoterms Manager", href: "/admin/incoterm" },
                    { name: "Static Pages Manager", href: "/admin/static" },
                    { name: "FAQs Manager", href: "/admin/faqs" },
                    { name: "Payment Terms Manager", href: "/admin/payment" },
                    { name: "Unit of Measure Manager", href: "/admin/unitofmeasure" },
                  ].map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`block px-4 py-2 text-xs ${isActive
                            ? "bg-blue-500 text-white rounded-md"
                            : "hover:bg-blue-500 hover:text-white"
                          }`}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button onClick={() => toggleDropdown("seo")} className={getMenuClasses("seo")}>
              <Search size={16} className="text-inherit" />
              <span>SEO</span>
              <ChevronDown size={16} className="text-inherit" />
            </button>
            {activeDropdown === "seo" && (
              <div className="absolute top-full left-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
                <div className="py-2 text-gray-900">
                  {["Add SEO", "View SEO"].map((item) => (
                    <Link
                      key={item}
                      href={`/seo/${item.toLowerCase().replace(/ /g, "-")}`}
                      className="block px-4 py-2 text-xs hover:bg-blue-500 hover:text-white"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
