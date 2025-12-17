import React from 'react';
import { Logo } from './Logo';

interface PrivacyPageProps {
    onBack: () => void;
    onStart: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onBack, onStart }) => {
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

            {/* Content */}
            <div className="flex-1 max-w-3xl mx-auto px-6 py-16">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Privacy Policy</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">Last updated: 23.11.2025</p>

                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="lead text-lg text-slate-700 dark:text-slate-300 mb-8">
                        This Privacy Policy explains how <strong>Trulonis Holding UG (haftungsbeschränkt)</strong> (operating as <strong>Trulonis Tech™</strong>), based in Berlin, Germany, handles your data when you use <strong>MDnexa™</strong>.
                        <br /><br />
                        We follow GDPR principles with a strong focus on privacy, safety, and transparency.
                    </p>

                    <div className="space-y-10">
                        {/* Section 1 */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">1. Data We Collect</h2>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">A. Information You Provide</h3>
                                    <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 space-y-1">
                                        <li>Email (if creating an account)</li>
                                        <li>Login credentials</li>
                                        <li>Subscription data (for paid plans)</li>
                                    </ul>
                                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-500 italic">We do not require or allow you to enter identifiable patient data.</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">B. Automatically Collected Data</h3>
                                    <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 space-y-1">
                                        <li>Device type</li>
                                        <li>Browser type</li>
                                        <li>Usage patterns</li>
                                        <li>Crash logs</li>
                                        <li>Basic analytics (anonymous whenever possible)</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">C. AI Interactions</h3>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Your text inputs may be processed to generate responses. We do not store them permanently unless needed for service functionality (e.g., chat history if enabled).
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 2 */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. No Patient Data Allowed</h2>
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg">
                                <p className="font-bold text-red-800 dark:text-red-300 mb-2">
                                    MDnexa™ is not a clinical tool.
                                </p>
                                <p className="text-sm text-red-700 dark:text-red-400 mb-2">
                                    You must not enter real patient names, identifiers, or medical records.
                                </p>
                                <p className="text-sm text-red-700 dark:text-red-400">
                                    If such data is entered accidentally, it will be processed only to generate the response and not stored for profiling.
                                </p>
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. How We Use Your Data</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-2">We use data to:</p>
                            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                                <li>Operate and improve MDnexa™</li>
                                <li>Provide customer support</li>
                                <li>Manage subscriptions</li>
                                <li>Optimize performance</li>
                                <li>Maintain security</li>
                            </ul>
                            <p className="mt-2 font-medium text-slate-700 dark:text-slate-300">
                                We never sell your personal data.
                            </p>
                        </section>

                        {/* Section 4 */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">4. Legal Basis (GDPR)</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-2">We process data based on:</p>
                            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                                <li><strong>Consent</strong> (account creation, marketing emails)</li>
                                <li><strong>Contract</strong> (providing access to MDnexa™)</li>
                                <li><strong>Legitimate interests</strong> (security, analytics)</li>
                            </ul>
                        </section>

                        {/* Section 5 */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">5. Third-Party Services</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-2">We may use secure third-party tools:</p>
                            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                                <li>Authentication (e.g., Google Login)</li>
                                <li>Payment processing (e.g., Stripe)</li>
                                <li>Hosting and analytics</li>
                            </ul>
                            <p className="mt-2 text-slate-600 dark:text-slate-400">
                                Each provider follows its own privacy rules.
                            </p>
                        </section>

                        {/* Section 6 */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">6. Cookies</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-2">We may use cookies for:</p>
                            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                                <li>Login sessions</li>
                                <li>Analytics</li>
                                <li>Preferences</li>
                            </ul>
                            <p className="mt-2 text-slate-600 dark:text-slate-400">
                                You can disable cookies in your browser settings.
                            </p>
                        </section>

                        {/* Section 7 */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">7. Your Rights (GDPR)</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-2">You have the right to:</p>
                            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                                <li>Access your data</li>
                                <li>Request deletion</li>
                                <li>Correct inaccuracies</li>
                                <li>Withdraw consent</li>
                                <li>Request data export</li>
                                <li>Lodge a complaint with a supervisory authority</li>
                            </ul>
                            <p className="mt-2 text-slate-600 dark:text-slate-400">
                                To exercise these rights, contact us at the email below.
                            </p>
                        </section>

                        {/* Section 8 */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">8. Data Security</h2>
                            <p className="text-slate-600 dark:text-slate-400">
                                We use industry-standard security measures, encryption, and access controls. No system is 100% secure, but we continuously improve protections.
                            </p>
                        </section>

                        {/* Section 9 */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">9. Data Retention</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-2">We keep personal data only as long as necessary for:</p>
                            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                                <li>Account management</li>
                                <li>Legal obligations</li>
                                <li>Security</li>
                                <li>Service operation</li>
                            </ul>
                            <p className="mt-2 text-slate-600 dark:text-slate-400">
                                You may request deletion at any time.
                            </p>
                        </section>

                        {/* Section 10 */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">10. Updates</h2>
                            <p className="text-slate-600 dark:text-slate-400">
                                This Privacy Policy may be updated. We will notify users of significant changes.
                            </p>
                        </section>
                    </div>
                </div>
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