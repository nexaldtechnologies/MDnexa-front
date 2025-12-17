
import React from 'react';
import { REGIONS_DATA, VOICE_LANGUAGES } from '../constants';
import { ChatSession } from '../types';
import { Logo } from './Logo';


interface SidebarProps {
    region: string;
    setRegion: (r: string) => void;
    country: string;
    setCountry: (c: string) => void;
    language: string;
    setLanguage: (l: string) => void;
    isShortAnswer: boolean;
    setIsShortAnswer: (s: boolean) => void;
    isOpen: boolean;
    toggleSidebar: () => void;
    resetChat: () => void;
    onBackToLanding: () => void;
    sessions: ChatSession[];
    currentSessionId: string;
    onLoadSession: (session: ChatSession) => void;
    onDeleteSession: (id: string, e: React.MouseEvent) => void;
    onToggleFavorite: (id: string) => void;
    onOpenSettings: () => void;
    onOpenDictionary: () => void;
    onOpenShare: (title: string, text: string, url?: string) => void;
    saveSettings: boolean;
    setSaveSettings: (save: boolean) => void;
    isAuthenticated: boolean;
    onOpenAuth: (view: 'login' | 'signup') => void;
    onLogout: () => void;
    userName: string;
    userRole: string;
    onClearAll: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    region,
    setRegion,
    country,
    setCountry,
    language,
    setLanguage,
    isShortAnswer,
    setIsShortAnswer,
    isOpen,
    toggleSidebar,
    resetChat,
    sessions,
    currentSessionId,
    onLoadSession,
    onDeleteSession,
    onToggleFavorite,
    onOpenSettings,
    onOpenDictionary,
    onBackToLanding,
    onOpenShare,
    saveSettings,
    setSaveSettings,
    isAuthenticated,
    onOpenAuth,
    onLogout,
    userName,
    userRole,
    onClearAll
}) => {

    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRegion = e.target.value;
        setRegion(newRegion);
        if (REGIONS_DATA[newRegion] && REGIONS_DATA[newRegion].length > 0) {
            setCountry(REGIONS_DATA[newRegion][0]);
        }
    };

    const favorites = sessions.filter(s => s.isFavorite);
    const recent = sessions.filter(s => !s.isFavorite);

    return (
        <>
            {/* Mobile Overlay - Only visible on small screens when open */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/10 z-20 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar Content */}
            <aside
                className={`
          inset-y-0 left-0 z-30 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col 
          transition-all duration-300 ease-in-out h-full
          
          /* Mobile Behavior: Fixed Overlay */
          fixed w-72 shadow-2xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}

          /* Desktop Behavior (lg+): Static Push */
          lg:static lg:translate-x-0 lg:shadow-none
          ${isOpen ? 'lg:w-72' : 'lg:w-0 lg:border-r-0 lg:overflow-hidden'}
        `}
            >
                {/* Inner Container - Fixed width to prevent content squishing during collapse animation */}
                <div className="w-72 h-full flex flex-col min-w-[18rem]">
                    {/* Brand Header */}
                    <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/60 bg-slate-900">
                        <button
                            onClick={onBackToLanding}
                            className="flex items-center gap-2.5 text-white hover:text-medical-400 transition-colors focus:outline-none group"
                        >
                            <div className="w-7 h-7">
                                <Logo className="w-full h-full" />
                            </div>
                            <span className="text-lg font-bold tracking-tight">MDnexa<span className="text-medical-500">™</span></span>
                        </button>
                        <button onClick={toggleSidebar} className="text-slate-400 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6 space-y-8">

                        {/* Primary Actions */}
                        <div className="space-y-3">
                            <button
                                onClick={resetChat}
                                className="w-full flex items-center justify-center gap-2 bg-medical-600 hover:bg-medical-500 text-white py-2.5 rounded-lg transition-all text-sm font-semibold shadow-lg shadow-medical-900/20 border border-medical-500 hover:border-medical-400 group"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:scale-110 transition-transform">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Create New Session
                            </button>

                            <button
                                onClick={onOpenDictionary}
                                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded-lg transition-all text-sm font-medium border border-slate-700 hover:border-slate-600 group"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-teal-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                </svg>
                                Medical Dictionary
                            </button>
                        </div>

                        {/* Configuration Panel */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                                <h2 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Protocol Config</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="group">
                                    <label className="text-[11px] text-slate-400 mb-1.5 block font-medium group-hover:text-medical-400 transition-colors">Region</label>
                                    <div className="relative">
                                        <select
                                            value={region}
                                            onChange={handleRegionChange}
                                            className="w-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded px-3 py-2 text-xs text-slate-200 focus:border-medical-500 focus:ring-1 focus:ring-medical-500 focus:outline-none appearance-none cursor-pointer transition-colors"
                                        >
                                            {Object.keys(REGIONS_DATA).map(r => (
                                                <option key={r} value={r}>{r}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="text-[11px] text-slate-400 mb-1.5 block font-medium group-hover:text-medical-400 transition-colors">Country (Guidelines)</label>
                                    <div className="relative">
                                        <select
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            className="w-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded px-3 py-2 text-xs text-slate-200 focus:border-medical-500 focus:ring-1 focus:ring-medical-500 focus:outline-none appearance-none cursor-pointer transition-colors"
                                        >
                                            {REGIONS_DATA[region]?.map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="text-[11px] text-slate-400 mb-1.5 block font-medium group-hover:text-medical-400 transition-colors">Language</label>
                                    <div className="relative">
                                        <select
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value)}
                                            className="w-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded px-3 py-2 text-xs text-slate-200 focus:border-medical-500 focus:ring-1 focus:ring-medical-500 focus:outline-none appearance-none cursor-pointer transition-colors"
                                        >
                                            {Object.keys(VOICE_LANGUAGES).map((langName) => (
                                                <option key={langName} value={langName}>{langName}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Short Answer Toggle */}
                                <div className="flex items-start gap-2 pt-1 border-t border-slate-800 mt-2">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="short-answer"
                                            type="checkbox"
                                            checked={isShortAnswer}
                                            onChange={(e) => setIsShortAnswer(e.target.checked)}
                                            className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-medical-600 focus:ring-medical-600 focus:ring-offset-slate-900 cursor-pointer"
                                        />
                                    </div>
                                    <label htmlFor="short-answer" className="text-xs text-slate-400 cursor-pointer select-none leading-5 group-hover:text-medical-400 transition-colors">
                                        Concise / Short Answers
                                    </label>
                                </div>

                                {/* Save Settings Checkbox */}
                                <div className="flex items-start gap-2 pt-1">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="save-settings"
                                            type="checkbox"
                                            checked={saveSettings}
                                            onChange={(e) => setSaveSettings(e.target.checked)}
                                            className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-medical-600 focus:ring-medical-600 focus:ring-offset-slate-900 cursor-pointer"
                                        />
                                    </div>
                                    <label htmlFor="save-settings" className="text-xs text-slate-400 cursor-pointer select-none leading-5">
                                        Remember configuration
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Favorites List */}
                        {favorites.length > 0 && (
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
                                    <h2 className="text-[10px] uppercase tracking-widest text-yellow-500/80 font-bold flex items-center gap-1.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                        </svg>
                                        Favorites
                                    </h2>
                                </div>
                                <ul className="space-y-1">
                                    {favorites.map((session) => (
                                        <li key={session.id} className="group relative">
                                            <button
                                                onClick={() => onLoadSession(session)}
                                                className={`w-full text-left px-3 py-2 rounded border transition-all pr-8 ${session.id === currentSessionId
                                                    ? 'bg-slate-800 border-slate-700 text-white shadow-sm'
                                                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                                                    }`}
                                            >
                                                <div className="truncate text-xs font-medium">{session.title}</div>
                                                <div className="text-[10px] opacity-50 mt-0.5 font-mono">{session.country.substring(0, 20)}</div>
                                            </button>
                                            {/* Star Button */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onToggleFavorite(session.id); }}
                                                className="absolute right-7 top-1/2 -translate-y-1/2 p-1 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Remove Favorite"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                                                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            {/* Delete Button */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (window.confirm('Delete this favorite session?')) {
                                                        onDeleteSession(session.id, e);
                                                    }
                                                }}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Delete"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Session History (Non-favorites) */}
                        {recent.length > 0 && (
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
                                    <h2 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">History</h2>
                                </div>
                                <ul className="space-y-1">
                                    {recent.map((session) => (
                                        <li key={session.id} className="group relative">
                                            <button
                                                onClick={() => onLoadSession(session)}
                                                className={`w-full text-left px-3 py-2 rounded border transition-all pr-8 ${session.id === currentSessionId
                                                    ? 'bg-slate-800 border-slate-700 text-white shadow-sm'
                                                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                                                    }`}
                                            >
                                                <div className="truncate text-xs font-medium">{session.title}</div>
                                                <div className="text-[10px] opacity-50 mt-0.5 font-mono">{session.country.substring(0, 20)}</div>
                                            </button>

                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {/* Star Button */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(session.id); }}
                                                    className="p-1 text-slate-500 hover:text-yellow-400"
                                                    title="Favorite"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.563.045.796.77.398 1.107l-4.154 3.507a.562.562 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.154-3.507c-.398-.337-.165-1.062.398-1.107l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                                    </svg>
                                                </button>
                                                {/* Delete Button */}
                                                <button
                                                    onClick={(e) => {
                                                        if (window.confirm('Are you sure you want to delete this session?')) {
                                                            onDeleteSession(session.id, e);
                                                        }
                                                    }}
                                                    className="p-1 text-slate-600 hover:text-red-400"
                                                    title="Delete"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-1">
                        {!isAuthenticated ? (
                            <button
                                onClick={() => onOpenAuth('login')}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-medical-600 to-medical-500 hover:from-medical-500 hover:to-medical-400 text-white py-2.5 rounded-lg transition-all text-sm font-bold shadow-lg shadow-medical-900/40 border border-medical-500/50 hover:shadow-medical-500/20 mb-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                                Login / Sign Up
                            </button>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <div className="px-3 py-2 bg-slate-800/50 rounded-lg flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-medical-600 flex items-center justify-center text-white text-xs font-bold">
                                        {userName ? userName.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-xs font-bold text-white truncate">{userName || 'User'}</span>
                                        <span className="text-[10px] text-medical-400 font-medium truncate">{userRole || 'Member'}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={onLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 group border border-transparent hover:border-slate-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:text-red-400 transition-colors">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                    </svg>
                                    Log Out
                                </button>
                            </div>
                        )}
                        <button
                            onClick={() => onOpenShare("MDnexa™ - Medical AI Assistant", "Check out MDnexa™, the guideline-aware clinical companion.", "https://www.mdnexa.com")}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 group border border-transparent hover:border-slate-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:text-medical-400 transition-colors">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                            </svg>
                            Share MDnexa™
                        </button>
                        <button
                            onClick={onOpenSettings}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 group border border-transparent hover:border-slate-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:text-medical-400 transition-colors">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            System Settings
                        </button>

                        {/* Clear History Button */}
                        <button
                            onClick={() => {
                                if (window.confirm('Are you sure you want to delete ALL chat history? This cannot be undone.')) {
                                    onClearAll();
                                }
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-800 group border border-transparent hover:border-slate-700 mt-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:text-red-500 transition-colors">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                            Clear All History
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};