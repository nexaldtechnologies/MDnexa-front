

import React from 'react';
import { Logo } from './Logo';


import { FloatingBackground } from './FloatingBackground';

interface LandingPageProps {
  onStart: () => void;
  onPricing: () => void;
  onBlog: () => void;
  onAbout: () => void;
  onTerms: () => void;
  onPrivacy: () => void;
  onContact: () => void;
  onLogin: () => void;
  onLogout: () => void;
  onToggleTheme: () => void;
  isAuthenticated: boolean;
  userName?: string;

}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStart,
  onPricing,
  onBlog,
  onAbout,
  onTerms,
  onPrivacy,
  onContact,
  onLogin,
  onLogout,
  onToggleTheme,
  isAuthenticated,
  userName = 'User'
}) => {


  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-white font-sans selection:bg-medical-100 dark:selection:bg-medical-900">
      {/* Navigation */}
      <div className="w-full bg-blue-50 dark:bg-slate-900 sticky top-0 z-50 shadow-sm">
        <nav className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 flex items-center justify-center text-medical-600">
              <Logo className="w-full h-full" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">MDnexa™</span>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={onToggleTheme}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              title="Toggle theme"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 hidden dark:block">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 block dark:hidden">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            </button>
            <button
              onClick={onAbout}
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-medical-600 dark:hover:text-white transition-colors"
            >
              About Us
            </button>
            <button
              onClick={onBlog}
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-medical-600 dark:hover:text-white transition-colors"
            >
              Blog
            </button>
            <button
              onClick={onPricing}
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-medical-600 dark:hover:text-white transition-colors"
            >
              Pricing
            </button>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Logged in as <span className="text-slate-900 dark:text-white font-semibold">{userName}</span>
                </span>
                <button
                  onClick={onLogout}
                  className="px-6 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="px-6 py-2.5 rounded-lg bg-medical-600 text-white text-sm font-bold shadow-lg shadow-medical-600/20 hover:bg-medical-700 transition-all transform hover:-translate-y-0.5"
              >
                Login
              </button>
            )}
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <header className="relative pt-16 pb-24 lg:pt-32 lg:pb-32 overflow-hidden">
        {/* Animated Geometric Background */}
        <FloatingBackground />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">

          <h1 className="text-4xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight max-w-4xl mx-auto">
            Your Instant AI-powered <span className="text-medical-600 dark:text-medical-500">Clinical Pocketbook</span>
          </h1>

          <p className="text-lg md:text-xl font-medium text-slate-600 dark:text-slate-300 mb-10 italic">
            "Because Real Patients' Complexity Doesn't Fit Textbook Chapters"
          </p>

          <div className="flex justify-center mb-6">
            <div className="px-6 py-3 bg-medical-50 dark:bg-medical-900/40 border border-medical-100 dark:border-medical-900/50 rounded-lg shadow-sm backdrop-blur-sm">
              <span className="text-medical-700 dark:text-medical-300 font-bold uppercase tracking-widest text-sm">
                Built by German Physicians
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-3xl mx-auto mb-10 font-medium leading-relaxed">
            MDnexa™ provides structured, guideline-aligned medical information to support clinicians in their daily work.<br className="hidden md:block" />
            It offers clear explanations, drug-safety insights, interaction overviews, and evidence-based educational content - helping clinicians think through complex situations with greater clarity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 bg-medical-600 hover:bg-medical-700 text-white font-semibold rounded-xl shadow-xl shadow-medical-600/20 transition-all transform hover:-translate-y-0.5"
            >
              {isAuthenticated ? 'Start Session' : 'Start Now'}
            </button>
          </div>


        </div>
      </header>

      {/* Target Audience & Deliverables Section */}
      <section className="py-20 bg-white dark:bg-slate-950 border-y border-slate-100 dark:border-slate-900 relative z-10">
        <div className="max-w-6xl mx-auto px-6">

          {/* Who It Is For */}
          <div className="text-center mb-20">
            <span className="text-sm font-bold text-medical-600 dark:text-medical-400 uppercase tracking-widest mb-6 block">
              Who It Is For
            </span>

            <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-3 text-base md:text-lg font-medium text-slate-600 dark:text-slate-400 mb-10 max-w-4xl mx-auto">
              {[
                "Physicians", "Residents", "Medical Students", "Emergency Medicine",
                "Intensive Care", "Surgery", "Anesthesiology", "Internal Medicine"
              ].map((role, idx, arr) => (
                <React.Fragment key={role}>
                  <span className="text-slate-900 dark:text-white">{role}</span>
                  {idx < arr.length - 1 && <span className="text-slate-300 dark:text-slate-700">•</span>}
                </React.Fragment>
              ))}
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 md:p-10 border border-slate-100 dark:border-slate-800 max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Your Everyday Clinical Companion
              </h2>
              <div className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed space-y-4">
                <p>
                  Inspired by the trusted pocket reference books clinicians have carried for decades - now continuously updated, instantly searchable, and able to contextualize information within modern medical practice.
                </p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  MDnexa™ is designed to support professional judgment, not replace it.
                </p>
              </div>
            </div>
          </div>

          {/* What MDnexa Delivers */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">What MDnexa Delivers</h2>
              <ul className="space-y-4">
                {[
                  "Structured diagnostic support",
                  "Evidence-based management steps",
                  "Pathophysiology explanations",
                  "Dose and regimen adjustments (age, weight, renal/hepatic function)",
                  "Drug interactions and safety alerts",
                  "Local guideline adaptation",
                  "Concise, clinically relevant summaries",
                  "Medical Dictionary"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-medical-100 dark:bg-medical-900/30 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-medical-600 dark:text-medical-400">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-lg text-slate-700 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-medical-50 dark:bg-medical-900/10 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-xl">
                <div className="w-24 h-24 text-medical-600 mb-6">
                  <Logo className="w-full h-full" />
                </div>
                <div className="font-serif italic text-xl md:text-2xl text-slate-500 dark:text-slate-400">
                  Developed by Clinicians For Clinicians
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Localized Guidelines</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Automatically adapts responses based on the standard of care, drug names, and protocols for your selected country.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Voice Dictation</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Hands-free operation with medical-grade speech recognition supporting over 40 languages and dialects.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/20 rounded-xl flex items-center justify-center text-teal-600 dark:text-teal-400 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Clinical Accuracy</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Powered by advanced LLMs specifically tuned for medical reasoning, differential diagnosis, and treatment planning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
          <div className="text-sm text-slate-500 dark:text-slate-500">
            © 2025 MDnexa™ | Powered by Trulonis Tech™. All rights reserved.
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <button onClick={onTerms} className="text-sm text-slate-500 hover:text-medical-600 dark:text-slate-500 dark:hover:text-medical-400 transition-colors">
              Terms of Service
            </button>
            <button onClick={onPrivacy} className="text-sm text-slate-500 hover:text-medical-600 dark:text-slate-500 dark:hover:text-medical-400 transition-colors">
              Privacy Policy
            </button>
            <button onClick={onContact} className="text-sm text-slate-500 hover:text-medical-600 dark:text-slate-500 dark:hover:text-medical-400 transition-colors">
              Contact
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
