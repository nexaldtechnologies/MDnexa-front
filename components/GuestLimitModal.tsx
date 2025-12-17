
import React from 'react';

interface GuestLimitModalProps {
    isOpen: boolean;
    onLogin: () => void;
    onSignup: () => void;
}

export const GuestLimitModal: React.FC<GuestLimitModalProps> = ({
    isOpen,
    onLogin,
    onSignup,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 p-8 text-center transform transition-all scale-100">

                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-500 dark:text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                </div>

                <p className="text-slate-800 dark:text-white mb-8 text-lg font-medium leading-relaxed">
                    To continue using MDnexa and access unlimited information, please log in or create an account
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={onSignup}
                        className="w-full py-3 px-4 bg-medical-600 hover:bg-medical-700 text-white font-semibold rounded-xl shadow-lg shadow-medical-600/20 transition-all transform hover:-translate-y-0.5"
                    >
                        Sign Up
                    </button>
                    <button
                        onClick={onLogin}
                        className="w-full py-3 px-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                        Log In
                    </button>
                </div>
            </div>
        </div>
    );
};
