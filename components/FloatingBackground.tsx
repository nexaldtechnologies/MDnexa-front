
import React, { useEffect, useState } from 'react';

// Geometric / Medical Icons
const icons = [
  // Plus (Medical Cross)
  (props: any) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  // Circle (Cell/Atom)
  (props: any) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="8" />
    </svg>
  ),
  // Hexagon (Chemistry/Structure)
  (props: any) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8.66 5v10L12 21 3.34 18V8L12 3z" />
    </svg>
  ),
  // Sparkle (AI/Intelligence)
  (props: any) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  ),
  // Pill/Capsule (Pharma)
  (props: any) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="6" y="4" width="12" height="16" rx="6" />
      <path d="M6 12h12" />
    </svg>
  ),
  // Cube (Structure)
  (props: any) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
  )
];

interface IconItem {
  id: number;
  Icon: any;
  delay: string;
  duration: string;
  tx: number; // translate X
  ty: number; // translate Y
  rot: number; // rotation
}

export const FloatingBackground: React.FC = () => {
  const [items, setItems] = useState<IconItem[]>([]);

  useEffect(() => {
    // Generate a fixed grid of items
    const rows = 4;
    const cols = 6;
    const newItems: IconItem[] = [];

    for (let i = 0; i < rows * cols; i++) {
      newItems.push({
        id: i,
        Icon: icons[Math.floor(Math.random() * icons.length)],
        delay: `${Math.random() * -10}s`, // Negative delay to start mid-animation
        duration: `${15 + Math.random() * 10}s`, // Very slow (15-25s)
        tx: Math.random() * 20 - 10,
        ty: Math.random() * 20 - 10,
        rot: Math.random() * 360,
      });
    }
    setItems(newItems);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none -z-10">
      {/* CSS Keyframes for the floating effect */}
      <style>{`
        @keyframes subtle-float {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(10px, -10px) rotate(5deg); }
          50% { transform: translate(5px, 5px) rotate(10deg); }
          75% { transform: translate(-10px, 8px) rotate(5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        .animate-subtle-float {
          animation-name: subtle-float;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      `}</style>

      {/* Grid Container */}
      <div className="grid grid-cols-3 md:grid-cols-6 h-full w-full opacity-[0.08] dark:opacity-[0.06]">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-center p-8 md:p-12 relative">
            <div
              className="text-slate-900 dark:text-white animate-subtle-float"
              style={{
                animationDelay: item.delay,
                animationDuration: item.duration,
              }}
            >
              <item.Icon className="w-8 h-8 md:w-12 md:h-12" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Soft Gradient Overlay to fade edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-slate-950"></div>
    </div>
  );
};
