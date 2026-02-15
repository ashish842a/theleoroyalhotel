"use client";

import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import Image from 'next/image';
import { FaPlus, FaTrash, FaEdit, FaSearch, FaBuilding, FaRupeeSign, FaUsers, FaGlassCheers, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ManageHalls = () => {
    const [halls, setHalls] = useState<any[]>([]);
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
        fetchHalls();
    }, []);

    const fetchHalls = async () => {
        try {
            const res = await api.get('/halls');
            setHalls(res.data);
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
                images: formData.images.split(',').map(item => item.trim()),
            };
            await api.post('/halls', payload);
            setFormData({
                name: '',
                description: '',
                price: '',
                capacity: '',
                amenities: '',
                images: '',
            });
            fetchHalls();
            setIsModalOpen(false);
            alert("Hall added successfully!");
        } catch (err: any) {
            console.error(err);
            alert("Failed to add hall: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this hall?")) return;
        try {
            await api.delete(`/halls/${id}`);
            fetchHalls();
        } catch (err) {
            console.error(err);
            alert("Failed to delete hall");
        }
    };

    const filteredHalls = halls.filter(hall =>
        hall.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentHalls = filteredHalls.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredHalls.length / itemsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="p-4 md:p-6 max-w-[1600px] mx-auto min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Banquet Halls</h1>
                    <p className="text-gray-500 mt-1">Organize event spaces and venues</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search halls..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full sm:w-64"
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-all shadow hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        <FaPlus size={14} /> Add New Hall
                    </button>
                </div>
            </div>

            {/* Hall Grid Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ring-1 ring-black/5">
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hall Details</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price / Day</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Max Capacity</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentHalls.map((hall) => (
                                <tr key={hall._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200 relative">
                                                <Image className="object-cover" src={hall.images[0]} alt="" fill />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-gray-900">{hall.name}</div>
                                                <div className="text-xs text-gray-500 max-w-xs truncate">{hall.description}</div>
                                                <div className="flex gap-1 mt-1">
                                                    {hall.amenities.slice(0, 3).map((am: string, idx: number) => (
                                                        <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">{am}</span>
                                                    ))}
                                                    {hall.amenities.length > 3 && <span className="text-[10px] text-gray-400 px-1">+ {hall.amenities.length - 3} more</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm font-bold text-gray-900">
                                            <FaRupeeSign size={12} className="mr-0.5" /> {hall.price}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <FaUsers className="mr-2 text-gray-400" /> {hall.capacity} People
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${hall.isAvailable !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {hall.isAvailable !== false ? 'Available' : 'Booked'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleDelete(hall._id)} className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-full transition-colors">
                                            <FaTrash size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredHalls.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            <FaGlassCheers className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No halls found</h3>
                            <p className="mt-1 text-sm text-gray-500">Add event spaces to your inventory.</p>
                            <button onClick={() => setIsModalOpen(true)} className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                                <FaPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                Add New Hall
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Card View (Responsive < 512px optimized) */}
                <div className="md:hidden">
                    {filteredHalls.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <FaGlassCheers className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                            <h3 className="text-base font-medium text-gray-900">No halls found</h3>
                            <button onClick={() => setIsModalOpen(true)} className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800">
                                <FaPlus className="-ml-1 mr-2 h-4 w-4" />
                                Add New Hall
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {currentHalls.map((hall) => (
                                <div key={hall._id} className="p-3 sm:p-4 flex flex-col gap-3 sm:gap-4">
                                    <div className="flex gap-4">
                                        <div className="h-20 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200 relative">
                                            <Image className="object-cover" src={hall.images[0]} alt="" fill />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-sm font-bold text-gray-900 line-clamp-2 pr-2">{hall.name}</h3>
                                                <span className={`flex-shrink-0 px-2 py-0.5 inline-flex text-[10px] leading-4 font-semibold rounded-full ${hall.isAvailable !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {hall.isAvailable !== false ? 'Available' : 'Booked'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{hall.description}</p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <div className="flex items-center text-xs font-bold text-gray-900">
                                                    <FaRupeeSign size={10} className="mr-0.5" /> {hall.price}
                                                    <span className="text-gray-400 font-normal ml-0.5">/ day</span>
                                                </div>
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <FaUsers size={10} className="mr-1" /> {hall.capacity}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-3 mt-auto border-t border-gray-50 flex flex-col gap-3">
                                        <div className="flex flex-wrap gap-1.5">
                                            {hall.amenities.slice(0, 5).map((am: string, idx: number) => (
                                                <span key={idx} className="text-[10px] bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-100 whitespace-nowrap">{am}</span>
                                            ))}
                                            {hall.amenities.length > 5 && <span className="text-[10px] text-gray-400 px-1 self-center">+ {hall.amenities.length - 5}</span>}
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="flex-1 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors text-xs font-medium border border-gray-200 shadow-sm flex items-center justify-center gap-2">
                                                <FaEdit size={12} /> Edit
                                            </button>
                                            <button onClick={() => handleDelete(hall._id)} className="flex-1 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-xs font-medium border border-gray-200 shadow-sm flex items-center justify-center gap-2">
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
                filteredHalls.length > itemsPerPage && (
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

            {/* Add Hall Modal */}
            {
                isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fadeIn">
                            <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-900">Add New Hall</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <span className="text-2xl">&times;</span>
                                </button>
                            </div>

                            <div className="p-8 max-h-[80vh] overflow-y-auto">
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Hall Name</label>
                                        <input type="text" name="name" placeholder="e.g. Grand Ballroom" value={formData.name} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Price per Day (₹)</label>
                                        <input type="number" name="price" placeholder="0" value={formData.price} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Max Capacity</label>
                                        <input type="number" name="capacity" placeholder="People" value={formData.capacity} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                                        <input type="text" name="images" placeholder="https://..." value={formData.images} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                                        <p className="text-xs text-gray-500 mt-1">Enter a single URL for now (comma separated support coming soon)</p>
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Amenities</label>
                                        <input type="text" name="amenities" placeholder="e.g. Sound System, Projector, Stage" value={formData.amenities} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                        <textarea name="description" placeholder="Describe the venue features..." value={formData.description} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all h-32 resize-none"></textarea>
                                    </div>

                                    <div className="col-span-2 pt-4 flex gap-4">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 px-4 border border-gray-200 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                                            Cancel
                                        </button>
                                        <button type="submit" disabled={loading} className="flex-1 py-3 px-4 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-colors shadow-lg">
                                            {loading ? 'Adding...' : 'Add Hall'}
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

export default ManageHalls;
