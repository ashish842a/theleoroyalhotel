"use client";

import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaWifi, FaSnowflake, FaTv, FaCoffee, FaConciergeBell, FaStar, FaUserFriends } from 'react-icons/fa';

const RoomDetails = () => {
    const { id } = useParams();
    const [room, setRoom] = useState<any>(null);
    const [bookingData, setBookingData] = useState({
        checkInDate: '',
        checkOutDate: '',
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        purpose: '',
        specialRequest: '',
        guests: [] as any[],
    });
    const [numGuests, setNumGuests] = useState(1);
    const [user, setUser] = useState<any>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const res = await api.get(`/rooms/${id}`);
                setRoom(res.data);
            } catch (err) {
                console.log("Error fetching room:", err);
                setRoom({ _error: true });
            }
        };
        if (id) fetchRoom();

        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));

    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setBookingData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleNumGuestsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const count = parseInt(e.target.value);
        setNumGuests(count);
        // Resize guests array
        setBookingData(prev => {
            const newGuests = [...prev.guests];
            if (count > newGuests.length) {
                // Add empty slots
                for (let i = newGuests.length; i < count; i++) {
                    newGuests.push({ name: '', age: '', gender: 'Male' });
                }
            } else {
                // Trim
                newGuests.length = count;
            }
            return { ...prev, guests: newGuests };
        });
    };

    const handleGuestChange = (index: number, field: string, value: string) => {
        setBookingData(prev => {
            const newGuests = [...prev.guests];
            if (!newGuests[index]) newGuests[index] = { name: '', age: '', gender: 'Male' };
            newGuests[index] = { ...newGuests[index], [field]: value };
            return { ...prev, guests: newGuests };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...bookingData,
                bookingType: 'room',
                room: id !== '1' && id !== '2' ? id : undefined,
                guestDetails: user ? undefined : {
                    name: bookingData.guestName,
                    email: bookingData.guestEmail,
                    phone: bookingData.guestPhone
                },
                guests: bookingData.guests,
                specialRequest: (id === '1' || id === '2' ? `Booked Dummy Room ID ${id}. ` : '') + bookingData.specialRequest
            };

            await api.post('/bookings', payload);
            setSuccess(true);
            setTimeout(() => router.push('/dashboard'), 2000);
        } catch (err) {
            console.log(err);
            alert("Booking failed. Please try again.");
        }
    };

    if (!room) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    if (room._error) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center px-4">
            <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">Room Not Found</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">We could not load this room's details. It might have been removed.</p>
            <Link href="/rooms" className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-blue-700 transition-colors">
                Back to All Rooms
            </Link>
        </div>
    );

    const getImageSrc = (images?: string[]) => {
        if (!images || images.length === 0 || !images[0]) return "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
        const src = images[0];
        if (src.startsWith('http') || src.startsWith('/') || src.startsWith('data:')) return src;
        return "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-2">{room.name}</h1>
                    <div className="flex items-center gap-2 text-amber-500 text-sm">
                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                        <span className="text-gray-500 dark:text-gray-400 ml-2 font-medium">5.0 (24 Reviews)</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column - Image & Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Main Image */}
                        <div className="rounded-2xl overflow-hidden shadow-2xl relative h-[400px] md:h-[500px]">
                            <Image
                                src={getImageSrc(room.images)}
                                alt={room.name || "Room Image"}
                                fill
                                className="object-cover transform hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{room.price}</span>
                                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">/night</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4">About this Suite</h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg font-light">{room.description}</p>
                        </div>

                        {/* Amenities */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6">Premium Amenities</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {room.amenities?.map((am: string, i: number) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                                        <div className="text-blue-500">
                                            {am.toLowerCase().includes('wifi') && <FaWifi />}
                                            {am.toLowerCase().includes('ac') && <FaSnowflake />}
                                            {am.toLowerCase().includes('desk') && <FaTv />} {/* Fallback icon */}
                                            {/* Add more icon mappings as needed */}
                                            {!am.toLowerCase().match(/(wifi|ac|desk)/) && <FaConciergeBell />}
                                        </div>
                                        <span className="font-medium">{am}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Booking Form */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-800">
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Reserve Your Stay</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Best price guaranteed</p>
                            </div>

                            {success ? (
                                <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-6 rounded-xl text-center border border-green-200 dark:border-green-800">
                                    <p className="font-bold text-lg mb-2">Booking Confirmed!</p>
                                    <p className="text-sm">Redirecting to your dashboard...</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Number of Guests</label>
                                        <div className="relative">
                                            <FaUserFriends className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <select
                                                value={numGuests}
                                                onChange={handleNumGuestsChange}
                                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border-none text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                                            >
                                                {[...Array(room?.capacity || 4)].map((_, i) => (
                                                    <option key={i + 1} value={i + 1}>{i + 1} Guest{i > 0 ? 's' : ''}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Dynamic Guest Fields */}
                                    <div className="space-y-4 max-h-60 overflow-y-auto pr-1 customize-scrollbar">
                                        {[...Array(numGuests)].map((_, index) => (
                                            <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <p className="text-xs font-bold text-gray-500 mb-2">Guest {index + 1} Details</p>
                                                <div className="grid grid-cols-1 gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Full Name"
                                                        value={bookingData.guests[index]?.name || ''}
                                                        onChange={(e) => handleGuestChange(index, 'name', e.target.value)}
                                                        className="w-full p-2 text-sm rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-1 focus:ring-blue-500"
                                                        required
                                                    />
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <input
                                                            type="number"
                                                            placeholder="Age"
                                                            value={bookingData.guests[index]?.age || ''}
                                                            onChange={(e) => handleGuestChange(index, 'age', e.target.value)}
                                                            className="w-full p-2 text-sm rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-1 focus:ring-blue-500"
                                                            required
                                                        />
                                                        <select
                                                            value={bookingData.guests[index]?.gender || 'Male'}
                                                            onChange={(e) => handleGuestChange(index, 'gender', e.target.value)}
                                                            className="w-full p-2 text-sm rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-1 focus:ring-blue-500"
                                                        >
                                                            <option value="Male">Male</option>
                                                            <option value="Female">Female</option>
                                                            <option value="Other">Other</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {!user && (
                                        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                            <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Guest Details</p>
                                            <input type="text" name="guestName" placeholder="Full Name" onChange={handleChange} required className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border-none text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400" />
                                            <input type="email" name="guestEmail" placeholder="Email Address" onChange={handleChange} required className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border-none text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400" />
                                            <input type="tel" name="guestPhone" placeholder="Phone Number" onChange={handleChange} required className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border-none text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400" />
                                        </div>
                                    )}

                                    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Stay Dates</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1 ml-1">Check-in</label>
                                                <input type="date" name="checkInDate" onChange={handleChange} required className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border-none text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all text-sm dark:[color-scheme:dark]" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1 ml-1">Check-out</label>
                                                <input type="date" name="checkOutDate" onChange={handleChange} required className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border-none text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all text-sm dark:[color-scheme:dark]" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Preferences</p>
                                        <input type="text" name="purpose" placeholder="Purpose of Visit (e.g., Vacation)" onChange={handleChange} className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border-none text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400" />
                                        <textarea name="specialRequest" placeholder="Special Requests (e.g., Late check-in)" onChange={handleChange} className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border-none text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400 h-24 resize-none" />
                                    </div>

                                    <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 mt-6">
                                        Confirm Booking
                                    </button>
                                    <p className="text-xs text-center text-gray-400 mt-4">No payment required today</p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetails;
