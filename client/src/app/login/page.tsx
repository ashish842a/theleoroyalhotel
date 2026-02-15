"use client";

import { useState } from 'react';
import api from '../../lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEnvelope, FaLock, FaGoogle, FaFacebook } from 'react-icons/fa';

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await api.post("/auth/login", credentials);
            localStorage.setItem("user", JSON.stringify(res.data.details));

            // Redirect based on role and force reload to update nav state
            if (res.data.role === 'admin') {
                window.location.href = '/admin/dashboard';
            } else {
                window.location.href = '/';
            }

        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="flex w-full max-w-6xl shadow-2xl rounded-2xl overflow-hidden bg-white min-h-[700px]">
                {/* Left Side - Image & Branding */}
                <div className="hidden md:flex w-1/2 bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')" }}>
                    <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="relative z-10 flex flex-col justify-end p-12 text-white">
                        <h1 className="text-5xl font-bold mb-4 font-serif">The Leo Royal</h1>
                        <p className="text-lg opacity-90 max-w-md leading-relaxed">Experience the epitome of luxury and comfort. Your perfect getaway starts here.</p>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative">
                    <div className="max-w-md mx-auto w-full">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                            <p className="text-gray-500">Please enter your details to sign in</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded animate-pulse">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleClick} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="john@example.com"
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-gray-50 hover:bg-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        id="password"
                                        placeholder="••••••••"
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-gray-50 hover:bg-white"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end mt-2">
                                    <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">Forgot Password?</Link>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-transform active:scale-[0.98] disabled:bg-gray-400 disabled:transform-none shadow-lg hover:shadow-xl"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing In...
                                    </span>
                                ) : 'Sign In'}
                            </button>
                        </form>

                        <div className="mt-8 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-4">
                            <button className="flex-1 flex justify-center items-center gap-2 py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium">
                                <FaGoogle className="text-red-500" /> Google
                            </button>
                            <button className="flex-1 flex justify-center items-center gap-2 py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium">
                                <FaFacebook className="text-blue-600" /> Facebook
                            </button>
                        </div>

                        <p className="mt-8 text-center text-gray-600">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-blue-600 font-bold hover:underline">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
