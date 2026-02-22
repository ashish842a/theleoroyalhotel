"use client";

import { useState, useEffect } from 'react';
import api from '../../lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { FaWifi, FaSnowflake, FaBed, FaBath, FaArrowRight } from 'react-icons/fa';

const Rooms = () => {
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const roomsPerPage = 5;

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await api.get('/rooms');
                setRooms(res.data);
            } catch (err) {
                console.log("Error fetching rooms from db");
                setRooms([]);
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    // Pagination logic
    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);
    const totalPages = Math.ceil(rooms.length / roomsPerPage);

    const getImageSrc = (images?: string[]) => {
        if (!images || images.length === 0 || !images[0]) return "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
        const src = images[0];
        if (src.startsWith('http') || src.startsWith('/') || src.startsWith('data:')) return src;
        return "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-16 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-blue-600 font-bold text-xs tracking-widest uppercase block mb-3">Accommodation</span>
                    <h1 className="text-4xl md:text-5xl font-serif text-gray-900 dark:text-white mb-6">Our Luxurious Rooms</h1>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg font-light">
                        Discover a sanctuary of elegance and comfort. Each room is designed to provide you with an unforgettable stay.
                    </p>
                    <div className="w-24 h-1 bg-black dark:bg-white mx-auto mt-8"></div>
                </div>

                {rooms.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">
                        <p className="text-xl">No rooms available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-12">
                        {currentRooms.map((room, index) => (
                            <div
                                key={room._id}
                                className={`bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                            >
                                {/* Image Section */}
                                <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden group">
                                    <Image
                                        src={getImageSrc(room.images)}
                                        alt={room.name || "Room Image"}
                                        fill
                                        className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
                                </div>

                                {/* Content Section */}
                                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-3xl font-serif text-gray-900 dark:text-white">{room.name}</h2>
                                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{room.price}<span className="text-sm text-gray-400 font-normal">/night</span></span>
                                    </div>

                                    <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed font-light">
                                        {room.description}
                                    </p>

                                    <div className="flex flex-wrap gap-6 mb-8 border-t border-b border-gray-100 dark:border-gray-800 py-6">
                                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                            <FaWifi className="text-blue-500" />
                                            <span className="text-sm uppercase tracking-wider">Free WiFi</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                            <FaSnowflake className="text-blue-500" />
                                            <span className="text-sm uppercase tracking-wider">Climate Control</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                            <FaBed className="text-blue-500" />
                                            <span className="text-sm uppercase tracking-wider">King Bed</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                            <FaBath className="text-blue-500" />
                                            <span className="text-sm uppercase tracking-wider">Ensuite</span>
                                        </div>
                                    </div>

                                    <Link href={`/rooms/${room._id}`}>
                                        <span className="group flex items-center gap-3 text-black dark:text-white font-bold uppercase tracking-widest text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                            View Details
                                            <FaArrowRight className="transform group-hover:translate-x-2 transition-transform duration-300" />
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-16">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-6 py-2 rounded-full font-bold uppercase tracking-widest text-sm transition-all shadow-md ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600' : 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200'}`}
                        >
                            Previous
                        </button>
                        <span className="text-gray-600 dark:text-gray-300 font-medium">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`px-6 py-2 rounded-full font-bold uppercase tracking-widest text-sm transition-all shadow-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600' : 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200'}`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Rooms;
