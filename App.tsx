
import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { MessageBubble } from './components/MessageBubble';
import { SettingsModal } from './components/SettingsModal';
import { DictionaryModal } from './components/DictionaryModal';
import { ShareModal } from './components/ShareModal';
import { LandingPage } from './components/LandingPage';
import { PricingPage } from './components/PricingPage';
import { BlogPage } from './components/BlogPage';
import { AboutPage } from './components/AboutPage';
import { TermsPage } from './components/TermsPage';
import { PrivacyPage } from './components/PrivacyPage';
import { ContactPage } from './components/ContactPage';
import { AuthPage } from './components/AuthPage';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import { GuestLimitModal } from './components/GuestLimitModal';
import { supabase } from './services/supabaseClient';
import { apiRequest } from './services/api';
import { Message, Role, ChatSession } from './types';
import { streamChatResponse, transcribeAudio, generateRelatedQuestions } from './services/geminiService';
import { VOICE_LANGUAGES, getRandomQuestions, DEFAULT_QUESTION_POOL, getWelcomeMessage, isWelcomeMessage, isArabic } from './constants';
import { Logo } from './components/Logo';




// Simple ID generator (UUID v4)
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers / environments
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
    (parseInt(c) ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> parseInt(c) / 4).toString(16)
  );
};

// Helper to convert Blob to Base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      resolve(base64String.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

interface NotificationState {
  message: string;
  type: 'error' | 'info';
}

// Privileged Roles Constant
const PRIVILEGED_ROLES = [
  'admin', 'superuser', 'owner',
  'team', 'developer', 'support',
  'friend', 'friends', 'family',
  'friends_and_family', 'family_and_friends',
  'ambassador', 'ambassadors', 'ambassasors',
  'partner', 'vip'
];

const App: React.FC = () => {
  // Routing State
  const [showLanding, setShowLanding] = useState(true);
  const [showPricing, setShowPricing] = useState(false);
  const [showBlog, setShowBlog] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');


  // routing helper
  const updateUrl = (path: string) => {
    window.history.pushState({}, '', path);
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/privacy-policy') {
        setShowPrivacy(true);
        setShowTerms(false);
        setShowLanding(false); // Or true? overlapping states are tricky. Assuming standard flow:
        // Actually, based on logic below, if showPrivacy is true, it returns early.
      } else if (path === '/terms_of_service') {
        setShowTerms(true);
        setShowPrivacy(false);
      } else if (path.startsWith('/reset-password')) {
        setShowResetPassword(true);
        setShowLanding(false);
      } else if (path === '/forgot-password') {
        setShowForgotPassword(true);
        setShowLanding(false);
      } else if (path === '/pricing') {
        // Fix: Handle pricing route explicitly
        setShowPricing(true);
        setShowLanding(false);
        setShowBlog(false);
        setShowAbout(false);
        setShowTerms(false);
        setShowPrivacy(false);
        setShowContact(false);
        setShowAuth(false);
      } else {
        // Default to landing
        setShowPrivacy(false);
        setShowTerms(false);
        setShowResetPassword(false);
        setShowLanding(true);
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Initial Load Check
    handlePopState();

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Capture Referral Code
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('mdnexa_ref', ref);
    }
  }, []);



  // Initialize from LocalStorage for persistence
  const [saveSettings, setSaveSettings] = useState<boolean>(() => {
    const saved = localStorage.getItem('mdnexa_save_settings');
    return saved === null ? true : saved === 'true';
  });

  const [region, setRegion] = useState<string>(() => {
    if (localStorage.getItem('mdnexa_save_settings') === 'false') return "North America";
    return localStorage.getItem('mdnexa_region') || "North America";
  });
  const [country, setCountry] = useState<string>(() => {
    if (localStorage.getItem('mdnexa_save_settings') === 'false') return "United States";
    return localStorage.getItem('mdnexa_country') || "United States";
  });

  const [language, setLanguage] = useState<string>(() => {
    if (localStorage.getItem('mdnexa_save_settings') === 'false') return "English (US)";
    return localStorage.getItem('mdnexa_language') || "English (US)";
  });

  const [isShortAnswer, setIsShortAnswer] = useState<boolean>(() => {
    if (localStorage.getItem('mdnexa_save_settings') === 'false') return false;
    return localStorage.getItem('mdnexa_short_answer') === 'true';
  });

  // Theme & Appearance State
  const [theme, setTheme] = useState<string>(() => localStorage.getItem('mdnexa_theme') || 'system');
  const [fontSize, setFontSize] = useState<string>(() => {
    if (localStorage.getItem('mdnexa_save_settings') === 'false') return "normal";
    return localStorage.getItem('mdnexa_font_size') || "normal";
  });

  // User Profile State
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('mdnexa_user_name') || "";
  });
  const [userRole, setUserRole] = useState<string>(() => {
    if (localStorage.getItem('mdnexa_save_settings') === 'false') return "Physician";
    return localStorage.getItem('mdnexa_user_role') || "Physician";
  });
  // System Role (for Privileges) vs Professional Role (for AI Context)
  const [systemRole, setSystemRole] = useState<string>('user');

  // Session Management
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>(generateId());

  // Current Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      role: Role.MODEL,
      text: getWelcomeMessage(
        (localStorage.getItem('mdnexa_save_settings') === 'false' ? "English" : (localStorage.getItem('mdnexa_language') || "English"))
      ),
      timestamp: new Date(),
    }
  ]);

  // UI State
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState({ title: '', text: '', url: '' });

  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  // Guest Mode State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [guestUsageCount, setGuestUsageCount] = useState<number>(0);
  const [isGuestLimitModalOpen, setIsGuestLimitModalOpen] = useState(false);
  const [subscription, setSubscription] = useState<any>(null); // Track subscription status
  const [freeUsageCount, setFreeUsageCount] = useState(0);
  const [pendingSubscriptionPriceId, setPendingSubscriptionPriceId] = useState<string | null>(null);

  // -- Suggestion Deck Logic --
  // We shuffle the entire pool once on mount, then iterate through it "deck of cards" style.
  // This guarantees NO repeats until we've shown every single question in the pool.
  const [suggestionDeck, setSuggestionDeck] = useState<string[]>([]);
  const [deckIndex, setDeckIndex] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Initialize Deck on Mount and when Language Changes
  useEffect(() => {
    // If we have a pool for the language, use it. Otherwise default.
    // We use a large count to get full pool shuffled
    const questions = getRandomQuestions(50, language);
    setSuggestionDeck(questions);
    setSuggestions(questions.slice(0, 4));
    setDeckIndex(4);
  }, [language]);

  const getNextSuggestions = () => {
    if (suggestionDeck.length === 0) return []; // Should not happen after initial render

    let nextIndex = deckIndex + 4;
    let nextBatch = suggestionDeck.slice(deckIndex, nextIndex);

    // If we run out of cards, reshuffle and start over
    if (nextBatch.length < 4) {
      const reshuffled = getRandomQuestions(50, language);
      setSuggestionDeck(reshuffled);
      // Take remaining from needed
      const needed = 4;
      nextBatch = reshuffled.slice(0, needed);
      nextIndex = needed;
    }

    setDeckIndex(nextIndex);
    return nextBatch;
  };

  // Load guest usage from local storage on mount
  useEffect(() => {
    const savedCount = localStorage.getItem('mdnexa_guest_usage_v1');
    if (savedCount) {
      setGuestUsageCount(parseInt(savedCount, 10));
    }
  }, []);

  // Update free usage count when user changes
  useEffect(() => {
    if (userName && userName !== 'Guest') {
      // Simple hashing or usage of email/name as key since we don't have ID handy in state without profile fetch
      // ideally we use user ID. Let's assume we can get it or just use the name for now as a composite key
      const key = `mdnexa_free_usage_${userName}`;
      const saved = localStorage.getItem(key);
      setFreeUsageCount(saved ? parseInt(saved, 10) : 0);
    }
  }, [userName]);

  // Function to fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      // 1. First, try to get immediate data from the session metadata (fastest)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const metaName = user.user_metadata?.full_name || user.user_metadata?.name;
        if (metaName) {
          setUserName(metaName);
        }

        // Extract System Role for Privileges
        // Check ALL locations for any privileged role (FIXED: Scan all)
        const allRoles = [
          user.app_metadata?.role,
          user.user_metadata?.role,
          user.role,
          'user'
        ].filter(Boolean).map(r => String(r).toLowerCase());

        // Find the most privileged role if exists
        const foundPrivilegedRole = allRoles.find(r => PRIVILEGED_ROLES.includes(r));
        const finalSystemRole = foundPrivilegedRole || allRoles[0] || 'user';

        setSystemRole(finalSystemRole);
        console.log("[App] Roles Scanned:", allRoles, "-> Selected System Role:", finalSystemRole);
      }

      // 2. Fetch User Data & Preferences from API
      const userData = await apiRequest('/users/me');

      if (userData) {
        const name = userData.full_name || userData.email?.split('@')[0] || "Guest";
        setUserName(name);

        // DB Role Check for Privileges
        // Check both specific 'role' column and metadata that might be merged
        const dbRole = String(userData.role || userData.app_metadata?.role || '').toLowerCase();

        if (PRIVILEGED_ROLES.includes(dbRole)) {
          setSystemRole(dbRole);
          console.log("[App] System Role Enforced from DB:", dbRole);
        } else {
          // Only apply DB role to AI Context if it's NOT a system role (e.g. "Nurse")
          // Otherwise keep default "Physician" to avoid "You are a User"
          setUserRole(userData.role || 'Physician');
        }

        // Fetch Subscription Status
        try {
          const { subscription } = await apiRequest('/subscriptions/status');
          setSubscription(subscription);
        } catch (err) {
          setSubscription(null);
        }

        // 3. Load Preferences (Cloud Persistence)
        try {
          const prefs = await apiRequest('/settings/preferences');
          if (prefs) {
            if (prefs.language) setLanguage(prefs.language);
            if (prefs.region) setRegion(prefs.region);
            if (prefs.country) setCountry(prefs.country);
            if (prefs.fontSize) setFontSize(prefs.fontSize);
            if (prefs.isShortAnswer !== undefined) setIsShortAnswer(prefs.isShortAnswer);
            if (prefs.theme) setTheme(prefs.theme);
            if (prefs.userRole) setUserRole(prefs.userRole);
          }
        } catch (prefErr) {
          console.error("Failed to load preferences", prefErr);
        }

        // 4. Load Chat Sessions
        try {
          const cloudSessions = await apiRequest('/sessions');
          if (cloudSessions) {
            const mappedSessions: ChatSession[] = cloudSessions.map((s: any) => ({
              id: s.id,
              title: s.title || 'Chat',
              region: s.region || 'International',
              country: s.country || 'International',
              updatedAt: new Date(s.updated_at),
              isFavorite: s.is_favorite,
              messages: []
            }));
            setSessions(mappedSessions);
          }
        } catch (sessErr) {
          console.error("Failed to load sessions", sessErr);
        }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };


  // Auth Listener
  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUserName("");
        setSubscription(null); // Clear subscription on logout
        setFreeUsageCount(0); // Clear free usage count on logout
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        // Ensure token is always fresh in localStorage for API calls
        localStorage.setItem('token', session.access_token);
        localStorage.setItem('user', JSON.stringify(session.user));

        fetchUserProfile(session.user.id);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUserName("");
        setSubscription(null); // Clear subscription on logout
        setFreeUsageCount(0); // Clear free usage count on logout
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Voice Input State
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isMicSupported, setIsMicSupported] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Abort Controller for stopping generation
  const abortControllerRef = useRef<AbortController | null>(null);

  // Scroll Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);

  const showNotification = (message: string, type: 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 6000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      const isAtBottom = distanceFromBottom < 100;
      shouldAutoScrollRef.current = isAtBottom;
      setShowScrollBottom(distanceFromBottom > 400);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'light' : 'dark';
      }
      return prev === 'dark' ? 'light' : 'dark';
    });
  };

  const handleOpenShare = (title: string, text: string, specificUrl?: string) => {
    const isMessageShare = !specificUrl;

    // 1. Construct Text
    // If it's a message share, append the website footer. 
    // If it's a specific URL share (sidebar), keep text as is (it's the description).
    const shareText = isMessageShare ? `${text}\n\nwww.mdnexa.com` : text;

    // 2. Construct URL
    // Fallback for modal buttons that require a URL parameter (e.g., Facebook).
    // For Sidebar share, use specificUrl.
    const shareUrl = specificUrl || "https://www.mdnexa.com";

    // 3. Attempt Native Share with Fallback
    if (navigator.share) {
      navigator.share({
        title: title,
        text: shareText,
        // Only include URL if it is explicitly a Link Share (sidebar).
        // For Message Share, omit 'url' so mobile devices treat it as a text paste/share,
        // preventing the generation of a generic link preview card.
        url: isMessageShare ? undefined : shareUrl,
      }).catch((err) => {
        console.warn("Native share failed/cancelled, falling back to modal.");
        setShareData({
          title,
          text: shareText,
          url: shareUrl
        });
        setIsShareModalOpen(true);
      });
    } else {
      // Fallback to custom modal
      setShareData({
        title,
        text: shareText,
        url: shareUrl
      });
      setIsShareModalOpen(true);
    }
  };

  // Check for Speech Recognition API support (Chrome/Safari) to hide on unsupported browsers (Firefox)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSpeechRecognition = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
      setIsMicSupported(!!hasSpeechRecognition);
    }
  }, []);

  useEffect(() => {
    if (shouldAutoScrollRef.current && !showLanding && !showPricing && !showBlog && !showAbout && !showTerms && !showPrivacy && !showContact && !showAuth) {
      scrollToBottom();
    }
  }, [messages, showLanding, showPricing, showBlog, showAbout, showTerms, showPrivacy, showContact, showAuth]);

  // Debounced Settings Save
  useEffect(() => {
    // Local Persistence
    localStorage.setItem('mdnexa_save_settings', String(saveSettings));

    if (saveSettings) {
      localStorage.setItem('mdnexa_region', region);
      localStorage.setItem('mdnexa_country', country);
      localStorage.setItem('mdnexa_language', language);
      localStorage.setItem('mdnexa_short_answer', String(isShortAnswer));
      localStorage.setItem('mdnexa_font_size', fontSize);
      localStorage.setItem('mdnexa_user_name', userName);
      localStorage.setItem('mdnexa_user_role', userRole);
    } else {
      localStorage.removeItem('mdnexa_region');
      // ... (rest of cleanups)
    }

    // Cloud Persistence (Debounced)
    if (isAuthenticated) {
      const timer = setTimeout(async () => {
        try {
          await apiRequest('/settings/preferences', 'PUT', {
            region, country, language, isShortAnswer, fontSize, theme, userRole
          });
        } catch (e) { console.error("Cloud save failed", e); }
      }, 2000); // 2 second debounce

      return () => clearTimeout(timer);
    }

  }, [saveSettings, region, country, language, isShortAnswer, fontSize, userName, userRole, isAuthenticated, theme]);

  useEffect(() => {
    localStorage.setItem('mdnexa_theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    if (fontSize === 'small') {
      root.style.fontSize = '87.5%'; // ~14px
    } else if (fontSize === 'large') {
      root.style.fontSize = '112.5%'; // ~18px
    } else {
      root.style.fontSize = '100%'; // 16px
    }
  }, [fontSize]);

  useEffect(() => {
    if (messages.length <= 1) return;

    // Fix: Only auto-rename if the session has a generic name AND we have a user message
    const userMsg = messages.find(m => m.role === Role.USER);

    setSessions(prevSessions => {
      const existingSessionIndex = prevSessions.findIndex(s => s.id === currentSessionId);

      // Calculate Title
      // Calculate Title
      // Fix: Default to Timestamp if new. PRESERVE existing if known.
      let title = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

      if (existingSessionIndex >= 0) {
        title = prevSessions[existingSessionIndex].title;
      }

      // Important: Preserve existing isFavorite status if updating
      const isFavorite = existingSessionIndex >= 0 ? prevSessions[existingSessionIndex].isFavorite : false;

      const currentSessionData: ChatSession = {
        id: currentSessionId,
        title: title,
        messages: messages,
        region: region,
        country: country,
        updatedAt: new Date(),
        isFavorite: isFavorite,
      };

      if (existingSessionIndex >= 0) {
        const newSessions = [...prevSessions];
        newSessions[existingSessionIndex] = currentSessionData;
        return newSessions.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      } else {
        return [currentSessionData, ...prevSessions];
      }
    });
  }, [messages, region, country, currentSessionId]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  // ---- Audio Recording & Transcription Logic ----

  const startRecording = async () => {
    // Basic Feature Detection
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showNotification("Microphone not available.", 'error');
      return;
    }

    try {
      // Specifically request audio. This call will trigger the browser permission prompt
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const preferredTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/aac',
        'audio/ogg;codecs=opus',
        'audio/ogg',
        'audio/wav'
      ];

      let selectedMimeType = '';
      for (const type of preferredTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          selectedMimeType = type;
          break;
        }
      }

      const options = selectedMimeType ? { mimeType: selectedMimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      const finalMimeType = mediaRecorder.mimeType || selectedMimeType || 'audio/webm';

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsRecording(false);
        setIsTranscribing(true);

        stream.getTracks().forEach(track => track.stop());

        if (audioChunksRef.current.length === 0) {
          setIsTranscribing(false);
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: finalMimeType });

        try {
          const base64Audio = await blobToBase64(audioBlob);
          // Derive voice code from language name
          const voiceCode = VOICE_LANGUAGES[language] || 'en-US';
          const transcription = await transcribeAudio(base64Audio, finalMimeType, voiceCode);

          if (transcription) {
            setInput(prev => {
              const separator = prev && !prev.endsWith(' ') ? ' ' : '';
              return prev + separator + transcription;
            });
            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
                textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
              }
            }, 10);
          }
        } catch (error) {
          console.error("Transcription failed", error);
          showNotification("Transcription failed.", 'error');
        } finally {
          setIsTranscribing(false);
        }
      };

      // Firefox requires timeslice to avoid empty blobs
      mediaRecorder.start(200);
      setIsRecording(true);

    } catch (err: any) {
      console.warn("Microphone initialization failed", err);
      setIsRecording(false);
      // Neutral error message to avoid incorrect advice
      showNotification("Microphone access failed.", 'error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const deleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    // Optimistic Update
    setSessions(prev => prev.filter(s => s.id !== sessionId));

    if (currentSessionId === sessionId) {
      createNewSession(false);
    }

    if (isAuthenticated) {
      try {
        await apiRequest(`/sessions/${sessionId}`, 'DELETE');
      } catch (err) {
        console.error("Failed to delete session", err);
        showNotification("Failed to delete session", 'error');
      }
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    if (isRecording) {
      stopRecording();
    }

    // Guest Mode Limit Check
    if (!isAuthenticated) {
      if (guestUsageCount >= 5) {
        setIsGuestLimitModalOpen(true);
        return;
      }

      const newCount = guestUsageCount + 1;
      setGuestUsageCount(newCount);
      localStorage.setItem('mdnexa_guest_usage_v1', String(newCount));
    } else {
      // Authenticated Free Tier Limit Check
      // Bypass for privileged roles
      const privilegedRoles = [
        'admin', 'superuser', 'owner',
        'team', 'developer', 'support',
        'friend', 'friends', 'family',
        'friends_and_family', 'family_and_friends',
        'ambassador', 'ambassadors', 'ambassasors',
        'partner', 'vip'
      ];

      // CRITICAL FIX: Check SYSTEM role (admin/friend), NOT Professional Role (Doctor)
      const isPrivileged = privilegedRoles.includes(systemRole.toLowerCase());

      const isActive = subscription && subscription.status === 'active';
      console.log(`[Debug] Checking Limit: Count=${freeUsageCount}, Active=${isActive}, SystemRole=${systemRole}, Privileged=${isPrivileged}`);

      if (!isActive && !isPrivileged) {
        if (freeUsageCount >= 5) {
          alert("You have reached your 5 free questions limit. Upgrade for unlimited access.");
          setShowPricing(true);
          return;
        }
        const newCount = freeUsageCount + 1;
        setFreeUsageCount(newCount);
        localStorage.setItem(`mdnexa_free_usage_${userName}`, String(newCount));
      }
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const userText = input.trim();


    setInput('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const newUserMessage: Message = {
      id: generateId(),
      role: Role.USER,
      text: userText,
      timestamp: new Date(),
    };

    shouldAutoScrollRef.current = true;
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    const aiMessageId = generateId();
    const initialAiMessage: Message = {
      id: aiMessageId,
      role: Role.MODEL,
      text: '',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, initialAiMessage]);

    try {
      const fullResponseText = await streamChatResponse({
        history: messages,
        newMessage: userText,
        region,
        country,
        userRole, // Pass the professional role to the AI
        isShortAnswer,
        language, // Pass the selected answer language
        onChunk: (streamedText) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId ? { ...msg, text: streamedText } : msg
            )
          );
        },
        signal: abortController.signal,
        sessionId: isAuthenticated ? currentSessionId : undefined // Pass Session ID for backend persistence
      });

      // --- Generate Follow-up Questions ---
      try {
        const related = await generateRelatedQuestions(userText, fullResponseText, userRole, language);
        if (related && related.length > 0) {
          setSuggestions(related);
        }
      } catch (err) {
        console.error("Failed to load suggestions", err);
      }

      // --- Refresh Session Title (Smart Title) ---
      // The backend generates a title asynchronously. We fetch it now to update the UI.
      if (isAuthenticated && messages.length <= 2) { // Only needed for new chats
        setTimeout(async () => {
          try {
            const sessionsData = await apiRequest('/sessions');
            if (sessionsData) {
              const mapped = sessionsData.map((s: any) => ({
                id: s.id,
                title: s.title || 'Chat',
                region: s.region || 'International',
                country: s.country || 'International',
                updatedAt: new Date(s.updated_at),
                isFavorite: s.is_favorite,
                // Preserve messages if matched
                messages: s.id === currentSessionId ? messages : []
              }));
              // Merge strategies?
              // actually just updating the session list is enough for the sidebar.
              // For the current session title in state, we might need to update `sessions` state specifically.

              setSessions(prev => {
                // 1. Map server sessions, preserving local messages
                const updatedList = mapped.map((newS: ChatSession) => {
                  const existing = prev.find(p => p.id === newS.id);
                  if (existing) {
                    return { ...newS, messages: existing.messages };
                  }
                  return newS;
                });

                // 2. CRITICAL FIX: If current session is missing (latency/race), keep it!
                // Otherwise it vanishes from the UI until next refresh.
                const currentSession = prev.find(p => p.id === currentSessionId);
                const isCurrentInList = updatedList.some(s => s.id === currentSessionId);

                if (currentSession && !isCurrentInList) {
                  return [currentSession, ...updatedList];
                }

                return updatedList;
              });
            }
          } catch (e) { console.warn("Failed to refresh smart title", e); }
        }, 4000); // Wait 4s for backend to finish generation
      }

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Generation stopped by user');
      } else {
        console.error(error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? { ...msg, text: "I apologize, but I encountered an error processing your request. Please try again.", isError: true }
              : msg
          )
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };



  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const createNewSession = async (keepSidebarOpen = false) => {
    handleStopGeneration();

    // If authenticated, create in DB to get a real ID (UUID)
    let newId = generateId();
    if (isAuthenticated) {
      try {
        const newSession = await apiRequest('/sessions', 'POST', {
          title: 'New Consultation',
          region,
          country
        });
        if (newSession && newSession.id) newId = newSession.id;
      } catch (e) {
        console.error("Failed to create cloud session", e);
      }
    }

    setCurrentSessionId(newId);
    setMessages([
      {
        id: generateId(),
        role: Role.MODEL,
        text: getWelcomeMessage(language),
        timestamp: new Date(),
      },
    ]);
    setSuggestions(getNextSuggestions());
    shouldAutoScrollRef.current = true;
    if (!keepSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  const loadSession = async (session: ChatSession) => {
    handleStopGeneration();
    setCurrentSessionId(session.id);
    setRegion(session.region);
    setCountry(session.country);
    setIsSidebarOpen(false);

    // If session has no messages (lazy loaded from cloud), fetch them
    if (isAuthenticated && (!session.messages || session.messages.length === 0)) {
      setIsLoading(true);
      try {
        const msgs = await apiRequest(`/sessions/${session.id}/messages`);
        if (msgs) {
          const formatted: Message[] = msgs.map((m: any) => ({
            id: m.id,
            role: m.role === 'user' ? Role.USER : Role.MODEL,
            text: m.content,
            timestamp: new Date(m.created_at)
          }));
          setMessages(formatted);
          // Update local session cache with loaded messages
          setSessions(prev => prev.map(s => s.id === session.id ? { ...s, messages: formatted } : s));
        }
      } catch (e) {
        console.error("Failed to load messages", e);
        setMessages([]);
      } finally {
        setIsLoading(false);
        shouldAutoScrollRef.current = true;
      }
    } else {
      setMessages(session.messages);
      shouldAutoScrollRef.current = true;
    }
  };



  const toggleFavorite = (sessionId: string) => {
    setSessions(prev => prev.map(s =>
      s.id === sessionId ? { ...s, isFavorite: !s.isFavorite } : s
    ));
  };

  // Clears EVERYTHING (for Settings modal "Delete All Data" and Sidebar "Clear All")
  const handleClearAllData = async () => {
    if (isAuthenticated) {
      try {
        await apiRequest('/sessions/all', 'DELETE');
        showNotification("Chat history cleared.", 'info');
      } catch (e) {
        console.error("Failed to clear backend history", e);
        showNotification("Failed to clear history.", 'error');
      }
    }

    handleStopGeneration();
    setSessions([]);
    shouldAutoScrollRef.current = true;
    createNewSession(false);
  };

  // Routing
  if (showPricing) return (
    <PricingPage
      onBack={() => { setShowPricing(false); updateUrl('/'); }}
      onStart={() => {
        setShowPricing(false);
        setShowAuth(true);
        setAuthView('login');
      }}
      isAuthenticated={isAuthenticated}
      userName={userName}
    />
  );
  if (showBlog) return <BlogPage
    isAuthenticated={isAuthenticated}
    userRole={userRole}
    userName={userName}
    onBack={() => setShowBlog(false)}
    onStart={() => { setShowBlog(false); setShowLanding(false); }}
  />;
  if (showAbout) return (
    <AboutPage
      onBack={() => setShowAbout(false)}
      onStart={() => {
        setShowAbout(false);
        setShowLanding(false);
      }}
    />
  );
  if (showTerms) return <TermsPage onBack={() => { setShowTerms(false); updateUrl('/'); }} onStart={() => { setShowTerms(false); setShowLanding(false); updateUrl('/'); }} />;
  if (showPrivacy) return <PrivacyPage onBack={() => { setShowPrivacy(false); updateUrl('/'); }} onStart={() => { setShowPrivacy(false); setShowLanding(false); updateUrl('/'); }} />;
  if (showContact) return <ContactPage onBack={() => setShowContact(false)} onStart={() => { setShowContact(false); setShowLanding(false); }} />;
  if (showResetPassword) return <ResetPasswordPage />;
  if (showForgotPassword) return <ForgotPasswordPage />;

  if (showAuth) {
    return (
      <AuthPage
        onBack={() => setShowAuth(false)}
        onSuccess={() => { setShowAuth(false); setIsAuthenticated(true); }}
        initialView={authView}
        pendingSubscriptionPriceId={pendingSubscriptionPriceId || undefined}
      />
    );
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error (ignoring):', error);
    } finally {
      setIsAuthenticated(false);
      setSessions([]); // Clear session data for privacy on logout
      setGuestUsageCount(0); // Optional: reset guest count or keep it
      createNewSession(false);
      setAuthView('login');
      setShowLanding(true); // Redirect to landing page
      showNotification("Logged out successfully.");
      localStorage.removeItem('mdnexa_user_name'); // Clear cached name
    }
  };



  if (showLanding) {
    return (
      <LandingPage
        onStart={() => setShowLanding(false)}
        onPricing={() => setShowPricing(true)}
        onBlog={() => setShowBlog(true)}
        onAbout={() => setShowAbout(true)}
        onTerms={() => { setShowTerms(true); updateUrl('/terms_of_service'); }}
        onPrivacy={() => { setShowPrivacy(true); updateUrl('/privacy-policy'); }}
        onContact={() => setShowContact(true)}
        onLogin={() => { setAuthView('login'); setShowAuth(true); }}
        onLogout={handleLogout}
        onToggleTheme={toggleTheme}
        isAuthenticated={isAuthenticated}
        userName={userName}
      />
    );
  }



  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#0B1120] font-sans overflow-hidden transition-colors duration-300">
      {showLanding && (
        <div className="absolute inset-0 z-40 bg-white dark:bg-slate-950 overflow-y-auto w-full h-full">
          <LandingPage
            onStart={() => setShowLanding(false)}
            onPricing={() => setShowPricing(true)}
            onBlog={() => setShowBlog(true)}
            onAbout={() => setShowAbout(true)}
            onTerms={() => setShowTerms(true)}
            onPrivacy={() => setShowPrivacy(true)}
            onContact={() => setShowContact(true)}
            onLogin={() => {
              setAuthView('login');
              setShowAuth(true);
            }}
            onLogout={handleLogout}
            onToggleTheme={toggleTheme}
            isAuthenticated={isAuthenticated}
            userName={userName}
          />
        </div>
      )}
      <Sidebar
        region={region}
        setRegion={setRegion}
        country={country}
        setCountry={setCountry}
        language={language}
        setLanguage={setLanguage}
        isShortAnswer={isShortAnswer}
        setIsShortAnswer={setIsShortAnswer}
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        resetChat={() => createNewSession(false)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onLoadSession={loadSession}
        onDeleteSession={deleteSession}
        onToggleFavorite={toggleFavorite}
        onOpenSettings={() => { setIsSettingsOpen(true); setIsSidebarOpen(false); }}
        onOpenDictionary={() => { setIsDictionaryOpen(true); setIsSidebarOpen(false); }}
        onBackToLanding={() => setShowLanding(true)}
        onOpenShare={handleOpenShare}
        saveSettings={saveSettings}
        setSaveSettings={setSaveSettings}
        isAuthenticated={isAuthenticated}
        onOpenAuth={(view) => { setAuthView(view); setShowAuth(true); }}
        onLogout={handleLogout}
        userName={userName}
        userRole={userRole}
        onClearAll={handleClearAllData}
      />

      <GuestLimitModal
        isOpen={isGuestLimitModalOpen}
        onLogin={() => { setAuthView('login'); setShowAuth(true); setIsGuestLimitModalOpen(false); }}
        onSignup={() => { setAuthView('signup'); setShowAuth(true); setIsGuestLimitModalOpen(false); }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onClearHistory={handleClearAllData}
        theme={theme}
        onThemeChange={setTheme}
        region={region}
        setRegion={setRegion}
        country={country}
        setCountry={setCountry}
        fontSize={fontSize}
        setFontSize={setFontSize}
        userName={userName}
        setUserName={setUserName}
        userRole={userRole}
        setUserRole={setUserRole}
        isAuthenticated={isAuthenticated}
        onOpenAuth={() => { setIsSettingsOpen(false); setShowAuth(true); setAuthView('login'); }}
        onLogout={() => {
          handleLogout();
          setIsSettingsOpen(false);
          setIsSidebarOpen(false);
        }}
        language={language}
        setLanguage={setLanguage}
        isShortAnswer={isShortAnswer}
        setIsShortAnswer={setIsShortAnswer}
      />

      <DictionaryModal
        isOpen={isDictionaryOpen}
        onClose={() => setIsDictionaryOpen(false)}
        region={region}
        language={language}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareData={shareData}
      />

      {isGuestLimitModalOpen && (
        <GuestLimitModal
          isOpen={isGuestLimitModalOpen}
          onLogin={() => {
            setIsGuestLimitModalOpen(false);
            setShowAuth(true);
            setAuthView('login');
          }}
          onSignup={() => {
            setIsGuestLimitModalOpen(false);
            setShowAuth(true);
            setAuthView('signup');
          }}
        />
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in transition-all duration-300 pointer-events-none">
          <div className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-floating border ${notification.type === 'error'
            ? 'bg-red-50 border-red-100 text-red-800 dark:bg-red-900/90 dark:border-red-900 dark:text-white'
            : 'bg-slate-800 border-slate-700 text-white shadow-2xl'
            }`}>
            {notification.type === 'error' ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-500 dark:text-red-300">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-medical-400">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            )}
            <span className="text-sm font-medium">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-2 text-current opacity-60 hover:opacity-100">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col h-full w-full relative isolate">
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 h-16 flex items-center px-6 justify-between z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            <div className="flex items-center gap-3 text-sm">
              <button
                onClick={() => setShowLanding(true)}
                className="font-semibold text-slate-800 dark:text-slate-100 hover:text-medical-600 transition-colors flex items-center gap-2"
              >
                <div className="w-6 h-6 text-medical-600">
                  <Logo className="w-full h-full" />
                </div>
                MDnexa™
              </button>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Guideline Protocol</span>
                <span className="font-medium text-slate-700 dark:text-slate-200 truncate max-w-[150px] sm:max-w-xs">{country}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className={`w-2 h-2 rounded-full transition-all duration-500 ${isLoading ? 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{isLoading ? 'Processing AI...' : 'System Ready'}</span>
          </div>
        </header>

        {/* Disclaimer Bar */}
        {showDisclaimer && (
          <div className="absolute top-16 left-0 right-0 z-10 bg-blue-50/90 dark:bg-blue-900/20 backdrop-blur-sm border-b border-blue-100 dark:border-blue-900/30 px-4 py-1.5 flex items-center justify-center transition-colors">
            <div className="flex items-center gap-2 text-[10px] md:text-xs font-medium text-blue-800 dark:text-blue-200/90">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 opacity-70">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>
                <span className="font-bold opacity-90">Educational Use Only:</span> Information provided is not a substitute for professional medical reasoning.
              </span>
            </div>
            <button
              onClick={() => setShowDisclaimer(false)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/50 rounded-full transition-colors"
              title="Dismiss"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        )}

        {/* Chat Area */}
        <div
          className={`flex-1 overflow-y-auto ${showDisclaimer ? 'pt-28' : 'pt-20'} pb-32 px-4 md:px-8 custom-scrollbar`}
          ref={chatContainerRef}
          onScroll={handleScroll}
        >
          <div className="max-w-4xl mx-auto">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} language={language} onShare={handleOpenShare} />
            ))}

            {/* Empty State Suggestions */}
            {!isLoading && (
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 px-4 animate-fade-in pb-4 ${isArabic(language) ? 'rtl' : 'ltr'}`} dir={isArabic(language) ? "rtl" : "ltr"}>
                {suggestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInput(question);
                    }}
                    className={`p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm hover:shadow-md group ${isArabic(language) ? 'text-right' : 'text-left'}`}
                  >
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-medical-600 dark:group-hover:text-medical-400 transition-colors">
                      {question}
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Scroll To Bottom */}
        {showScrollBottom && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-36 right-6 md:right-10 z-30 p-2.5 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 hover:bg-medical-50 dark:hover:bg-slate-700 hover:text-medical-600 dark:hover:text-medical-400 transition-all duration-300 animate-fade-in"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        )}

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none bg-gradient-to-t from-white via-white/90 to-transparent dark:from-[#0B1120] dark:via-[#0B1120]/90 h-32 flex items-end justify-center z-20">
          <div className="w-full max-w-4xl relative pointer-events-auto">
            <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-floating border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-200 focus-within:ring-2 focus-within:ring-medical-500/20 focus-within:border-medical-500/50">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isRecording
                    ? "Listening... Click stop to transcribe."
                    : isTranscribing
                      ? "Transcribing audio with Gemini..."
                      : isShortAnswer
                        ? `Ask for a concise summary (${country})...`
                        : `Ask a clinical question based on ${country} standards...`
                }
                rows={1}
                disabled={isLoading || isTranscribing}
                className="w-full bg-transparent text-slate-800 dark:text-white text-base pl-5 pr-44 py-4 focus:outline-none resize-none max-h-48 placeholder-slate-400 dark:placeholder-slate-500 disabled:opacity-60"
              />

              <div className="absolute right-2 bottom-2 flex items-center gap-1.5">
                <button
                  onClick={() => setIsShortAnswer(!isShortAnswer)}
                  disabled={isLoading || isTranscribing}
                  className={`h-9 px-2 md:px-3 rounded-lg transition-all duration-200 flex items-center justify-center group/concise relative text-xs font-bold uppercase tracking-wider ${isShortAnswer
                    ? 'bg-medical-50 dark:bg-medical-900/30 text-medical-600 dark:text-medical-400'
                    : 'text-slate-400 hover:text-medical-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                >
                  Short
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/concise:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                    {isShortAnswer ? "Short Answer: ON" : "Short Answer: OFF"}
                  </span>
                </button>

                {isMicSupported && (
                  <>
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

                    <div className="relative group">
                      <button
                        onClick={toggleRecording}
                        disabled={isLoading || isTranscribing}
                        className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${isRecording
                          ? 'bg-red-50 text-red-500 shadow-inner'
                          : 'text-slate-400 hover:text-medical-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                          }`}
                        title={isRecording ? "Stop Recording" : "Dictate"}
                      >
                        {isTranscribing ? (
                          <svg className="animate-spin h-5 w-5 text-medical-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : isRecording ? (
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                          </span>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                            <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
                          </svg>
                        )}
                      </button>
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                        {isRecording ? "Stop & Transcribe" : "Dictate"}
                      </span>
                    </div>
                  </>
                )}

                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

                {isLoading ? (
                  <button
                    onClick={handleStopGeneration}
                    className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <div className="w-3 h-3 bg-current rounded-[2px]"></div>
                  </button>
                ) : (
                  <button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isRecording || isTranscribing}
                    className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${input.trim() && !isRecording && !isTranscribing
                      ? 'bg-medical-600 text-white hover:bg-medical-700 shadow-md'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                      }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;