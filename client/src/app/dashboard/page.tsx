"use client";

import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from '../../components/Footer';
import { FaSearch, FaFilter, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Dashboard = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('bookings');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [dateFilterType, setDateFilterType] = useState('checkin');
    const [currentPage, setCurrentPage] = useState(1);
    const bookingsPerPage = 5;
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            router.push('/login');
            return;
        }
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        const fetchBookings = async () => {
            try {
                const res = await api.get(`/bookings/user/${parsedUser._id}`);
                setBookings(res.data);
            } catch (err) {
                console.log("Error fetching user bookings");
            }
        };
        fetchBookings();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        router.push('/login');
    };

    // Filter and Search Logic
    const filteredBookings = bookings.filter(booking => {
        const matchesStatus = filterStatus === 'All' || booking.status === filterStatus;
        const matchesSearch = booking._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (booking.room?.name || booking.hall?.name || '').toLowerCase().includes(searchTerm.toLowerCase());

        let matchesDate = true;
        if (dateRange.start && dateRange.end) {
            let targetDate;
            if (dateFilterType === 'booking') {
                targetDate = new Date(booking.createdAt);
            } else {
                targetDate = new Date(booking.bookingType === 'room' ? booking.checkInDate : booking.bookingDate);
            }
            const start = new Date(dateRange.start);
            const end = new Date(dateRange.end);
            end.setHours(23, 59, 59, 999);
            matchesDate = targetDate >= start && targetDate <= end;
        }

        return matchesStatus && matchesSearch && matchesDate;
    });

    // Pagination Logic
    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
    const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    if (!user) return <div className="flex h-screen items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col md:flex-row transition-colors duration-300">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-white dark:bg-gray-900 shadow-xl z-10 md:h-screen sticky top-0 md:fixed border-r border-gray-100 dark:border-gray-800">
                <div className="p-8 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">My Account</h2>
                </div>
                <nav className="p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'bookings' ? 'bg-blue-50 dark:bg-gray-800 text-blue-700 dark:text-blue-400 font-semibold shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        My Bookings
                    </button>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'profile' ? 'bg-blue-50 dark:bg-gray-800 text-blue-700 dark:text-blue-400 font-semibold shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        Profile Settings
                    </button>
                    <div className="pt-8 mt-8 border-t border-gray-100 dark:border-gray-800">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                            Sign Out
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 transition-all flex flex-col min-h-screen">
                <div className="p-4 md:p-10 flex-grow">
                    {activeTab === 'bookings' && (
                        <div className="max-w-4xl mx-auto animate-fadeIn">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Booking History</h1>
                                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your upcoming and past stays</p>
                                </div>
                                <Link href="/rooms" className="bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap">
                                    + Book New Stay
                                </Link>
                            </div>

                            {/* Search and Filter */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="relative flex-1">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by ID or Room Name..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:bg-gray-800 dark:text-white"
                                    />
                                </div>
                                <div className="relative w-full sm:w-48">
                                    <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white dark:bg-gray-800 dark:text-white cursor-pointer"
                                    >
                                        <option value="All">All Statuses</option>
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Cancelled">Cancelled</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>

                            {/* Date Filter */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-600 dark:text-gray-300 font-medium whitespace-nowrap">Filter by:</span>
                                    <select
                                        value={dateFilterType}
                                        onChange={(e) => setDateFilterType(e.target.value)}
                                        className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                                    >
                                        <option value="checkin">Check-in Date</option>
                                        <option value="booking">Booking Date</option>
                                    </select>
                                </div>
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                    className="w-full sm:w-auto p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:[color-scheme:dark]"
                                />
                                <span className="text-gray-400">to</span>
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                    className="w-full sm:w-auto p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:[color-scheme:dark]"
                                />
                            </div>

                            {currentBookings.length === 0 ? (
                                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center">
                                    <div className="bg-blue-50 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No bookings found</h3>
                                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-8">
                                        {bookings.length === 0
                                            ? "You haven't made any reservations with us yet."
                                            : "No bookings match your current search filters."}
                                    </p>
                                    {bookings.length === 0 && (
                                        <Link href="/rooms" className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 hover:underline">
                                            Browse Rooms &rarr;
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {currentBookings.map((booking) => (
                                        <div key={booking._id} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col md:flex-row justify-between items-center hover:shadow-md transition-shadow group">
                                            <div className="flex items-center gap-6 w-full md:w-auto">
                                                <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${booking.bookingType === 'room' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'}`}>
                                                    {booking.bookingType === 'room' ? (
                                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                                                    ) : (
                                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{booking.room?.name || booking.hall?.name || `${booking.bookingType} Reservation`}</h3>
                                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide
                                                            ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                                                booking.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                                    'bg-red-100 text-red-700'}`}>
                                                            {booking.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                        {booking.bookingType === 'room'
                                                            ? `${new Date(booking.checkInDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${new Date(booking.checkOutDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`
                                                            : new Date(booking.bookingDate).toLocaleDateString(undefined, { dateStyle: 'long' })
                                                        }
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">Booking ID: <span className="font-mono">{booking._id}</span></p>
                                                </div>
                                            </div>
                                            <div className="mt-4 md:mt-0 text-right">
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{booking.totalAmount || booking.room?.price || booking.hall?.price || 0}</p>
                                                <p className="text-xs text-gray-400 uppercase font-semibold">Total Price</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Pagination Controls */}
                            {filteredBookings.length > bookingsPerPage && (
                                <div className="flex justify-center items-center mt-8 gap-2">
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`p-2 rounded-lg border ${currentPage === 1 ? 'border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-700 cursor-not-allowed' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                    >
                                        <FaChevronLeft />
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => paginate(i + 1)}
                                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`p-2 rounded-lg border ${currentPage === totalPages ? 'border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-700 cursor-not-allowed' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                    >
                                        <FaChevronRight />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="max-w-2xl mx-auto animate-fadeIn">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Profile Settings</h1>
                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-10 text-white relative">
                                    <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
                                        <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3 3-3 1.34-3 3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path></svg>
                                    </div>
                                    <div className="relative z-10 flex items-center gap-6">
                                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-blue-600 shadow-lg">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold">{user.name}</h2>
                                            <p className="opacity-90">{user.role === 'admin' ? 'Administrator' : 'Valued Guest'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Email Address</label>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                                <span className="text-gray-900 dark:text-gray-200 font-medium">{user.email}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Phone Number</label>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                                <span className="text-gray-900 dark:text-gray-200 font-medium">{user.phone || 'Not provided'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <Footer />
            </main>
        </div>
    );
};

export default Dashboard;
