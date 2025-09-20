import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import ClientSidebar from '@/components/layouts/ClientSidebar';
import ClientHeader from '@/components/layouts/ClientHeader';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const ClientLayout = () => {
    const isDesktop = useMediaQuery("(min-width: 1024px)");
    const [isSidebarOpen, setSidebarOpen] = useState(isDesktop);

    useEffect(() => {
        setSidebarOpen(isDesktop);
    }, [isDesktop]);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="page-wrapper">
            <ClientSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="main-content">
                <ClientHeader toggleSidebar={toggleSidebar} />
                <main className="flex-grow p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ClientLayout;