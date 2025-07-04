'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/AdminLayout/Sidebar';
import Header from '@/components/AdminLayout/Header';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const handleToggle = () => {
    setCollapsed(prev => !prev);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Avoid rendering on server to prevent hydration mismatch
  if (!isClient) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-0">{children}</main>
      </div>
    </div>
  );
}
