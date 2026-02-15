"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaBars, FaTachometerAlt, FaBook, FaBed, FaBuilding, FaUtensils, FaUsers } from 'react-icons/fa';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Close sidebar on route change (mobile)
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex overflow-hidden relative">
            {/* Mobile Sidebar Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed left-0 top-0 h-full bg-[#1a1c23] text-white transition-all duration-300 ease-in-out z-50 shadow-2xl flex flex-col
                ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 md:translate-x-0 md:w-20'}
            `}>
                <div className="h-20 flex items-center justify-between px-6 border-b border-gray-800">
                    <span className={`font-bold text-lg tracking-wide text-gray-100 transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 md:hidden'}`}>
                        Admin
                    </span>
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors focus:outline-none"
                    >
                        {isSidebarOpen ? <FaBars size={20} /> : <FaBars size={24} className="mx-auto" />}
                    </button>
                </div>

                <div className="flex-1 py-6 overflow-y-auto custom-scrollbar">
                    <ul className="space-y-2 px-3">
                        <NavItem href="/admin/dashboard" icon={FaTachometerAlt} label="Dashboard" isOpen={isSidebarOpen} />
                        <NavItem href="/admin/bookings" icon={FaBook} label="Bookings" isOpen={isSidebarOpen} />
                        <NavItem href="/admin/rooms" icon={FaBed} label="Rooms" isOpen={isSidebarOpen} />
                        <NavItem href="/admin/halls" icon={FaBuilding} label="Banquet Halls" isOpen={isSidebarOpen} />
                        <NavItem href="/admin/food" icon={FaUtensils} label="Restaurant" isOpen={isSidebarOpen} />
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out 
                ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'} ml-0
            `}>
                <div className="flex-1 p-4 md:p-8 overflow-x-auto overflow-y-auto h-screen bg-gray-100 pt-20 md:pt-8">
                    {/* Mobile Toggle Button (Visible only when sidebar is closed on mobile) */}
                    {!isSidebarOpen && (
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="md:hidden fixed top-4 left-4 z-30 p-2 bg-white rounded-md shadow-md text-gray-700"
                        >
                            <FaBars size={20} />
                        </button>
                    )}
                    {children}
                </div>
            </div>
        </div>
    );
}

// Helper Component for consistency
const NavItem = ({ href, icon: Icon, label, isOpen }: { href: string; icon: any; label: string; isOpen: boolean }) => (
    <li>
        <Link href={href} className={`flex items-center gap-4 py-3 px-3 rounded-xl transition-all duration-200 group ${isOpen ? 'justify-start' : 'justify-center'} hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30 text-gray-400 hover:text-white`}>
            <Icon size={20} className="min-w-[20px] transition-transform group-hover:scale-110" />
            <span className={`whitespace-nowrap font-medium transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute pointer-events-none'}`}>
                {label}
            </span>
        </Link>
    </li>
);
