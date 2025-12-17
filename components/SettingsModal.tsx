
import React, { useState, useEffect } from 'react';
import { apiRequest, apiFetch } from '../services/api';
import { supabase } from '../services/supabaseClient';
import { REGIONS_DATA, VOICE_LANGUAGES, PROFESSIONAL_ROLES } from '../constants';


interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearHistory: () => void;
  theme: string;
  onThemeChange: (theme: string) => void;
  region: string;
  setRegion: (r: string) => void;
  country: string;
  setCountry: (c: string) => void;
  fontSize: string;
  setFontSize: (s: string) => void;
  userName: string;
  setUserName: (n: string) => void;
  userRole: string;
  setUserRole: (r: string) => void;
  isAuthenticated: boolean;
  onOpenAuth: () => void;
  onLogout: () => void;
  language: string;
  setLanguage: (l: string) => void;
  isShortAnswer: boolean;
  setIsShortAnswer: (v: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onClearHistory,
  theme,
  onThemeChange,
  region,
  setRegion,
  country,
  setCountry,
  fontSize,
  setFontSize,
  userName,
  setUserName,
  userRole,
  setUserRole,
  isAuthenticated,
  onOpenAuth,
  onLogout,
  language,
  setLanguage,
  isShortAnswer,
  setIsShortAnswer
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'account'>('general');
  const [userProfile, setUserProfile] = useState<any>(null);
  // Removed explicit logoUrl state as it's part of userProfile
  const [savingLogo, setSavingLogo] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [loadingPortal, setLoadingPortal] = useState(false);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchUserProfile();
    }
  }, [isOpen, isAuthenticated]);

  const fetchUserProfile = async () => {
    // 1. Fetch from Auth Metadata (Fail-safe)
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserProfile((prev: any) => ({
          ...prev,
          full_name: user.user_metadata?.full_name || prev?.full_name,
          email: user.email || prev?.email,
          role: user.user_metadata?.role || prev?.role || 'user'
        }));
      }
    } catch (e) { console.error("Auth fetch failed", e); }

    // 2. Fetch from Backend (Source of Truth)
    try {
      const data = await apiRequest('/users/me');
      setUserProfile(data);

      // Fetch subscription status
      try {
        const { subscription } = await apiRequest('/subscriptions/status');
        setSubscription(subscription);
      } catch (subError) {
        console.log('No active subscription found or error fetching status');
      }
    } catch (error) {
      console.error('Error fetching user profile from API:', error);
    }
  };

  const handleManageSubscription = async () => {
    setLoadingPortal(true);
    try {
      const { url } = await apiRequest('/subscriptions/create-portal-session', 'POST');
      window.location.href = url;
    } catch (error) {
      console.error("Error creating portal session:", error);
      alert("Failed to open billing portal.");
    } finally {
      setLoadingPortal(false);
    }
  };

  // Removed handleUpdateLogo related to text input

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRegion = e.target.value;
    setRegion(newRegion);
    if (REGIONS_DATA[newRegion] && REGIONS_DATA[newRegion].length > 0) {
      setCountry(REGIONS_DATA[newRegion][0]);
    }
  };

  const handleResetPassword = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const email = user?.email;
      console.log("[PW_RESET_SETTINGS] requesting reset for current user", email);

      if (!email) {
        alert("Could not determine your email address.");
        return;
      }

      if (confirm(`Send password reset email to ${email}?`)) {


        // ...

        // ...

        const data = await apiFetch('/auth/forgot-password', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (data && data.success) {
          alert("We’ve sent a reset link to your email.");
        } else {
          alert(data.message || "Failed to send reset link.");
        }
      }
    } catch (error: any) {
      console.error("[PW_RESET_SETTINGS] Error:", error);
      alert(error.message || "An error occurred. Please try again.");
    }
  };



  const handleDeactivate = async () => {
    if (window.confirm("Are you sure you want to deactivate your account? This will permanently delete your data and log you out immediately.")) {
      try {
        await apiRequest('/users/delete-account', 'DELETE');
        alert("Account deactivated successfully.");
        onLogout(); // Log out immediately
        onClose();
      } catch (error) {
        console.error("Error deactivating account:", error);
        alert("Failed to deactivate account. Please try again or contact support.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl h-[600px] flex overflow-hidden shadow-2xl animate-fade-in transition-colors duration-200">
        {/* Sidebar */}
        <div className="w-1/3 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-4 flex flex-col gap-2 transition-colors duration-200">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white px-3 mb-4 mt-2">Settings</h2>
          <button
            onClick={() => setActiveTab('general')}
            className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${activeTab === 'general' ? 'bg-medical-100 dark:bg-medical-900/30 text-medical-700 dark:text-medical-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            General
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${activeTab === 'account' ? 'bg-medical-100 dark:bg-medical-900/30 text-medical-700 dark:text-medical-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            Account
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {activeTab === 'general' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">General Preferences</h3>

                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-200">Interface Theme</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Select your preferred color scheme</div>
                    </div>
                    <select
                      value={theme}
                      onChange={(e) => onThemeChange(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-lg p-2.5 text-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-medical-500"
                    >
                      <option value="light">Light Mode</option>
                      <option value="dark">Dark Mode</option>
                      <option value="system">System Default</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-200">Response Language</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Language for AI answers and dictionary</div>
                    </div>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-lg p-2.5 text-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-medical-500"
                    >
                      {/* We use the keys from VOICE_LANGUAGES to ensure consistency with Sidebar */}
                      {Object.keys(VOICE_LANGUAGES).map((langName) => (
                        <option key={langName} value={langName}>{langName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pb-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="mb-4">
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-200">Default Clinical Location</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Set the primary medical jurisdiction for guidelines</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Region</label>
                        <select
                          value={region}
                          onChange={handleRegionChange}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-lg p-2.5 text-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-medical-500"
                        >
                          {Object.keys(REGIONS_DATA).map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Country</label>
                        <select
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-lg p-2.5 text-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-medical-500"
                        >
                          {REGIONS_DATA[region]?.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-200">Font Size</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Adjust text size for reading comfort</div>
                    </div>
                    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                      <button
                        onClick={() => setFontSize('small')}
                        className={`px-3 py-1 text-xs font-medium rounded transition-all ${fontSize === 'small' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white ring-1 ring-slate-200 dark:ring-slate-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                      >
                        Aa
                      </button>
                      <button
                        onClick={() => setFontSize('normal')}
                        className={`px-3 py-1 text-sm font-medium rounded transition-all ${fontSize === 'normal' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white ring-1 ring-slate-200 dark:ring-slate-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                      >
                        Aa
                      </button>
                      <button
                        onClick={() => setFontSize('large')}
                        className={`px-3 py-1 text-base font-medium rounded transition-all ${fontSize === 'large' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white ring-1 ring-slate-200 dark:ring-slate-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                      >
                        Aa
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wide mb-4">Data Management</h3>
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-5">
                  <h4 className="font-medium text-red-800 dark:text-red-300 mb-1">Clear Consultation History</h4>
                  <p className="text-xs text-red-600/80 dark:text-red-400/70 mb-4">Permanently remove all your chat sessions and local data. This action cannot be undone.</p>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete all history? This cannot be undone.')) {
                        onClearHistory();
                        onClose();
                      }
                    }}
                    className="px-4 py-2 bg-white dark:bg-red-900/20 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-800/50 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors shadow-sm"
                  >
                    Delete All Data
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Account Profile</h3>

              <div className="flex items-center gap-5 mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                <div
                  className={`relative w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold ring-4 ring-medical-50 dark:ring-slate-800 uppercase overflow-hidden ${isAuthenticated ? 'bg-medical-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  {isAuthenticated && userProfile?.logo_url ? (
                    <img src={userProfile.logo_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span>{isAuthenticated && userProfile?.full_name ? userProfile.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : '?'}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                    {isAuthenticated ? (userProfile?.full_name || userName || '') : 'Guest User'}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                    {isAuthenticated ? (userProfile?.email || '') : 'Not logged in'}
                  </p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isAuthenticated ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                    {isAuthenticated ? (userProfile?.role || 'user') : 'Guest'}
                  </span>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                  <input
                    type="text"
                    value={userProfile?.full_name || ''}
                    disabled
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    value={userProfile?.email || ''}
                    disabled
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  />
                  <p className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">Contact your administrator to change your email.</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Professional Role</label>
                    <span className="text-[10px] text-medical-600 dark:text-medical-400 bg-medical-50 dark:bg-medical-900/20 px-2 py-0.5 rounded-full font-medium">
                      Adapts AI Answers
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <select
                      value={PROFESSIONAL_ROLES.includes(userRole) ? userRole : 'Other'}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'Other') {
                          setUserRole(''); // Clear for custom input
                        } else {
                          setUserRole(val);
                        }
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-medical-500 appearance-none cursor-pointer"
                    >
                      {PROFESSIONAL_ROLES.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>

                    {/* Show Custom Input if 'Other' is selected (implied by userRole not being in standard list) */}
                    {(!PROFESSIONAL_ROLES.includes(userRole) || userRole === 'Other' || userRole === '') && (
                       <input
                         type="text"
                         placeholder="Specify your role (e.g. Surgeon, Dentist)..."
                         value={userRole === 'Other' ? '' : userRole} // handle 'Other' literal if explicitly set
                         onChange={(e) => setUserRole(e.target.value)}
                         className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-medical-500 animate-fade-in"
                         autoFocus
                       />
                    )}
                  </div>
                </div>

                {userProfile?.accepted_terms_at && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Terms Accepted</label>
                    <input
                      type="text"
                      value={new Date(userProfile.accepted_terms_at).toLocaleDateString()}
                      disabled
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed"
                    />
                  </div>
                )}
              </div>

              {/* Branding Section Removed (Logo URL) */}

              {!isAuthenticated ? (
                <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mt-6">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Account Access</h3>
                  <button
                    onClick={onOpenAuth}
                    className="w-full py-2.5 bg-medical-600 hover:bg-medical-700 text-white font-semibold rounded-lg shadow-md transition-all"
                  >
                    Log In / Sign Up
                  </button>
                </div>
              ) : (
                <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mt-6">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Account Actions</h3>
                  <button
                    onClick={onLogout}
                    className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 font-semibold rounded-lg transition-all"
                  >
                    Log Out
                  </button>
                </div>
              )}

              {/* Security & Subscription Section */}
              {isAuthenticated && (
                <>
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-8 mt-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Security & Subscription</h3>

                    <div className="space-y-3">
                      <button
                        onClick={handleResetPassword}
                        className="w-full text-left px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                          </svg>
                          <span>Reset Password</span>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </button>

                      <button
                        onClick={() => {
                          if (subscription) {
                            handleManageSubscription();
                          } else {
                            // Redirect to pricing page if no subscription
                            window.location.href = '/pricing';
                          }
                        }}
                        disabled={loadingPortal}
                        className="w-full text-left px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                          </svg>
                          <div className="flex flex-col">
                            <span>{subscription ? 'Manage Subscription' : 'Upgrade Plan'}</span>
                            {subscription ? (
                              <span className="text-xs text-slate-500 font-normal">
                                {subscription.cancel_at_period_end
                                  ? `Ends on ${new Date(subscription.current_period_end * 1000).toLocaleDateString()}`
                                  : `Active • Next bill: ${new Date(subscription.current_period_end * 1000).toLocaleDateString()}`
                                }
                              </span>
                            ) : (
                              <span className="text-xs text-slate-500 font-normal">
                                Unlock premium features
                              </span>
                            )}
                          </div>
                        </div>
                        {loadingPortal ? (
                          <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-600 rounded-full animate-spin" />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="pt-6">
                    <h3 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wide mb-3">Danger Zone</h3>
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-red-800 dark:text-red-300">Deactivate Account</h5>
                          <p className="text-xs text-red-600/80 dark:text-red-400/70 mt-1 max-w-[250px] leading-relaxed">
                            Disable your account and remove public profile visibility immediately.
                          </p>
                        </div>
                        <button
                          onClick={handleDeactivate}
                          className="px-4 py-2 bg-white dark:bg-red-900/20 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-800/50 rounded-lg text-xs font-bold hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors shadow-sm"
                        >
                          Deactivate
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
