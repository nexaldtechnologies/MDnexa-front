import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { apiFetch } from '../services/api';

export const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const tokenParam = searchParams.get('token');
        if (tokenParam) {
            setToken(tokenParam);
        } else {
            setError("Invalid or missing reset token.");
        }
    }, []);

    const onStart = () => {
        window.location.href = '/';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            if (!token) {
                throw new Error("Missing reset token.");
            }

            // apiFetch returns the parsed JSON data directly
            const data = await apiFetch('/auth/reset-password-confirm', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword: password }),
            });

            // If success is false in the response body (logic error from backend)
            // apiFetch throws on HTTP error, but backend might return 200 with success: false
            if (data && data.success === false) {
                throw new Error(data.error || data.message || "Failed to reset password");
            }

            setSuccess(true);
        } catch (err: any) {
            console.error('Reset failed', err);
            setError(err.message || 'Failed to update password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
                    <div className="w-16 h-16 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Password Reset!</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8">
                        Your password has been successfully updated. You can now log in with your new password.
                    </p>
                    <button
                        onClick={onStart}
                        className="w-full bg-medical-600 hover:bg-medical-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center px-4 font-sans">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="inline-block p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-black/50 mb-6">
                        <Logo className="w-12 h-12 text-medical-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Reset Password</h1>
                    <p className="text-slate-500 dark:text-slate-400">Enter your new password below.</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-slate-800">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Confirm Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-medical-600 hover:bg-medical-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-medical-600/20 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
