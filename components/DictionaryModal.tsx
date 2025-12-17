
import React, { useState, useRef, useEffect } from 'react';
import { lookupMedicalTerm } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';
import { VOICE_LANGUAGES, isArabic } from '../constants';

interface DictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  region: string;
  language: string;
}

export const DictionaryModal: React.FC<DictionaryModalProps> = ({ isOpen, onClose, region, language }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [definition, setDefinition] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get readable language name
  const languageName = Object.keys(VOICE_LANGUAGES).find(key => VOICE_LANGUAGES[key] === language) || language;
  const isRTL = isArabic(language);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isOpen) {
      setSearchTerm('');
      setDefinition(null);
      setError(null);
      setIsCopied(false);
      setShowDisclaimer(true); // Reset disclaimer visibility on reopen
    }
  }, [isOpen]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setDefinition(null);
    setError(null);
    setIsCopied(false);

    try {
      const result = await lookupMedicalTerm(searchTerm, region, language);
      setDefinition(result);
    } catch (err) {
      setError("Failed to retrieve definition. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!definition) return;
    try {
      await navigator.clipboard.writeText(definition);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-xl shadow-2xl animate-fade-in overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg text-teal-600 dark:text-teal-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Medical Dictionary</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 pb-2">
          <form onSubmit={handleSearch} className="relative">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Enter medical term (${languageName})...`}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <button
              type="submit"
              disabled={!searchTerm.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Search
            </button>
          </form>

          {/* Language Disclaimer */}
          {showDisclaimer && (
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
              <span>Searching in <strong>{languageName}</strong>. You can change this in Settings.</span>
              <button
                onClick={() => setShowDisclaimer(false)}
                className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                title="Dismiss"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 min-h-[300px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3">
              <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
              <span className="text-sm font-medium">Retrieving clinical definition...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <p className="text-slate-800 dark:text-white font-medium">{error}</p>
            </div>
          ) : definition ? (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-800 relative group">
              <button
                onClick={handleCopy}
                className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} p-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 shadow-sm border border-slate-200 dark:border-slate-600 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100`}
                title="Copy Definition"
              >
                {isCopied ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-500">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                )}
              </button>
              <div dir={isRTL ? "rtl" : "ltr"} className={isRTL ? "text-right" : "text-left"}>
                <MarkdownRenderer content={definition} isRTL={isRTL} className={isRTL ? "text-right" : "text-left"} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mb-4 opacity-30">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              <p className="text-sm">Enter a term to get a quick clinical definition<br />based on <strong>{region}</strong> standards.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
