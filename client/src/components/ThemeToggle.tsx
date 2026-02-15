"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaMoon, FaSun, FaDesktop } from "react-icons/fa";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="flex items-center gap-2 p-1 bg-gray-200/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-300 dark:border-gray-700">
            <button
                onClick={() => setTheme("light")}
                className={`p-2 rounded-full transition-all duration-200 ${theme === "light"
                    ? "bg-white text-yellow-500 shadow-sm"
                    : "text-gray-900 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    }`}
                aria-label="Light Mode"
                title="Light Mode"
            >
                <FaSun size={14} />
            </button>

            <button
                onClick={() => setTheme("dark")}
                className={`p-2 rounded-full transition-all duration-200 ${theme === "dark"
                    ? "bg-gray-800 text-purple-400 shadow-sm"
                    : "text-gray-900 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    }`}
                aria-label="Dark Mode"
                title="Dark Mode"
            >
                <FaMoon size={14} />
            </button>
        </div>
    );
}
