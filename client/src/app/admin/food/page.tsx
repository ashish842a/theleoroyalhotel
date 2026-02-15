"use client";

import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import Image from 'next/image';
import { FaPlus, FaTrash, FaEdit, FaSearch, FaUtensils, FaRupeeSign, FaTag, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ManageFood = () => {
    const [foods, setFoods] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        images: '', // comma separated urls
        isSpecial: false,
        isAvailable: true,
    });
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Pre-defined categories for easier selection
    const categories = ['Starter', 'Main Course', 'Dessert', 'Beverage', 'Snack'];

    useEffect(() => {
        fetchFoods();
    }, []);

    const fetchFoods = async () => {
        try {
            const res = await api.get('/food');
            setFoods(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        // Handle checkbox
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData({ ...formData, [name]: checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                images: formData.images.split(',').map(item => item.trim()),
            };
            await api.post('/food', payload);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                images: '',
                isSpecial: false,
                isAvailable: true,
            });
            fetchFoods();
            setIsModalOpen(false);
            alert("Menu item added successfully!");
        } catch (err: any) {
            console.error(err);
            alert("Failed to add item: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        try {
            await api.delete(`/food/${id}`);
            fetchFoods();
        } catch (err) {
            console.error(err);
            alert("Failed to delete item");
        }
    };

    const filteredFoods = foods.filter(food => {
        const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || food.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentFoods = filteredFoods.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="p-4 md:p-6 max-w-[1600px] mx-auto min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Menu</h1>
                    <p className="text-gray-500 mt-1">Curate your restaurant's culinary offerings</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search menu..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full sm:w-64"
                        />
                    </div>
                    <div className="relative">
                        <FaTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer w-full sm:w-48"
                        >
                            <option value="All">All Categories</option>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-all shadow hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        <FaPlus size={14} /> Add Item
                    </button>
                </div>
            </div>

            {/* Food Grid Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ring-1 ring-black/5">
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Dish Details</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentFoods.map((food) => (
                                <tr key={food._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-gray-100 border border-gray-200 relative">
                                                <Image className="object-cover" src={food.images[0]} alt="" fill />
                                            </div>
                                            <div className="ml-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="text-sm font-bold text-gray-900">{food.name}</div>
                                                    {food.isSpecial && <FaStar className="text-amber-400 text-xs" title="Chef's Special" />}
                                                </div>
                                                <div className="text-xs text-gray-500 max-w-xs truncate">{food.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm font-bold text-gray-900">
                                            <FaRupeeSign size={12} className="mr-0.5" /> {food.price}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {food.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${food.isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                                            {food.isAvailable ? 'Available' : 'Sold Out'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleDelete(food._id)} className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-full transition-colors">
                                            <FaTrash size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredFoods.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            <FaUtensils className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No items found</h3>
                            <p className="mt-1 text-sm text-gray-500">Create a delicious menu for your guests.</p>
                            <button onClick={() => setIsModalOpen(true)} className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                                <FaPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                Add Menu Item
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Card View (Responsive < 576px optimized) */}
                <div className="md:hidden">
                    {filteredFoods.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <FaUtensils className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                            <h3 className="text-base font-medium text-gray-900">No items found</h3>
                            <button onClick={() => setIsModalOpen(true)} className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800">
                                <FaPlus className="-ml-1 mr-2 h-4 w-4" />
                                Add Menu Item
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {currentFoods.map((food) => (
                                <div key={food._id} className="p-3 sm:p-4 flex flex-col gap-3 sm:gap-4">
                                    <div className="flex gap-4">
                                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-gray-100 border border-gray-200 relative">
                                            <Image className="object-cover" src={food.images[0]} alt="" fill />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-start gap-1">
                                                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 pr-1">{food.name}</h3>
                                                    {food.isSpecial && <FaStar className="text-amber-400 text-xs flex-shrink-0 mt-0.5" title="Chef's Special" />}
                                                </div>
                                                <div className="text-sm font-bold text-gray-900 whitespace-nowrap">
                                                    <FaRupeeSign size={10} className="inline mr-0.5" />{food.price}
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{food.description}</p>

                                            <div className="flex flex-wrap gap-2 mt-2 items-center">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                    {food.category}
                                                </span>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${food.isAvailable ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                                                    {food.isAvailable ? 'Available' : 'Sold Out'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-1">
                                        <button className="flex-1 py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors text-xs font-medium border border-gray-200 shadow-sm flex items-center justify-center gap-2">
                                            <FaEdit size={12} /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(food._id)} className="flex-1 py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-xs font-medium border border-gray-200 shadow-sm flex items-center justify-center gap-2">
                                            <FaTrash size={12} /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination */}
            {
                filteredFoods.length > itemsPerPage && (
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

            {/* Add Food Modal */}
            {
                isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fadeIn">
                            <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-900">Add Menu Item</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <span className="text-2xl">&times;</span>
                                </button>
                            </div>

                            <div className="p-8 max-h-[80vh] overflow-y-auto">
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Dish Name</label>
                                        <input type="text" name="name" placeholder="e.g. Lobster Bisque" value={formData.name} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹)</label>
                                        <input type="number" name="price" placeholder="0" value={formData.price} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                        <select name="category" value={formData.category} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white cursor-pointer">
                                            <option value="">Select Category</option>
                                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                                        <input type="text" name="images" placeholder="https://..." value={formData.images} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                        <textarea name="description" placeholder="Describe ingredients and flavors..." value={formData.description} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 resize-none"></textarea>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" name="isSpecial" id="isSpecial" checked={formData.isSpecial} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                                        <label htmlFor="isSpecial" className="text-sm font-medium text-gray-700 select-none">Chef's Special?</label>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" name="isAvailable" id="isAvailable" checked={formData.isAvailable} onChange={handleChange} className="w-5 h-5 text-green-600 rounded focus:ring-green-500" />
                                        <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700 select-none">Available for order?</label>
                                    </div>

                                    <div className="col-span-2 pt-4 flex gap-4">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 px-4 border border-gray-200 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                                            Cancel
                                        </button>
                                        <button type="submit" disabled={loading} className="flex-1 py-3 px-4 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-colors shadow-lg">
                                            {loading ? 'Adding...' : 'Add Item'}
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

export default ManageFood;
