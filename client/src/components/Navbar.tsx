"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';

const Navbar = () => {
    const [nav, setNav] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<any>(null);
    const pathname = usePathname();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isDashboard = pathname.includes('/dashboard') || pathname.includes('/admin');

    // Always solid background on dashboard/admin pages, otherwise dependent on scroll
    const navbarClasses = isDashboard || scrolled
        ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-md"
        : "bg-transparent text-white bg-gradient-to-b from-black/70 to-transparent";

    const links = [
        { id: 1, link: 'Home', path: '/' },
        { id: 2, link: 'Rooms', path: '/rooms' },
        { id: 3, link: 'Banquet Halls', path: '/halls' },
        { id: 4, link: 'Restaurant', path: '/restaurant' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <nav className={`fixed w-full h-20 z-50 transition-all duration-300 ease-in-out ${navbarClasses}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
                {/* Logo */}
                <div className="flex-shrink-0 flex items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/logo.png"
                            alt="The Leo Royal Hotel Logo"
                            width={40}
                            height={40}
                            className="object-contain"
                        />
                        <h1 className={`text-2xl font-serif font-bold tracking-wider ${isDashboard || scrolled ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
                            The Leo Royal
                        </h1>
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    <ul className="flex space-x-8">
                        {links.map(({ id, link, path }) => (
                            <li key={id}>
                                <Link
                                    href={path}
                                    className={`text-sm uppercase tracking-widest font-medium hover:text-blue-500 transition-colors duration-200 
                                        ${isDashboard || scrolled ? 'text-gray-700 dark:text-gray-200' : 'text-gray-200'}`}
                                >
                                    {link}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Auth Section */}
                    {user ? (
                        <div className="flex items-center gap-4 pl-8 border-l border-gray-300/30">
                            <Link href="/dashboard" className={`flex items-center gap-2 font-medium hover:text-blue-500 transition-colors
                                ${isDashboard || scrolled ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                                    <FaUser />
                                </div>
                                <span className="hidden lg:block">{user.name.split(' ')[0]}</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="pl-8">
                            <Link href="/login">
                                <span className={`inline-block px-6 py-2 rounded-full font-bold text-sm transition-all transform hover:scale-105 shadow-lg
                                    ${isDashboard || scrolled
                                        ? 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200'
                                        : 'bg-white text-black hover:bg-gray-100'}`}>
                                    Login
                                </span>
                            </Link>
                        </div>
                    )}

                    {/* Theme Toggle */}
                    <div className="pl-4">
                        <ThemeToggle />
                    </div>
                </div>

                {/* Mobile Theme Toggle (Visible on small screens in navbar) */}
                <div className="md:hidden flex items-center pr-4">
                    <ThemeToggle />
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setNav(!nav)}
                        className={`p-2 rounded-md focus:outline-none ${isDashboard || scrolled ? 'text-gray-900' : 'text-white'}`}
                    >
                        {nav ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-black/95 z-40 transition-transform duration-300 ease-in-out md:hidden ${nav ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full justify-center items-center space-y-8">
                    {links.map(({ id, link, path }) => (
                        <Link
                            key={id}
                            href={path}
                            onClick={() => setNav(false)}
                            className="text-2xl font-serif text-white hover:text-blue-400 transition-colors"
                        >
                            {link}
                        </Link>
                    ))}
                    <div className="border-t border-gray-800 w-24 my-4"></div>
                    {user ? (
                        <Link
                            href="/dashboard"
                            onClick={() => setNav(false)}
                            className="text-xl font-medium text-blue-400"
                        >
                            My Account
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            onClick={() => setNav(false)}
                            className="text-xl font-medium text-white px-8 py-3 border border-white rounded-full hover:bg-white hover:text-black transition-colors"
                        >
                            Login / Register
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
