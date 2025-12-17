import React, { useState } from 'react';
import { Logo } from './Logo';
import { apiRequest } from '../services/api';

interface ContactPageProps {
    onBack: () => void;
    onStart: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBack, onStart }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !name.trim()) return;

        setLoading(true);
        setSuccess(false);

        try {
            await apiRequest('/api/crm', 'POST', {
                email,
                name,
                source: 'landing',
                notes: ''
            });

            setSuccess(true);
            setEmail('');
            setName('');

            // Hide success message after 5 seconds
            setTimeout(() => setSuccess(false), 5000);
        } catch (error) {
            console.error('Error submitting contact:', error);
            alert('Failed to submit contact form. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-white font-sans selection:bg-medical-100 dark:selection:bg-medical-900 flex flex-col">
            {/* Navigation */}
            <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between w-full sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-40 border-b border-slate-100 dark:border-slate-900">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2.5 hover:opacity-80 transition-opacity group"
                >
                    <div className="w-8 h-8 flex items-center justify-center overflow-hidden text-medical-600">
                        <Logo className="w-full h-full" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">MDnexa™</span>
                </button>
                <div className="flex items-center gap-6">
                    <button
                        onClick={onStart}
                        className="text-sm font-semibold text-medical-600 dark:text-medical-400 hover:underline"
                    >
                        Login
                    </button>
                    <button
                        onClick={onStart}
                        className="hidden md:block px-5 py-2 rounded-lg bg-medical-600 text-white text-sm font-medium hover:bg-medical-700 transition-colors shadow-lg shadow-medical-600/20"
                    >
                        Start Now
                    </button>
                </div>
            </nav>

            {/* Hero Header */}
            <div className="bg-slate-50 dark:bg-slate-900/50 py-16 md:py-20 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                        Contact <span className="text-medical-600 dark:text-medical-400">Us</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        We're here to help. Reach out for support, feedback, or business inquiries.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* Support Card */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Support & Feedback</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
                            For technical issues, account assistance, or general questions.
                        </p>
                        <a href="mailto:service@mdnexa.com" className="text-medical-600 dark:text-medical-400 font-semibold hover:underline text-lg">
                            service@mdnexa.com
                        </a>
                    </div>

                    {/* Partnership Card */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Partnerships</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
                            For institutional licenses, research collaborations, or business inquiries.
                        </p>
                        <a href="mailto:partner@mdnexa.com" className="text-medical-600 dark:text-medical-400 font-semibold hover:underline text-lg">
                            partner@mdnexa.com
                        </a>
                    </div>
                </div>

                {/* Company Info */}
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Trulonis Tech™</h3>
                        <p className="text-slate-500 dark:text-slate-400">Berlin, Germany</p>
                    </div>
                </div>

                <p className="mt-8 text-center text-sm text-slate-400 dark:text-slate-500 italic">
                    We aim to respond within 48 hours.
                </p>
            </div>

            {/* Footer */}
            <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 py-12 mt-auto">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="flex flex-col items-center gap-2 mb-4">
                        <span className="font-bold text-slate-900 dark:text-white text-lg">Powered by Trulonis Tech™</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">Berlin, Germany</span>
                    </div>
                    <div className="text-sm text-slate-400 dark:text-slate-600">
                        © 2025 MDnexa™. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};