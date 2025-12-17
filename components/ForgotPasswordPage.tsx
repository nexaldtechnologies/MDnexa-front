import React, { useState } from "react";
import { supabase } from "../services/supabaseClient";
import { Logo } from "./Logo";
import { apiFetch } from "../services/api";

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("[PW_RESET_CLIENT] submitting", email);
        setStatus("loading");
        setErrorMessage(null);

        try {


            // ...

            const data = await apiFetch('/auth/forgot-password', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            console.log("[PW_RESET_CLIENT] response", data);

            if (data.success) {
                setStatus("success");
            } else {
                setStatus("error");
                setErrorMessage(data.message || "Something went wrong while sending the reset email.");
            }
        } catch (err: any) {
            console.error("[PW_RESET_CLIENT] unexpected error", err);
            setStatus("error");
            setErrorMessage(err?.message ?? "Unexpected error");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-slate-100 dark:border-slate-800">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 text-medical-600">
                        <Logo className="w-full h-full" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Reset Password</h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Enter the email you used to sign up. We’ll send you a reset link.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 transition-all text-slate-900 dark:text-white"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full py-3.5 bg-medical-600 hover:bg-medical-700 text-white font-bold rounded-xl shadow-lg shadow-medical-600/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {status === "loading" ? "Sending..." : "Send reset link"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="text-slate-600 dark:text-slate-400 font-semibold hover:text-medical-600 dark:hover:text-medical-400 transition-colors"
                    >
                        Back to Login
                    </button>
                </div>

                {status === "success" && (
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-xl text-center">
                        We’ve sent a reset link to this email.
                    </div>
                )}

                {status === "error" && (
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-center">
                        {errorMessage ?? "Something went wrong. Please try again."}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
