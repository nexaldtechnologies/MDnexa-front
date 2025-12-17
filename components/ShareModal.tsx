
import React, { useState, useEffect } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareData: {
    title: string;
    text: string;
    url: string;
  };
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, shareData }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) setCopied(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const encodedText = encodeURIComponent(shareData.text);
  const encodedUrl = encodeURIComponent(shareData.url);

  // We rely on shareData.text already being formatted (e.g. including "www.mdnexa.com") by the parent.
  // We do NOT append the URL here again for text-based platforms, to match the "text copy" behavior.

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareData.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const platforms = [
    {
      name: 'WhatsApp',
      color: 'bg-[#25D366] hover:bg-[#20bd5a]',
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
      ),
      url: `https://wa.me/?text=${encodedText}`
    },
    {
      name: 'Facebook',
      color: 'bg-[#1877F2] hover:bg-[#166fe5]',
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.797 1.603-2.797 2.898v1.072h4.154l-.543 3.666h-3.61V23.69c1.962.37 4.028.149 5.895-.642 1.868-.792 3.398-2.189 4.364-3.987a9.38 9.38 0 0 0 .59-3.811c0-5.18-4.2-9.381-9.381-9.381-5.18 0-9.38 4.2-9.38 9.38 0 2.029.646 3.908 1.748 5.455 1.101 1.547 2.627 2.666 4.316 3.169a9.664 9.664 0 0 0 1.1.218z"/></svg>
      ),
      // Facebook usually requires a URL parameter. We use the fallback URL provided in shareData.url.
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    },
    {
      name: 'X (Twitter)',
      color: 'bg-black hover:bg-slate-900',
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      ),
      url: `https://twitter.com/intent/tweet?text=${encodedText}`
    },
    {
      name: 'LinkedIn',
      color: 'bg-[#0A66C2] hover:bg-[#004182]',
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      ),
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    },
    {
        name: 'Email',
        color: 'bg-slate-500 hover:bg-slate-600',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" /><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" /></svg>
        ),
        url: `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodedText}`
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm shadow-2xl animate-fade-in overflow-hidden relative" 
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
             <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
           </svg>
        </button>

        <div className="p-6 text-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Share</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Select a platform to share this content.</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
                {platforms.map((platform) => (
                    <a 
                        key={platform.name}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-2 group"
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md transition-transform transform group-hover:-translate-y-1 ${platform.color}`}>
                            {platform.icon}
                        </div>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{platform.name}</span>
                    </a>
                ))}
            </div>

            <div className="relative">
                <input 
                    type="text" 
                    readOnly 
                    value={shareData.url}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 pl-3 pr-10 text-xs text-slate-600 dark:text-slate-300 focus:outline-none"
                />
                <button 
                    onClick={handleCopy}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-medical-600 dark:hover:text-medical-400 transition-colors"
                    title="Copy Link"
                >
                    {copied ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-500">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5" />
                        </svg>
                    )}
                </button>
            </div>
            {copied && <p className="text-[10px] text-green-500 mt-1.5">Link copied to clipboard!</p>}
        </div>
      </div>
    </div>
  );
};