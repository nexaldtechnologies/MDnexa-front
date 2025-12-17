import React from 'react';
import { Logo } from './Logo';

interface TermsPageProps {
    onBack: () => void;
    onStart: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onBack, onStart }) => {
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
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Terms of Service</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">Last updated: 23.11.2025</p>

                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="lead text-lg text-slate-700 dark:text-slate-300 mb-8">
                        Welcome to <strong>MDnexa™</strong>, a medical-education AI assistant provided by <strong>Trulonis Holding UG (haftungsbeschränkt)</strong> operating under the brand name <strong>Trulonis Tech™</strong>, based in Berlin, Germany.
                        <br /><br />
                        By accessing or using MDnexa™, you agree to the following Terms of Service. Please read them carefully.
                    </p>

                    <div className="space-y-10">
                        {/* Section 1 */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Educational Use Only</h2>
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
                                <p className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                                    MDnexa™ is designed exclusively for educational, informational, and study-support purposes.
                                </p>
                                <p className="text-sm text-blue-700 dark:text-blue-400">It is not a medical device and must not be used for:</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-blue-700 dark:text-blue-400">
                                    <li>Diagnosing conditions</li>
                                    <li>Treating patients</li>
                                    <li>Making clinical decisions</li>
                                    <li>Emergency or life-critical situations</li>
                                    <li>Providing professional medical advice</li>
                                </ul>
                                <p className="mt-3 text-sm font-bold text-blue-800 dark:text-blue-300">Always consult qualified healthcare professionals for medical decisions.</p>
                            </div>
                        </section>

                        {/* Section 2 */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. No Professional Relationship</h2>
                            <p className="text-slate-600 dark:text-slate-400">
                                Using MDnexa™ does not create a doctor-patient relationship, clinician-user relationship, or any form of professional medical relationship.
                            </p>
                        </section>

                        {/* Section 3 */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. Accuracy & Limitations</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-2">
                                While MDnexa™ aims to follow medical guidelines and best practices, it may:
                            </p>
                            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                                <li>Produce errors</li>
                                <li>Omit important details</li>
                                <li>Generate outdated information</li>
                                <li>Misinterpret queries</li>
                            </ul>
                            <p className="mt-2 font-medium text-slate-700 dark:text-slate-300">
                                You are responsible for verifying all information independently.
                            </p>
                        </section>

                        {/* Section 4 */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">4. User Responsibilities</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-2">You agree not to:</p>
                            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                                <li>Input real patient data or identifiable personal health information (PII/PHI)</li>
                                <li>Use MDnexa™ for clinical decision-making</li>
                                <li>Misuse the platform for harmful or illegal activities</li>
                                <li>Attempt reverse engineering or unauthorized access</li>
                            </ul>
                        </section>

                        {/* Section 5 */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">5. Accounts & Access</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-2">If MDnexa™ offers account creation, you must:</p>
                            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                                <li>Provide accurate information</li>
                                <li>Keep login credentials secure</li>
                                <li>Be at least 16 years old</li>
                            </ul>
                            <p className="mt-2 text-slate-600 dark:text-slate-400">
                                Trulonis Holding UG (haftungsbeschränkt) may suspend or terminate accounts that violate policies.
                            </p>
                        </section>

                        {/* Section 6 */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">6. Subscriptions & Payments</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-2">If MDnexa™ offers paid tiers:</p>
                            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                                <li>Payments are processed securely via third-party providers (e.g., Stripe)</li>
                                <li>Subscriptions may auto-renew</li>
                                <li>Refunds follow our refund policy, if applicable</li>
                            </ul>
                        </section>

                        {/* Section 7 */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">7. Intellectual Property</h2>
                            <p className="text-slate-600 dark:text-slate-400">
                                All content, branding, design, and technology of MDnexa™ belong to Trulonis Holding UG (haftungsbeschränkt) (d/b/a Trulonis Tech™). You may not copy, reproduce, or distribute content without permission.
                            </p>
                        </section>

                        {/* Section 8 */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">8. Service Availability</h2>
                            <p className="text-slate-600 dark:text-slate-400">
                                MDnexa™ may change, update, or discontinue features at any time. We cannot guarantee uninterrupted access.
                            </p>
                        </section>

                        {/* Section 9 */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">9. Limitation of Liability</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-2">Trulonis Holding UG (haftungsbeschränkt) is not liable for:</p>
                            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                                <li>Damages arising from reliance on MDnexa™</li>
                                <li>Errors, inaccuracies, or omissions</li>
                                <li>Service interruptions</li>
                            </ul>
                            <p className="mt-2 font-medium text-slate-700 dark:text-slate-300">
                                Your use of MDnexa™ is at your own risk.
                            </p>
                        </section>

                        {/* Section 10 */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">10. Governing Law</h2>
                            <p className="text-slate-600 dark:text-slate-400">
                                These Terms are governed by the laws of Germany. Any disputes fall under the jurisdiction of Berlin courts.
                            </p>
                        </section>

                        {/* Section 11 */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">11. Changes to Terms</h2>
                            <p className="text-slate-600 dark:text-slate-400">
                                We may update these Terms. Continued use means you accept the changes.
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