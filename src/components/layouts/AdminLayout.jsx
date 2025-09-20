import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '@/components/layouts/AdminSidebar';
import AdminHeader from '@/components/layouts/AdminHeader';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const AdminLayout = () => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [isSidebarOpen, setSidebarOpen] = useState(isDesktop);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  useEffect(() => {
    if (!isDesktop) {
      setSidebarOpen(false);
    }
  }, [location, isDesktop]);

  const toggleSidebar = () => {
    setSidebarOpen(prevState => !prevState);
  };

  return (
    <div className="page-wrapper">
      <AdminSidebar isOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="main-content">
        <AdminHeader toggleSidebar={toggleSidebar} />
        <main className="flex-grow p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;