'use client';

import React from 'react';

interface HeaderProps {
  onToggleHistory: () => void;
  historyOpen: boolean;
}

export default function Header({ onToggleHistory, historyOpen }: HeaderProps) {
  return (
    <header className="w-full bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-xl leading-tight">
              {process.env.NEXT_PUBLIC_APP_NAME || 'ABC Tester'}
            </h1>
            <p className="text-white/60 text-xs">Smart Calculator &amp; Share</p>
          </div>
        </div>

        {/* Nav Actions */}
        <div className="flex items-center gap-3">
          {/* History Toggle - Mobile Only */}
          <button
            onClick={onToggleHistory}
            className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm font-medium transition-all duration-200"
            aria-label="Toggle calculation history"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{historyOpen ? 'Hide' : 'History'}</span>
          </button>

          {/* Profile Avatar (decorative) */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-white/50 transition-all">
            <span className="text-white text-sm font-bold">U</span>
          </div>
        </div>
      </div>

      {/* Social Media Style Sub-nav */}
      <div className="max-w-5xl mx-auto px-4 pb-2 flex items-center gap-6 overflow-x-auto">
        {['Calculator', 'History', 'Trending', 'Friends'].map((item, idx) => (
          <button
            key={item}
            className={`text-sm font-medium pb-1 whitespace-nowrap transition-colors ${
              idx === 0
                ? 'text-white border-b-2 border-white'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </header>
  );
}
