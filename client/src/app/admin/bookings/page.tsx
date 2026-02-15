"use client";

import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import { FaCheck, FaTimes, FaTrash, FaSearch, FaFilter, FaCalendarAlt, FaUser, FaBed, FaCrown, FaUserTag, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ManageBookings = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [dateFilterType, setDateFilterType] = useState('checkin'); // 'checkin' or 'booking'
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Debounce search term to prevent excessive API calls
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1); // Reset to page 1 on search change
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filter, dateRange, dateFilterType]);

    useEffect(() => {
        fetchBookings();
    }, [currentPage, debouncedSearch, filter, dateRange, dateFilterType]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const params: any = {
                page: currentPage,
                limit: 8, // Bookings per page
                search: debouncedSearch,
                status: filter,
                dateType: dateFilterType
            };

            if (dateRange.start) params.startDate = dateRange.start;
            if (dateRange.end) params.endDate = dateRange.end;

            const res = await api.get('/bookings', { params });

            // Handle both old and new API response formats safely
            if (res.data.bookings) {
                setBookings(res.data.bookings);
                setTotalPages(res.data.totalPages);
            } else {
                // Fallback if API hasn't updated yet (though it should have)
                setBookings(res.data);
                setTotalPages(1);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        // Optimistic update
        setBookings(prev => prev.map(b => b._id === id ? { ...b, status: newStatus } : b));
        try {
            await api.put(`/bookings/${id}`, { status: newStatus });
        } catch (err) {
            console.log(err);
            alert("Failed to update status");
            fetchBookings(); // Revert on failure
        }
    };

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Confirmed': return 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20';
            case 'Pending': return 'bg-amber-100 text-amber-700 ring-1 ring-amber-600/20';
            case 'Cancelled': return 'bg-gray-100 text-gray-600 ring-1 ring-gray-600/10';
            case 'Rejected': return 'bg-rose-100 text-rose-700 ring-1 ring-rose-600/20';
            default: return 'bg-gray-100 text-gray-700 ring-1 ring-gray-600/10';
        }
    };

    return (
        <div className="p-4 md:p-6 max-w-[1920px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Booking Management</h1>
                    <p className="text-gray-500 mt-2 text-sm">Review and manage all reservation requests efficiently.</p>
                </div>

                <div className="flex flex-col xl:flex-row gap-4 w-full xl:w-auto">
                    {/* Search */}
                    <div className="relative group w-full xl:w-auto">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search user, ID, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full xl:w-72 shadow-sm transition-all"
                        />
                    </div>

                    {/* Filter */}
                    <div className="relative group flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
                        <div className="relative w-full md:w-auto">
                            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors hidden md:block" />
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="pl-3 md:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white w-full md:min-w-[150px]"
                            >
                                <option value="All">All Status</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Pending">Pending</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm w-full md:w-auto justify-between md:justify-start">
                            <select
                                value={dateFilterType}
                                onChange={(e) => setDateFilterType(e.target.value)}
                                className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer w-full md:w-auto"
                            >
                                <option value="checkin">Check-in Date</option>
                                <option value="booking">Booking Date</option>
                            </select>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
                            <div className="relative w-full md:w-auto">
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                    className="w-full md:w-auto pl-3 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:[color-scheme:dark]"
                                />
                            </div>
                            <span className="text-gray-500 font-medium hidden md:inline">to</span>
                            <span className="text-gray-500 font-medium md:hidden self-center">to</span>
                            <div className="relative w-full md:w-auto">
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                    className="w-full md:w-auto pl-3 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:[color-scheme:dark]"
                                />
                            </div>
                        </div>

                        {/* Reset Button */}
                        {(filter !== 'All' || searchTerm || dateRange.start || dateRange.end) && (
                            <button
                                onClick={() => {
                                    setFilter('All');
                                    setSearchTerm('');
                                    setDateRange({ start: '', end: '' });
                                    setDateFilterType('checkin');
                                    setCurrentPage(1);
                                }}
                                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 hover:text-red-500 transition-colors flex items-center gap-2 w-full md:w-auto justify-center"
                                title="Reset all filters"
                            >
                                <FaTimes />
                                <span className="">Reset</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ring-1 ring-black/5">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Booking ID</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-64">Guest Details</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-40">Type</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-64">Resource</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-40">Schedule</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Amount</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Status</th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                                            <p className="text-gray-500 animate-pulse">Loading bookings...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : bookings.length > 0 ? (
                                bookings.map((booking) => {
                                    const isMember = !!booking.user;
                                    const guestName = booking.user?.name || booking.guestDetails?.name || 'Unknown Guest';
                                    const guestEmail = booking.user?.email || booking.guestDetails?.email || 'No email provided';

                                    return (
                                        <tr key={booking._id} className="hover:bg-gray-50/80 transition-colors group">
                                            <td className="px-6 py-5 whitespace-nowrap align-top">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-mono font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                                                        #{booking._id.substring(booking._id.length - 6).toUpperCase()}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 mt-1">
                                                        {new Date(booking.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 align-top">
                                                <div className="flex items-start">
                                                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${isMember ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-gray-400 to-gray-500'}`}>
                                                        {guestName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-semibold text-gray-900 mb-0.5 max-w-[180px] break-words">{guestName}</div>
                                                        <div className="text-[11px] text-gray-500 mb-1 font-mono max-w-[180px] break-words">{guestEmail}</div>
                                                        {isMember ? (
                                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-100 text-indigo-800">
                                                                <FaCrown size={8} className="mr-1" /> Member
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-800">
                                                                Guest
                                                            </span>
                                                        )}
                                                        {booking.guests && booking.guests.length > 0 && (
                                                            <div className='mt-2 text-xs text-gray-500'>
                                                                <span className='font-semibold'>Guest List ({booking.guests.length})</span>
                                                                <ul className='list-disc list-inside mt-1'>
                                                                    {booking.guests.map((guest: any, index: number) => (
                                                                        <li key={index}>{guest.name} <span className='text-[10px]'>({guest.age}, {guest.gender})</span></li>
                                                                    ))}

                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap align-top">
                                                <div className="flex items-center text-sm text-gray-700">
                                                    {booking.bookingType === 'room' ? <FaBed className="mr-2 text-blue-500" /> : <FaCalendarAlt className="mr-2 text-orange-500" />}
                                                    <span className="capitalize font-medium">{booking.bookingType}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap align-top">
                                                <div className="text-sm font-medium text-gray-900 max-w-[200px] truncate" title={booking.room?.name || booking.hall?.name || 'N/A'}>
                                                    {booking.room?.name || booking.hall?.name || (booking.bookingType === 'restaurant' ? 'Table Reservation' : 'N/A')}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    ID: {booking.room?._id || booking.hall?._id || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap align-top">
                                                <div className="flex flex-col text-sm text-gray-600">
                                                    <div className="flex items-center mb-1">
                                                        <span className="text-[10px] uppercase font-bold text-gray-400 w-8">IN</span>
                                                        <span className="font-medium">
                                                            {booking.bookingType === 'room'
                                                                ? new Date(booking.checkInDate).toLocaleDateString()
                                                                : new Date(booking.bookingDate).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    {booking.bookingType === 'room' && (
                                                        <div className="flex items-center">
                                                            <span className="text-[10px] uppercase font-bold text-gray-400 w-8">OUT</span>
                                                            <span className="font-medium">{new Date(booking.checkOutDate).toLocaleDateString()}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap align-top">
                                                <div className="text-sm font-bold text-gray-900">
                                                    ₹{(booking.totalAmount || 0).toLocaleString()}
                                                </div>
                                                <div className="text-[10px] text-gray-500 uppercase">Total</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap align-top">
                                                <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${getStatusColor(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-top">
                                                <div className="flex items-center justify-end gap-2">
                                                    {booking.status === 'Pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleStatusChange(booking._id, 'Confirmed')}
                                                                className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors shadow-sm"
                                                                title="Confirm"
                                                            >
                                                                <FaCheck size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusChange(booking._id, 'Rejected')}
                                                                className="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors shadow-sm"
                                                                title="Reject"
                                                            >
                                                                <FaTimes size={14} />
                                                            </button>
                                                        </>
                                                    )}
                                                    {booking.status === 'Confirmed' && (
                                                        <button
                                                            onClick={() => handleStatusChange(booking._id, 'Cancelled')}
                                                            className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                                            title="Cancel Booking"
                                                        >
                                                            <FaTimes size={14} />
                                                        </button>
                                                    )}
                                                    <button className="p-1.5 bg-gray-50 text-gray-400 rounded-lg hover:text-red-500 hover:bg-red-50 transition-colors ml-1">
                                                        <FaTrash size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500 bg-gray-50/30">
                                        <div className="flex flex-col items-center justify-center">
                                            <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                                            <p className="text-base font-medium text-gray-900">No bookings found</p>
                                            <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden">
                    {loading ? (
                        <div className="p-12 text-center text-gray-500">
                            <div className="flex flex-col items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                                <p className="text-gray-500 animate-pulse">Loading bookings...</p>
                            </div>
                        </div>
                    ) : bookings.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                            {bookings.map((booking) => {
                                const isMember = !!booking.user;
                                const guestName = booking.user?.name || booking.guestDetails?.name || 'Unknown Guest';
                                const guestEmail = booking.user?.email || booking.guestDetails?.email || 'No email provided';

                                return (
                                    <div key={booking._id} className="p-4 space-y-4 hover:bg-gray-50 transition-colors">
                                        {/* Header: ID, Date, Status */}
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-xs font-mono font-medium text-gray-500 block">
                                                    #{booking._id.substring(booking._id.length - 6).toUpperCase()}
                                                </span>
                                                <div className="text-[10px] text-gray-400">
                                                    {new Date(booking.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${getStatusColor(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </div>

                                        {/* Guest Info */}
                                        <div className="flex items-start">
                                            <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${isMember ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-gray-400 to-gray-500'}`}>
                                                {guestName.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-semibold text-gray-900">{guestName}</div>
                                                <div className="text-xs text-gray-500">{guestEmail}</div>
                                                {isMember && (
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-100 text-indigo-800 mt-1">
                                                        <FaCrown size={8} className="mr-1" /> Member
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Details Grid */}
                                        <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            <div>
                                                <div className="text-xs text-gray-500 mb-1">Type</div>
                                                <div className="font-medium flex items-center">
                                                    {booking.bookingType === 'room' ? <FaBed className="mr-1.5 text-blue-500 text-xs" /> : <FaCalendarAlt className="mr-1.5 text-orange-500 text-xs" />}
                                                    <span className="capitalize">{booking.bookingType}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 mb-1">Amount</div>
                                                <div className="font-bold text-gray-900">₹{(booking.totalAmount || 0).toLocaleString()}</div>
                                            </div>
                                            <div className="col-span-2">
                                                <div className="text-xs text-gray-500 mb-1">Resource</div>
                                                <div className="font-medium text-gray-900 truncate">
                                                    {booking.room?.name || booking.hall?.name || (booking.bookingType === 'restaurant' ? 'Table Reservation' : 'N/A')}
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <div className="text-xs text-gray-500 mb-1">Schedule</div>
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex justify-between">
                                                        <span className="text-[10px] font-bold text-gray-400">IN</span>
                                                        <span className="font-medium text-xs">
                                                            {booking.bookingType === 'room'
                                                                ? new Date(booking.checkInDate).toLocaleDateString()
                                                                : new Date(booking.bookingDate).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    {booking.bookingType === 'room' && (
                                                        <div className="flex justify-between">
                                                            <span className="text-[10px] font-bold text-gray-400">OUT</span>
                                                            <span className="font-medium text-xs">{new Date(booking.checkOutDate).toLocaleDateString()}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                                            {booking.status === 'Pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusChange(booking._id, 'Confirmed')}
                                                        className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors shadow-sm flex items-center justify-center gap-2 text-sm font-medium"
                                                    >
                                                        <FaCheck size={14} /> Confirm
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(booking._id, 'Rejected')}
                                                        className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors shadow-sm flex items-center justify-center gap-2 text-sm font-medium"
                                                    >
                                                        <FaTimes size={14} /> Reject
                                                    </button>
                                                </>
                                            )}
                                            {booking.status === 'Confirmed' && (
                                                <button
                                                    onClick={() => handleStatusChange(booking._id, 'Cancelled')}
                                                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                                                >
                                                    <FaTimes size={14} /> Cancel
                                                </button>
                                            )}
                                            <button className="px-3 py-2 bg-gray-50 text-gray-400 rounded-lg hover:text-red-500 hover:bg-red-50 transition-colors">
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-gray-500 bg-gray-50/30">
                            <div className="flex flex-col items-center justify-center">
                                <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                                <p className="text-base font-medium text-gray-900">No bookings found</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>


            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-6 gap-2">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border ${currentPage === 1 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                >
                    <FaChevronLeft />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => paginate(i + 1)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg border ${currentPage === totalPages ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                >
                    <FaChevronRight />
                </button>
            </div>
        </div >
    );
};

export default ManageBookings;
