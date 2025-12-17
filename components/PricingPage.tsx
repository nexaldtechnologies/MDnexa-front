
import React, { useState } from 'react';
import { Logo } from './Logo';
import { supabase } from '../services/supabaseClient';
import { apiRequest } from '../services/api';

interface PricingPageProps {
    onBack: () => void;
    onStart: () => void;
    onSubscribe?: (priceId: string) => void;
    isAuthenticated?: boolean;
    userName?: string;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onBack, onStart, onSubscribe, isAuthenticated, userName }) => {
    const [isYearly, setIsYearly] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    React.useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUserId(session.user.id);
            }
        };
        getUser();
    }, []);

    const getStripeUrl = (baseUrl: string) => {
        if (!userId) return baseUrl;
        // Check if url already has query params
        const separator = baseUrl.includes('?') ? '&' : '?';
        return `${baseUrl}${separator}client_reference_id=${userId}`;
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-white font-sans selection:bg-medical-100 dark:selection:bg-medical-900 flex flex-col">
            {/* Navigation */}
            <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between w-full">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2.5 hover:opacity-80 transition-opacity group"
                >
                    <div className="w-8 h-8 flex items-center justify-center overflow-hidden">
                        <Logo className="w-full h-full" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Back to Home</span>
                </button>
                <div className="flex items-center gap-6">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                Logged in as <span className="text-slate-900 dark:text-white font-semibold">{userName || 'User'}</span>
                            </span>
                        </div>
                    ) : (
                        <>
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 hidden md:block">Already have an account?</span>
                            <button
                                onClick={onStart}
                                className="text-sm font-semibold text-medical-600 dark:text-medical-400 hover:underline"
                            >
                                Login
                            </button>
                        </>
                    )}
                </div>
            </nav>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center py-10 md:py-16 px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
                    <h2 className="text-medical-600 dark:text-medical-400 font-semibold tracking-wide uppercase text-sm mb-3">Simple Pricing</h2>
                    <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 md:mb-6">
                        Invest in your clinical workflow.
                    </h1>
                    <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                        Guideline-aware clinical intelligence with pathophysiology, drug safety, interactions, and evidence-based reasoning built in.
                    </p>
                </div>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center gap-4 mb-8 md:mb-12 bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-full border border-slate-200 dark:border-slate-800 scale-90 md:scale-100 origin-center">
                    <button
                        onClick={() => setIsYearly(false)}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!isYearly ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setIsYearly(true)}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${isYearly ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        Yearly <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-bold">-20%</span>
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl w-full mx-auto">
                    {/* Free Tier */}
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 relative overflow-hidden flex flex-col">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">1 Month Free Trial</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Perfect for testing capabilities.</p>
                        </div>
                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-4xl font-bold text-slate-900 dark:text-white">€0</span>
                            <span className="text-slate-500 dark:text-slate-400">/ first month</span>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            {[
                                "Access to standard guidelines",
                                "Daily AI queries included",
                                "7-day history retention",
                                "Standard response speed",
                                "Web access only"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-400 min-w-[20px]">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => window.location.href = getStripeUrl('https://buy.stripe.com/14A9AT2BCfxj47Rdci5Ne06')}
                            className="w-full py-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-white font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            Start Free Trial
                        </button>
                    </div>

                    {/* Professional Tier */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border-2 border-green-500 relative shadow-2xl shadow-green-500/10 flex flex-col">
                        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                            Most Popular
                        </div>
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Professional</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">For dedicated healthcare providers.</p>
                        </div>
                        <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-4xl font-bold text-slate-900 dark:text-white">
                                {isYearly ? '€7.20' : '€9'}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400">/ month</span>
                        </div>
                        <div className="h-6 mb-6">
                            {isYearly && (
                                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                                    Billed €86.40 yearly
                                </p>
                            )}
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            {[
                                "Access to 150+ country guidelines",
                                "Full access to AI queries",
                                "Voice Dictation (40+ Languages)",
                                "Permanent secure history",
                                "Priority processing speed",
                                "Dark mode & customization"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm font-medium">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500 min-w-[20px]">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => {
                                const url = isYearly
                                    ? 'https://buy.stripe.com/00w5kDfoo3OB5bV4FM5Ne01'
                                    : 'https://buy.stripe.com/14A9AT2BCfxj47Rdci5Ne06';
                                window.location.href = getStripeUrl(url);
                            }}
                            className="w-full py-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-600/25 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Upgrade to Professional'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
