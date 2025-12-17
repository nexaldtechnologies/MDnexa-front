import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  isRTL?: boolean;
}

/**
 * A simplified markdown renderer to avoid heavy external dependencies in this environment.
 * Handles basic formatting: bold, lists, code blocks, headers.
 */
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '', isRTL = false }) => {

  // Basic parsing logic for display
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      const trimmed = line.trim();

      // Header 3
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-bold mt-4 mb-2 text-slate-800 dark:text-slate-100">{line.replace('### ', '')}</h3>;
      }
      // Header 2
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-bold mt-5 mb-3 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-1">{line.replace('## ', '')}</h2>;
      }
      // Header 1
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold mt-6 mb-4 text-slate-900 dark:text-white">{line.replace('# ', '')}</h1>;
      }

      // IMPROVED: Handle standalone bold lines as headers (removing the **)
      // Matches: **Title**, **Title:**, **Title**: which are common in AI responses
      // We look for lines starting with **, capturing content, closing with **, followed optionally by : - or whitespace
      const boldHeaderMatch = trimmed.match(/^\*\*(.+?)\*\*[:\s-]*$/);
      if (boldHeaderMatch) {
        const cleanText = boldHeaderMatch[1];
        return <h3 key={index} className="text-lg font-bold mt-4 mb-2 text-slate-800 dark:text-slate-100">{cleanText}</h3>;
      }

      // List items
      // List items
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <div key={index} className={`flex mb-1 gap-2 ${isRTL ? 'mr-4' : 'ml-4'}`}>
            <span className="text-slate-500 dark:text-slate-400">•</span>
            <span className={isRTL ? "text-right" : ""}>{formatInline(trimmed.replace(/^[-*]\s/, ''))}</span>
          </div>
        );
      }
      // Numbered lists
      const numberedMatch = line.match(/^(\d+)\.\s(.+)/);
      if (numberedMatch) {
        return (
          <div key={index} className={`flex mb-1 gap-2 ${isRTL ? 'mr-4' : 'ml-4'}`}>
            <span className="font-semibold text-slate-600 dark:text-slate-300">{numberedMatch[1]}.</span>
            <span className={isRTL ? "text-right" : ""}>{formatInline(numberedMatch[2])}</span>
          </div>
        );
      }

      // Empty line
      if (trimmed === '') {
        return <div key={index} className="h-2"></div>;
      }

      // Default paragraph
      return <p key={index} className="mb-1 leading-relaxed">{formatInline(line)}</p>;
    });
  };

  // Helper for bold/italic
  const formatInline = (text: string): React.ReactNode[] => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className={`text-slate-700 dark:text-slate-300 text-sm md:text-base ${className}`}>
      {renderContent(content)}
    </div>
  );
};

export default MarkdownRenderer;