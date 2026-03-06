'use client';

import React, { useState } from 'react';

interface SocialShareBarProps {
  expression: string;
  result: string;
}

export default function SocialShareBar({ expression, result }: SocialShareBarProps) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50) + 1);

  const shareText = `I calculated ${expression} = ${result} on ABC Tester! 🧮✨`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://abctester.app';

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${expression} = ${result} | ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const el = document.createElement('textarea');
      el.value = `${expression} = ${result}`;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setLikeCount((c) => c + 1);
    } else {
      setLiked(false);
      setLikeCount((c) => c - 1);
    }
  };

  return (
    <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 animate-fade-in-up">
      {/* Calculation preview */}
      <div className="mb-3 p-3 bg-white/10 rounded-xl">
        <p className="text-white/60 text-xs font-mono truncate">{expression}</p>
        <p className="text-white font-bold text-xl font-mono">= {result}</p>
      </div>

      {/* Share label */}
      <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3">
        Share your result
      </p>

      {/* Social buttons */}
      <div className="flex items-center gap-2">
        {/* Like button */}
        <button
          onClick={handleLike}
          className={`social-btn flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
            liked
              ? 'bg-pink-500/80 text-white'
              : 'bg-white/15 text-white/80 hover:bg-pink-500/60 hover:text-white'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={liked ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={liked ? 0 : 2}
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
          <span>{likeCount}</span>
        </button>

        {/* Twitter/X */}
        <button
          onClick={handleTwitterShare}
          className="social-btn flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/40 hover:bg-black/60 text-white text-sm font-medium"
          title="Share on X (Twitter)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>Tweet</span>
        </button>

        {/* Facebook */}
        <button
          onClick={handleFacebookShare}
          className="social-btn flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600/70 hover:bg-blue-500/80 text-white text-sm font-medium"
          title="Share on Facebook"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>Share</span>
        </button>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className={`social-btn flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ml-auto ${
            copied
              ? 'bg-green-500/70 text-white'
              : 'bg-white/15 hover:bg-white/25 text-white/80'
          }`}
          title="Copy link"
        >
          {copied ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
