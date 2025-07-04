"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, User } from "lucide-react";
import Navigation from "@/components/ui/Navigation";
import { logout } from '@/lib/auth'; 

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="bg-[#293042] text-xs p-4 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="/assest/image/logoWhite.png"
              className="h-12"
              alt="Logo"
            />
          </div>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 text-blue-600"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <span className="text-white outline-none hover:underline hover:decoration-white">
                John Doe
              </span>
              <ChevronDown size={16} className="text-white" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                <div className="py-2">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm hover:bg-blue-500 text-gray-900"
                  >
                    My Account
                  </a>
                  <a
                    href="#"
                    onClick={logout}
                    className="block px-4 py-2 text-sm hover:bg-blue-500 text-gray-900"
                  >
                    Logout
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <Navigation />
    </>
  );
};

export default Header;
