import React from 'react';

export const Logo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <img
    src="/logo.png"
    alt="MDnexa™ Logo"
    className={className}
  />
);