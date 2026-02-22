"use client";

import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import Image from 'next/image';
import { FaPlus, FaTrash, FaEdit, FaSearch, FaBed, FaRupeeSign, FaUsers, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ManageRooms = () => {
    const [rooms, setRooms] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        capacity: '',
        amenities: '', // comma separated strings
        images: '', // comma separated urls
    });
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const res = await api.get('/rooms');
            setRooms(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                capacity: Number(formData.capacity),
                amenities: formData.amenities.split(',').map(item => item.trim()),
                images: formData.images.startsWith('data:') ? [formData.images] : formData.images.split(',').map(item => item.trim()),
            };
            await api.post('/rooms', payload);
            setFormData({
                name: '',
                description: '',
                price: '',
                capacity: '',
                amenities: '',
                images: '',
            });
            fetchRooms();
            setIsModalOpen(false);
            alert("Room added successfully!");
        } catch (err: any) {
            console.error(err);
            alert("Failed to add room: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this room?")) return;
        try {
            await api.delete(`/rooms/${id}`);
            fetchRooms();
        } catch (err) {
            console.error(err);
            alert("Failed to delete room");
        }
    };

    const filteredRooms = rooms.filter(room =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRooms = filteredRooms.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);

    const getImageSrc = (images?: string[]) => {
        if (!images || images.length === 0 || !images[0]) return "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
        const src = images[0];
        if (src.startsWith('http') || src.startsWith('/') || src.startsWith('data:')) return src;
        return "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, images: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="p-4 md:p-6 max-w-[1600px] mx-auto min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Rooms</h1>
                    <p className="text-gray-500 mt-1">Add, edit, and organize hotel inventory</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search rooms..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full sm:w-64"
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-all shadow hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        <FaPlus size={14} /> Add New Room
                    </button>
                </div>
            </div>

            {/* Room Grid Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ring-1 ring-black/5">
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Room Details</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price / Night</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Capacity</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentRooms.map((room) => (
                                <tr key={room._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200 relative">
                                                <Image className="object-cover" src={getImageSrc(room.images)} alt="" fill />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-gray-900">{room.name}</div>
                                                <div className="text-xs text-gray-500 max-w-xs truncate">{room.description}</div>
                                                <div className="flex gap-1 mt-1">
                                                    {room.amenities.slice(0, 3).map((am: string, idx: number) => (
                                                        <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">{am}</span>
                                                    ))}
                                                    {room.amenities.length > 3 && <span className="text-[10px] text-gray-400 px-1">+ {room.amenities.length - 3} more</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm font-bold text-gray-900">
                                            <FaRupeeSign size={12} className="mr-0.5" /> {room.price}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <FaUsers className="mr-2 text-gray-400" /> {room.capacity} Guests
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${room.isAvailable !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {room.isAvailable !== false ? 'Available' : 'Booked'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleDelete(room._id)} className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-full transition-colors">
                                            <FaTrash size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredRooms.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            <FaBed className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No rooms found</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by adding a new room to your inventory.</p>
                            <button onClick={() => setIsModalOpen(true)} className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                                <FaPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                Add New Room
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden">
                    {filteredRooms.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <FaBed className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                            <h3 className="text-base font-medium text-gray-900">No rooms found</h3>
                            <button onClick={() => setIsModalOpen(true)} className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800">
                                <FaPlus className="-ml-1 mr-2 h-4 w-4" />
                                Add New Room
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {currentRooms.map((room) => (
                                <div key={room._id} className="p-4 flex flex-col gap-4">
                                    <div className="flex gap-4">
                                        <div className="h-20 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200 relative">
                                            <Image className="object-cover" src={getImageSrc(room.images)} alt="" fill />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-sm font-bold text-gray-900 line-clamp-2 pr-2">{room.name}</h3>
                                                <span className={`flex-shrink-0 px-2 py-0.5 inline-flex text-[10px] leading-4 font-semibold rounded-full ${room.isAvailable !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {room.isAvailable !== false ? 'Available' : 'Booked'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{room.description}</p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <div className="flex items-center text-xs font-bold text-gray-900">
                                                    <FaRupeeSign size={10} className="mr-0.5" /> {room.price}
                                                    <span className="text-gray-400 font-normal ml-0.5">/ night</span>
                                                </div>
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <FaUsers size={10} className="mr-1" /> {room.capacity}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-3 mt-auto border-t border-gray-50 flex flex-col gap-3">
                                        <div className="flex flex-wrap gap-1.5">
                                            {room.amenities.slice(0, 5).map((am: string, idx: number) => (
                                                <span key={idx} className="text-[10px] bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-100 whitespace-nowrap">{am}</span>
                                            ))}
                                            {room.amenities.length > 5 && <span className="text-[10px] text-gray-400 px-1 self-center">+ {room.amenities.length - 5}</span>}
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="flex-1 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors text-xs font-medium border border-gray-200 shadow-sm flex items-center justify-center gap-2">
                                                <FaEdit size={12} /> Edit
                                            </button>
                                            <button onClick={() => handleDelete(room._id)} className="flex-1 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-xs font-medium border border-gray-200 shadow-sm flex items-center justify-center gap-2">
                                                <FaTrash size={12} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination */}
            {
                filteredRooms.length > itemsPerPage && (
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
                )
            }

            {/* Add Room Modal */}
            {
                isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fadeIn">
                            <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-900">Add New Room</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <span className="text-2xl">&times;</span>
                                </button>
                            </div>

                            <div className="p-8 max-h-[80vh] overflow-y-auto">
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Room Name</label>
                                        <input type="text" name="name" placeholder="e.g. Deluxe King Suite" value={formData.name} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 bg-white" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Price per Night (₹)</label>
                                        <input type="number" name="price" placeholder="0" value={formData.price} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 bg-white" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Max Capacity</label>
                                        <input type="number" name="capacity" placeholder="Guests" value={formData.capacity} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 bg-white" />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Image Setup</label>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="w-1/2 p-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                                />
                                                <span className="text-gray-400 font-bold text-sm uppercase">OR</span>
                                                <input type="text" name="images" placeholder="Enter Image URL directly here..." value={formData.images} onChange={handleChange} required className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 bg-white text-sm" />
                                            </div>
                                            {formData.images && formData.images.startsWith('data:') && (
                                                <div className="w-24 h-16 rounded-lg overflow-hidden border border-gray-200 relative">
                                                    <Image src={formData.images} fill alt="Preview" className="object-cover" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Amenities</label>
                                        <input type="text" name="amenities" placeholder="e.g. WiFi, AC, TV, Jacuzzi" value={formData.amenities} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 bg-white" />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                        <textarea name="description" placeholder="Describe the room features and view..." value={formData.description} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all h-32 resize-none text-gray-900 bg-white"></textarea>
                                    </div>

                                    <div className="col-span-2 pt-4 flex gap-4">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 px-4 border border-gray-200 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                                            Cancel
                                        </button>
                                        <button type="submit" disabled={loading} className="flex-1 py-3 px-4 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-colors shadow-lg">
                                            {loading ? 'Creating...' : 'Create Room'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default ManageRooms;
