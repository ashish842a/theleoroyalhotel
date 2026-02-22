"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import api from "../lib/api";

export default function PremiumLoader() {
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        // Ping the backend to wake it up from sleep mode (Render, Vercel etc fallback)
        api.get('/health').catch(() => console.log('Waking up backend server...'));
    }, []);

    useEffect(() => {
        // Show the loader when pathname changes or on initial load
        setIsLoading(true);

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500); // 0.5 seconds of display

        return () => clearTimeout(timer);
    }, [pathname]);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-black transition-all duration-500">
            <div className="relative flex items-center justify-center">
                {/* Outer spinning ring */}
                <div className="absolute w-28 h-28 border-t-2 border-r-2 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin [animation-duration:2s]"></div>

                {/* Inner reverse spinning ring */}
                <div className="absolute w-20 h-20 border-b-2 border-l-2 border-transparent border-b-yellow-500 dark:border-b-yellow-400 rounded-full animate-spin [animation-direction:reverse] [animation-duration:1.5s]"></div>

                {/* Center Logo/Icon */}
                <div className="text-4xl font-serif text-gray-900 dark:text-white animate-pulse">
                    L R
                </div>
            </div>

            {/* Branding Text */}
            <h2 className="mt-10 text-2xl font-serif font-bold tracking-[0.2em] text-gray-900 dark:text-white uppercase animate-pulse">
                The Leo Royal
            </h2>
            <p className="mt-3 text-xs tracking-[0.4em] text-gray-500 dark:text-gray-400 uppercase">
                Loading...
            </p>
        </div>
    );
}
