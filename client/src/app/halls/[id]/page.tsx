"use client";

import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaUserFriends, FaWifi, FaMicrophone, FaMusic, FaGlassCheers, FaStar } from 'react-icons/fa';

const HallDetails = () => {
    const { id } = useParams();
    const [hall, setHall] = useState<any>(null);
    const [bookingData, setBookingData] = useState({
        bookingDate: '',
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        purpose: '',
        specialRequest: '',
    });
    const [user, setUser] = useState<any>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchHall = async () => {
            try {
                const res = await api.get(`/halls/${id}`);
                setHall(res.data);
            } catch (err) {
                console.log("Error fetching hall");
                if (id === '1') setHall({ _id: '1', name: 'Grand Ballroom', description: 'Our magnificent Grand Ballroom is the perfect venue for weddings, galas, and large corporate events, featuring crystal chandeliers and state-of-the-art audio systems.', price: 25000, capacity: 500, images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'], amenities: ['Sound System', 'Projector', 'Catering'] });
            }
        };
        if (id) fetchHall();
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBookingData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...bookingData,
                bookingType: 'hall',
                hall: id,
                guestDetails: user ? undefined : {
                    name: bookingData.guestName,
                    email: bookingData.guestEmail,
                    phone: bookingData.guestPhone
                }
            };

            await api.post('/bookings', payload);
            setSuccess(true);
            setTimeout(() => router.push('/dashboard'), 2000);
        } catch (err) {
            console.log(err);
            alert("Booking failed. Please try again.");
        }
    };

    if (!hall) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-2">{hall.name}</h1>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-medium bg-white dark:bg-gray-800 px-4 py-1 rounded-full shadow-sm">
                            <FaUserFriends className="text-purple-500" />
                            Max Capacity: {hall.capacity} Guests
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 text-sm">
                            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column - Image & Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="rounded-2xl overflow-hidden shadow-2xl relative h-[400px] md:h-[500px]">
                            <Image
                                src={hall.images[0]}
                                alt={hall.name}
                                fill
                                className="object-cover transform hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">₹{hall.price}</span>
                                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">/day</span>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4">Venue Overview</h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg font-light">{hall.description}</p>
                        </div>

                        {/* Amenities */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6">Included Services</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {hall.amenities?.map((am: string, i: number) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                                        <div className="text-purple-500">
                                            {/* Generic icons since hall amenities vary */}
                                            <FaGlassCheers />
                                        </div>
                                        <span className="font-medium">{am}</span>
                                    </div>
                                ))}
                                {/* Hardcoded extras for premium feel */}
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                                    <FaMicrophone className="text-purple-500" /> <span className="font-medium">Audio System</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                                    <FaWifi className="text-purple-500" /> <span className="font-medium">Guest WiFi</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Booking Form */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-800">
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Book This Venue</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Professional event planning support included</p>
                            </div>

                            {success ? (
                                <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-6 rounded-xl text-center border border-green-200 dark:border-green-800">
                                    <p className="font-bold text-lg mb-2">Request Sent!</p>
                                    <p className="text-sm">Our events team will contact you shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {!user && (
                                        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                            <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Contact Details</p>
                                            <input type="text" name="guestName" placeholder="Full Name" onChange={handleChange} required className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border-none text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-400" />
                                            <input type="email" name="guestEmail" placeholder="Email Address" onChange={handleChange} required className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border-none text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-400" />
                                            <input type="tel" name="guestPhone" placeholder="Phone Number" onChange={handleChange} required className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border-none text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-400" />
                                        </div>
                                    )}

                                    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Event Details</p>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1 ml-1">Event Date</label>
                                            <input type="date" name="bookingDate" onChange={handleChange} required className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border-none text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition-all text-sm dark:[color-scheme:dark]" />
                                        </div>
                                        <input type="text" name="purpose" placeholder="Event Type (e.g., Wedding, Corporate)" onChange={handleChange} className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border-none text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-400" />
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <textarea name="specialRequest" placeholder="Describe your event requirements (catering, seating, AV...)" onChange={handleChange} className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border-none text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-400 h-24 resize-none" />
                                    </div>

                                    <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 mt-6">
                                        Submit Inquiry
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HallDetails;
