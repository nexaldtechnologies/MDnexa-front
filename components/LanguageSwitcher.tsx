
import React from 'react';
import { LANGUAGES, LanguageCode } from '../services/translations';

interface LanguageSwitcherProps {
    currentLanguage: LanguageCode;
    onLanguageChange: (lang: LanguageCode) => void;
    className?: string; // Add className prop for flexibility
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
    currentLanguage,
    onLanguageChange,
    className = ""
}) => {
    return (
        <div className={`relative ${className}`}>
            <select
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
                className="appearance-none bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs rounded px-3 py-2 pr-8 focus:outline-none focus:border-medical-500 transition-colors w-full cursor-pointer"
                style={{ direction: 'ltr' }} // Always keep country names LTR for readability
            >
                {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.name}
                    </option>
                ))}
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </div>
        </div>
    );
};
