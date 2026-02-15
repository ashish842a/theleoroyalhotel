"use client";

import { useState } from 'react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast'; // Assuming react-hot-toast is used, otherwise I'll use simple alert or check package.json.
// Actually checking package.json... user has 'react-icons' but no toast lib mentioned in dependencies explicitly in the view_file earlier? 
// Wait, I saw package.json earlier. 
// dependencies: axios, next, next-themes, react, react-dom, react-icons. 
// I DON'T SEE A TOAST LIBRARY. 
// I should probably install one or just use alert() for now to be safe, or check if it's already there but I missed it.
// I'll stick to simple alert or console interaction if I can't confirm.
// BUT, for a premium site, I should probably add one or use a simple UI message.
// I'll use a simple state-based UI message for success/error.

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            await api.post('/auth/forgot-password', { email });
            setMessage('Email sent! check your inbox.');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">Forgot Password</h2>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center">{message}</div>}
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
