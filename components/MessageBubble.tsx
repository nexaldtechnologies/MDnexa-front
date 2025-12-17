import React, { useState, useEffect, useRef } from 'react';
import { Message, Role } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { Logo } from './Logo';
import { isWelcomeMessage, isArabic } from '../constants';

interface MessageBubbleProps {
  message: Message;
  language?: string;
  onShare?: (title: string, text: string) => void;
}

// --- GLOBAL AUDIO MANAGER ---
// Ensures only ONE message plays at a time.
let globalStopAudio: (() => void) | null = null;

// Clean text for better speech synthesis
const cleanMarkdownForSpeech = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/^#+\s+/gm, '') // Remove headers
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1') // Remove bold/italic
    .replace(/[*_]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
    .replace(/`{1,3}[^`]+`{1,3}/g, ' code snippet ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, language = 'en-US', onShare }) => {
  const isUser = message.role === Role.USER;
  const isRTL = isArabic(language);
  const [isCopied, setIsCopied] = useState(false);

  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);

  // Simple Effect to enable audio button if text exists
  useEffect(() => {
    if (!isUser && message.text && !isWelcomeMessage(message.text)) {
      setIsAudioReady(true);
    }
  }, [isUser, message.text]);

  const stopAudio = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    if (globalStopAudio === stopAudio) {
      globalStopAudio = null;
    }
  };

  const handlePlayAudio = () => {
    if (isPlaying) {
      stopAudio();
      return;
    }

    // Stop any other message currently playing
    if (globalStopAudio) globalStopAudio();
    globalStopAudio = stopAudio;

    const cleanText = cleanMarkdownForSpeech(message.text);
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Attempt to match language (e.g. 'en-US', 'ar-SA')
    // Browser support varies, but this hint helps.
    utterance.lang = language;

    utterance.onend = () => {
      setIsPlaying(false);
      globalStopAudio = null;
    };
    utterance.onerror = () => {
      setIsPlaying(false);
      globalStopAudio = null;
    };

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  // Cleanup on unmount or id change
  useEffect(() => {
    return () => {
      if (isPlaying) stopAudio();
    };
  }, [message.id]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`flex w-full mb-8 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`relative max-w-[90%] md:max-w-[85%] lg:max-w-[80%] ${isUser
          ? 'bg-medical-600 text-white rounded-2xl rounded-br-sm shadow-md'
          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-card text-slate-800 dark:text-slate-200 w-full'
          } ${message.isError ? 'border-red-300 bg-red-50 dark:bg-red-900/10 text-red-800 dark:text-red-300' : ''}`}
        dir={isRTL && !isUser ? 'rtl' : 'ltr'}
      >
        {!isUser && (
          <div className="flex items-center justify-between px-5 py-2.5 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800 rounded-t-xl">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 flex items-center justify-center overflow-hidden">
                <Logo className="w-3 h-3" />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">MDnexa™ Clinical Response</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">ID: {message.id.substring(0, 6)}</span>
          </div>
        )}

        <div className={`p-5 ${isUser ? 'py-4' : 'py-6'} ${isRTL && !isUser ? 'text-right' : ''}`}>
          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{message.text}</p>
          ) : (
            message.text === '' ? (
              <div className="flex items-center gap-1.5 h-6">
                <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"></span>
              </div>
            ) : (
              <div className={isRTL ? "rtl-content" : ""}>
                <MarkdownRenderer content={message.text} className={`prose-sm md:prose-base ${isRTL ? 'text-right' : ''}`} isRTL={isRTL} />
              </div>
            )
          )}
        </div>

        <div className={`flex items-center justify-between px-5 pb-3 ${isUser ? 'pt-0' : 'pt-2 border-t border-slate-50 dark:border-slate-700/30'}`}>
          <div className={`text-[10px] font-medium ${isUser ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>

          {/* ACTION BUTTONS (Share, Copy, Read Aloud) */}
          {/* HIDE ALL ACTIONS FOR WELCOME MESSAGE */}
          {!isUser && !message.isError && !isWelcomeMessage(message.text) && (
            <div className="flex items-center gap-4">
              {/* Play Button - STRICTLY VISIBLE ONLY WHEN FULL AUDIO IS READY */}
              {isAudioReady && (
                <>
                  <button
                    onClick={handlePlayAudio}
                    className={`flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider transition-colors ${isPlaying
                      ? 'text-medical-600 dark:text-medical-400'
                      : 'text-slate-400 dark:text-slate-500 hover:text-medical-600 dark:hover:text-medical-400'
                      }`}
                    title={isPlaying ? "Stop" : "Read Aloud"}
                  >
                    {isPlaying ? (
                      <>
                        <span className="relative flex h-2.5 w-2.5 mr-0.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-medical-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-medical-500"></span>
                        </span>
                        <span>Stop</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                        </svg>
                        <span>Read Aloud</span>
                      </>
                    )}
                  </button>

                  <div className="w-px h-3 bg-slate-200 dark:bg-slate-700"></div>
                </>
              )}

              {onShare && (
                <>
                  <button
                    onClick={() => onShare("MDnexa Clinical Response", message.text)}
                    className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 hover:text-medical-600 dark:hover:text-medical-400 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                    </svg>
                    <span>Share</span>
                  </button>
                  <div className="w-px h-3 bg-slate-200 dark:bg-slate-700"></div>
                </>
              )}

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 hover:text-medical-600 dark:hover:text-medical-400 transition-colors"
              >
                {isCopied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-green-500 dark:text-green-400">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-600 dark:text-green-400">Copied</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                    </svg>
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};