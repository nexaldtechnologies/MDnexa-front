
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { apiRequest } from '../services/api';
import { Logo } from './Logo';

interface AuthPageProps {
    onBack: () => void;
    onSuccess: () => void;
    initialView?: 'login' | 'signup';
    pendingSubscriptionPriceId?: string;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onBack, onSuccess, initialView = 'login', pendingSubscriptionPriceId }) => {
    console.log('[FORGOT] Component mounted (AuthPage)');
    const [view, setView] = useState<'login' | 'signup' | 'forgot-password'>(initialView);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Referral State
    const [referralCode, setReferralCode] = useState<string | null>(null);
    const [referralData, setReferralData] = useState<any>(null); // { valid, promo_code, discount_percent, table }

    // Check for referral on mount
    useEffect(() => {
        console.log("AuthPage Mounted. View:", view);
        const storedRef = localStorage.getItem('mdnexa_ref');
        if (storedRef) {
            setReferralCode(storedRef);
            validateReferral(storedRef);
        }
    }, [view]);

    const validateReferral = async (code: string) => {
        try {
            const data = await apiRequest(`/referrals/validate?code=${code}`);
            if (data && data.valid) {
                // Normalize for easier checking
                if (!data.table && data.category) {
                    // logical guess if table is missing, but usually API returns it. 
                    // We will rely on category or API fix.
                }
                setReferralData(data);
            } else {
                // Invalid or inactive, ignore or clear? keeping quiet is usually better UX than erroring unless user typed it manually
                console.log("Referral code invalid:", data?.message);
                localStorage.removeItem('mdnexa_ref'); // Clear invalid code
            }
        } catch (err) {
            console.error("Referral validation failed", err);
        }
    };

    const [showResend, setShowResend] = useState(false);

    const resendVerification = async () => {
        if (!email) return;
        setLoading(true);
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email,
            });
            if (error) throw error;
            setSuccessMessage("Verification email sent! Please check your inbox.");
            setShowResend(false);
        } catch (err: any) {
            console.error("Resend error:", err);
            // Limit rate limit errors display or general errors
            setError(err.message || "Failed to resend verification.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        setShowResend(false);

        // Forgot Password Flow
        if (view === 'forgot-password') {
            // ... (existing forgot password logic) ...
            console.log('[FORGOT] submitting reset for', email);
            try {
                // Use window.location.origin to ensure correct environment (localhost vs prod)
                const redirectUrl = `${window.location.origin}/reset-password`;

                const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: redirectUrl,
                });

                if (error) {
                    console.error('[FORGOT] Error:', error);
                    setError(error.message);
                } else {
                    setSuccessMessage('If an account exists for this email, a reset link has been sent.');
                }
            } catch (err: any) {
                console.error('[FORGOT] Exception:', err);
                setError(err.message || 'Failed to process request.');
            } finally {
                setLoading(false);
            }
            return;
        }

        const STRIPE_LINKS: Record<string, string> = {
            'price_1SYuANFvNzuNoc9FLyLTf8ny': 'https://buy.stripe.com/14A9AT2BCfxj47Rdci5Ne06',
            'price_1SYuB2FvNzuNoc9FjxK1LNyV': 'https://buy.stripe.com/00w5kDfoo3OB5bV4FM5Ne01'
        };

        // Pre-calculate target URL (existing logic)
        let targetUrl: string | undefined;
        if (view === 'login') {
            if (pendingSubscriptionPriceId) {
                targetUrl = STRIPE_LINKS[pendingSubscriptionPriceId];
            }
        } else {
            const isFreeAccess = referralData && ['team_referrals', 'family_referrals', 'ambassador_referrals', 'ambassador', 'team', 'family'].includes(referralData.table || referralData.category);

            if (isFreeAccess) {
                targetUrl = undefined;
            } else {
                const priceIdToUse = pendingSubscriptionPriceId || 'price_1SYuANFvNzuNoc9FLyLTf8ny';
                targetUrl = STRIPE_LINKS[priceIdToUse];
                if (targetUrl && referralData?.promo_code) {
                    targetUrl += `?prefilled_promo_code=${referralData.promo_code}`;
                }
            }
        }

        try {
            if (view === 'login') {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;

                // Sync token explicitly
                if (data.session) {
                    localStorage.setItem('token', data.session.access_token);
                    localStorage.setItem('user', JSON.stringify(data.session.user));
                }

                if (targetUrl) {
                    window.location.href = targetUrl;
                    return;
                }

                onSuccess();

            } else {

                // Use Supabase Direct Signup
                try {
                    console.log("Attempting Supabase signup...");
                    const { data: authData, error: authError } = await supabase.auth.signUp({
                        email,
                        password,
                        options: {
                            data: {
                                full_name: name,
                                ref_source: referralCode || undefined,
                            }
                        }
                    });

                    if (authError) throw authError;

                    // Track Usage (existing logic)
                    if (referralData) {
                        try {
                            apiRequest('/referrals/track', 'POST', {
                                code: referralData.code,
                                table: referralData.table
                            }).catch(err => console.warn("Referral tracking schema check", err));
                        } catch (e) { }
                    }

                    localStorage.removeItem('mdnexa_ref');

                    const session = authData.session;
                    const user = authData.user;

                    if (session) {
                        // Success - Auto Confirmed
                        localStorage.setItem('token', session.access_token);
                        localStorage.setItem('user', JSON.stringify(session.user));

                        if (targetUrl) {
                            window.location.href = targetUrl;
                            return;
                        }
                        onSuccess();
                    } else if (user) {
                        // User created but no session -> Email confirmation required
                        console.log("User created, waiting for email confirmation.");
                        setSuccessMessage("Account created! Please check your email inbox (and spam) to confirm your account.");

                        // It is possible the user was ALREADY created but unverified, capturing that case here too:
                        if (user.identities && user.identities.length === 0) {
                            // This actually means user existed? No, identities length 0 usually means existing user in some contexts,
                            // but generally Supabase throws error for "User already registered".
                            // If we get here, it's usually a fresh success or a resend trigger logic.
                        }
                    } else {
                        throw new Error("Signup successful but no user returned.");
                    }

                } catch (signupErr: any) {
                    console.error("Signup failed:", signupErr);

                    // Handle "User already registered"
                    if (signupErr.message.includes("User already registered")) {
                        setError("Account already exists. Please log in.");
                        setView('login');
                        // Optionally auto-submit login? No, simpler to just switch view.
                    } else {
                        throw new Error(signupErr.message || "Signup failed");
                    }
                }
            }
        } catch (err: any) {
            console.error("Auth error:", err);
            // Improving error visibility
            let msg = err.message || 'An error occurred during authentication.';

            if (msg.includes("Invalid login credentials")) {
                msg = "Invalid email or password.";
            } else if (msg.includes("Email not confirmed")) {
                msg = "Email not confirmed. Please verify your account.";
                setShowResend(true);
            }

            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] bg-white dark:bg-[#0B1120] flex flex-col items-center justify-center p-4">
            {/* Header / Back */}
            <button
                onClick={onBack}
                className="absolute top-6 left-6 p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
            </button>

            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 mx-auto mb-4 text-medical-600">
                        <Logo className="w-full h-full" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        {view === 'login' ? 'Welcome Back' : view === 'signup' ? 'Create Account' : 'Reset Password'}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        {view === 'login'
                            ? 'Enter your credentials to access your account'
                            : view === 'signup'
                                ? 'Sign up to start your medical AI journey'
                                : 'Enter your email to receive a reset link'}
                    </p>

                    {/* Startup/Referral Badge */}
                    {view === 'signup' && referralData && (
                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium border border-green-200 dark:border-green-800 animate-fade-in-up">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                            </svg>
                            {referralData.category && ['team_referrals', 'family_referrals', 'ambassador_referrals', 'ambassador', 'team', 'family'].includes(referralData.table || referralData.category)
                                ? 'Unlimited Access Unlocked (Free)'
                                : `${referralData.category ? referralData.category + ' ' : ''}Referral Applied: ${referralData.discount_percent}% Off`
                            }
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" target="_self">
                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-300 text-sm">
                            <p>{error}</p>
                            {showResend && (
                                <button
                                    type="button"
                                    onClick={resendVerification}
                                    className="mt-2 text-xs font-semibold underline hover:text-red-800 dark:hover:text-red-200"
                                >
                                    Resend Verification Email
                                </button>
                            )}
                        </div>
                    )}
                    {successMessage && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-300 text-sm">
                            {successMessage}
                        </div>
                    )}
                    {view === 'signup' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 transition-all text-slate-900 dark:text-white"
                                placeholder="Dr. Jane Doe"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value.trim())}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 transition-all text-slate-900 dark:text-white"
                            placeholder="doctor@hospital.com"
                        />
                    </div>

                    {view === 'signup' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Referral Code (Optional)</label>
                            <input
                                type="text"
                                value={referralCode || ''}
                                onChange={(e) => {
                                    const val = e.target.value.trim();
                                    setReferralCode(val);
                                    if (val.length > 2) {
                                        validateReferral(val);
                                    } else {
                                        setReferralData(null);
                                    }
                                }}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 transition-all text-slate-900 dark:text-white"
                                placeholder="Have a code?"
                            />
                        </div>
                    )}

                    {view !== 'forgot-password' && (
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                                {view === 'login' && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            window.history.pushState({}, '', '/forgot-password');
                                            window.dispatchEvent(new PopStateEvent('popstate'));
                                        }}
                                        className="text-xs font-semibold text-medical-600 dark:text-medical-400 hover:underline"
                                    >
                                        Forgot password?
                                    </button>
                                )}
                            </div>
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 transition-all text-slate-900 dark:text-white"
                                placeholder="••••••••"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-medical-600 hover:bg-medical-700 text-white font-bold rounded-xl shadow-lg shadow-medical-600/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Processing...
                            </div>
                        ) : (
                            view === 'login' ? 'Log In' : view === 'signup' ? 'Sign Up' : 'Send Reset Link'
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    {view === 'forgot-password' ? (
                        <button
                            onClick={() => { setView('login'); setError(null); setSuccessMessage(null); }}
                            className="text-slate-600 dark:text-slate-400 font-semibold hover:text-medical-600 dark:hover:text-medical-400 transition-colors"
                        >
                            Back to Login
                        </button>
                    ) : (
                        <p className="text-slate-600 dark:text-slate-400">
                            {view === 'login' ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => {
                                    setView(view === 'login' ? 'signup' : 'login');
                                    setError(null);
                                    setSuccessMessage(null);
                                }}
                                className="text-medical-600 dark:text-medical-400 font-semibold hover:underline"
                            >
                                {view === 'login' ? 'Sign up' : 'Log in'}
                            </button>
                        </p>
                    )}
                </div>
            </div >
        </div >
    );
};
