"use client";

import { useState, useEffect } from 'react';
import api from '../../lib/api';
import Image from 'next/image';

const Restaurant = () => {
    const [foods, setFoods] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = ['All', 'Starter', 'Main Course', 'Dessert', 'Beverage'];

    const placeholderFoods = [
        {
            _id: '1',
            name: 'Grilled Salmon with Asparagus',
            description: 'Fresh Atlantic salmon grilled to perfection, served with lemon butter sauce and steamed asparagus.',
            price: 1800,
            category: 'Main Course',
            images: ['https://images.unsplash.com/photo-1519708227418-81988761e531?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
            isSpecial: true
        },
        {
            _id: '2',
            name: 'Classic Caesar Salad',
            description: 'Crisp romaine lettuce, parmesan cheese, house-made croutons, and our signature caesar dressing.',
            price: 650,
            category: 'Starter',
            images: ['https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
            isSpecial: false
        },
        {
            _id: '3',
            name: 'Molten Chocolate Lava Cake',
            description: 'Rich chocolate cake with a molten center, served warm with vanilla bean ice cream.',
            price: 550,
            category: 'Dessert',
            images: ['https://images.unsplash.com/photo-1606313564200-e75d5e30476d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
            isSpecial: true
        },
        {
            _id: '4',
            name: 'Truffle Mushroom Risotto',
            description: 'Creamy arborio rice cooked with wild mushrooms and finished with black truffle oil.',
            price: 1400,
            category: 'Main Course',
            images: ['https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
            isSpecial: false
        },
        {
            _id: '5',
            name: 'Signature Cocktails',
            description: 'Handcrafted cocktails mixed with premium spirits and fresh ingredients.',
            price: 900,
            category: 'Beverage',
            images: ['https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
            isSpecial: false
        }
    ];

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const res = await api.get('/food');
                if (res.data.length > 0) {
                    setFoods(res.data);
                } else {
                    setFoods(placeholderFoods);
                }
            } catch (err) {
                console.log("Using placeholder data due to API error/empty");
                setFoods(placeholderFoods);
            } finally {
                setLoading(false);
            }
        };
        fetchFoods();
    }, []);

    const filteredFoods = activeCategory === 'All'
        ? foods
        : foods.filter(food => food.category === activeCategory);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            {/* Hero Section */}
            <div className="relative h-[400px] w-full overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                    alt="Restaurant Hero"
                    fill
                    className="object-cover object-center"
                    priority
                />
                <div className="absolute inset-0 bg-black/60 z-10"></div>
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                    <span className="text-amber-400 font-medium tracking-[0.3em] uppercase mb-4">The Royal Kitchen</span>
                    <h1 className="text-5xl md:text-6xl font-serif text-white mb-6">Fine Dining Menu</h1>
                    <p className="text-gray-200 max-w-2xl text-lg font-light">
                        A culinary journey through exquisite flavors, prepared by our world-renowned chefs using the finest seasonal ingredients.
                    </p>
                </div>
            </div>

            {/* Menu Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300
                                ${activeCategory === cat
                                    ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg transform -translate-y-1'
                                    : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white"></div></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                        {filteredFoods.map((food) => (
                            <div key={food._id} className="group flex gap-6 items-start p-4 hover:bg-white dark:hover:bg-gray-900 hover:shadow-lg rounded-2xl transition-all duration-300 border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
                                {/* Image */}
                                <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 relative overflow-hidden rounded-full border-2 border-gray-100 dark:border-gray-800 shadow-sm">
                                    <Image
                                        src={food.images[0] || "https://via.placeholder.com/150"}
                                        alt={food.name}
                                        fill
                                        className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {food.isSpecial && (
                                        <div className="absolute bottom-0 inset-x-0 bg-amber-500 text-white text-[10px] uppercase font-bold text-center py-1">
                                            Chef's Special
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                                        <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors">
                                            {food.name}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1 md:mt-0">
                                            <div className="h-[1px] bg-gray-300 dark:bg-gray-700 w-12 hidden md:block"></div>
                                            <span className="text-lg font-bold text-amber-600 dark:text-amber-500 whitespace-nowrap">₹{food.price}</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-3">
                                        {food.description}
                                    </p>
                                    <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300 text-xs font-medium rounded-full uppercase tracking-wider">
                                        {food.category}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredFoods.length === 0 && (
                    <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                        <p className="text-xl">No items found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Restaurant;
