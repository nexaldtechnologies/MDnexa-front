import React from 'react';
import { Logo } from './Logo';

interface AboutPageProps {
    onBack: () => void;
    onStart: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBack, onStart }) => {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-white font-sans selection:bg-medical-100 dark:selection:bg-medical-900 flex flex-col">
            {/* Navigation */}
            <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between w-full sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-40 border-b border-slate-100 dark:border-slate-900">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2.5 hover:opacity-80 transition-opacity group"
                >
                    <div className="w-8 h-8 flex items-center justify-center overflow-hidden">
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
                        About <span className="text-medical-600 dark:text-medical-400">MDnexa™</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Innovating the future of medical learning from Berlin, Germany.
                    </p>
                    <p className="mt-4 text-xl font-bold text-slate-900 dark:text-white tracking-wide">
                        Built by Clinicians.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">

                {/* Intro */}
                <section>
                    <p className="text-lg md:text-xl leading-relaxed text-slate-700 dark:text-slate-300">
                        MDnexa™ is an advanced, guideline-aware medical education AI assistant developed by <span className="font-semibold text-slate-900 dark:text-white">Trulonis Tech™</span>, a physician-led health-technology company based in Berlin, Germany.
                    </p>
                </section>

                {/* Mission */}
                <section className="bg-medical-50 dark:bg-medical-900/10 rounded-2xl p-8 md:p-10 border border-medical-100 dark:border-medical-900/30">
                    <h2 className="text-2xl font-bold text-medical-700 dark:text-medical-400 mb-4">Our Mission</h2>
                    <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                        To empower medical students, doctors, and healthcare professionals with structured, accurate, clinically aligned knowledge - instantly.
                    </p>
                </section>

                {/* Capabilities Grid */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">What We Do</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            "Understand pathophysiology",
                            "Explore differential diagnoses",
                            "Review drug suitability & interactions",
                            "Interpret labs, imaging, and clinical findings",
                            "Prepare for exams and OSCEs",
                            "Strengthen clinical reasoning"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-medical-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                            </div>
                        ))}
                    </div>
                    <p className="mt-6 text-slate-500 dark:text-slate-400 italic">
                        All within seconds - designed for education, not real-world patient care.
                    </p>
                </section>

                <hr className="border-slate-200 dark:border-slate-800" />

                {/* Who We Are */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Who We Are</h2>
                    <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                        Trulonis Tech™ is a Berlin-based medical AI company building safe, transparent, and high-quality tools for medical learning and hospital training.
                    </p>
                    <div className="grid md:grid-cols-4 gap-4 text-center">
                        {[
                            { icon: "🩺", text: "Clinical Expertise" },
                            { icon: "🤖", text: "AI Engineering" },
                            { icon: "🎓", text: "Medical Education" },
                            { icon: "🎨", text: "User-Centered Design" },
                        ].map((item, i) => (
                            <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                                <div className="text-2xl mb-2">{item.icon}</div>
                                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item.text}</div>
                            </div>
                        ))}
                    </div>
                    <p className="mt-6 text-slate-600 dark:text-slate-400">
                        Our broader vision is to create a modular medical intelligence ecosystem that supports every specialty - starting with MDnexa™.
                    </p>
                </section>

                {/* Why We Built This */}
                <section className="bg-blue-50 dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-medical-500 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <h2 className="text-2xl font-bold mb-6 relative z-10 text-slate-900 dark:text-white">Why We Built MDnexa™</h2>
                    <div className="space-y-4 text-slate-600 dark:text-slate-300 relative z-10">
                        <p>
                            Medicine is expanding rapidly, and healthcare professionals are under enormous pressure. Students face intense exam preparation, while clinicians must keep up with evolving guidelines.
                        </p>
                        <p>
                            MDnexa™ was created to solve these challenges by offering:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300 font-medium">
                            <li>Fast, structured medical explanations</li>
                            <li>Guideline-aware reasoning</li>
                            <li>Region-adapted outputs</li>
                            <li>Safe educational use</li>
                            <li>Clear, accurate breakdowns of complex topics</li>
                        </ul>
                        <p className="pt-4 font-semibold text-medical-600 dark:text-medical-400">
                            We believe medical learning should be accessible, intuitive, and modern - not overwhelming.
                        </p>
                    </div>
                </section>

                {/* Values */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Our Values</h2>
                    <div className="space-y-6">
                        {[
                            { title: "Safety First", desc: "MDnexa™ is strictly for educational use." },
                            { title: "Accuracy", desc: "Answers follow medical guidelines and structured clinical logic." },
                            { title: "Transparency", desc: "Clear disclaimers and limitations." },
                            { title: "Accessibility", desc: "High-quality medical learning for everyone." },
                            { title: "Respect", desc: "Tools that support, never replace." },
                        ].map((val, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="w-1.5 h-full min-h-[40px] bg-medical-500 rounded-full"></div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">{val.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400">{val.desc.replace('—', '-')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 py-12 mt-auto">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="flex flex-col items-center gap-2 mb-4">
                        <span className="font-bold text-slate-900 dark:text-white text-lg">Powered by Trulonis Tech™</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">Berlin, Germany</span>
                    </div>
                    <div className="text-sm text-slate-400 dark:text-slate-600">
                        Innovating the future of medical learning.
                    </div>
                </div>
            </footer>
        </div>
    );
};