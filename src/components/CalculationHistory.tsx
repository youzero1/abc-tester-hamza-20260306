'use client';

import React, { useState } from 'react';
import { CalculationRecord } from '@/types';

interface CalculationHistoryProps {
  history: CalculationRecord[];
  loading: boolean;
  onSelectResult: (result: string) => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString();
}

export default function CalculationHistory({
  history,
  loading,
  onSelectResult,
}: CalculationHistoryProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = async (item: CalculationRecord) => {
    try {
      await navigator.clipboard.writeText(`${item.expression} = ${item.result}`);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
    }
  };

  const handleClearHistory = async () => {
    try {
      await fetch('/api/history', { method: 'DELETE' });
      window.location.reload();
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  return (
    <div
      className="w-full bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden"
      style={{ boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/15 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="white"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm">History</h2>
            <p className="text-white/50 text-xs">{history.length} calculations</p>
          </div>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="text-white/40 hover:text-red-400 text-xs transition-colors px-2 py-1 rounded-lg hover:bg-red-400/10"
          >
            Clear all
          </button>
        )}
      </div>

      {/* History List */}
      <div className="overflow-y-auto max-h-[480px] divide-y divide-white/10">
        {loading ? (
          <div className="p-8 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white/80 rounded-full animate-spin" />
            <p className="text-white/50 text-sm">Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="p-8 flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="white"
                className="w-8 h-8 opacity-50"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-white/70 font-medium text-sm">No calculations yet</p>
              <p className="text-white/40 text-xs mt-1">
                Start calculating to see your history here
              </p>
            </div>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="history-item p-4 hover:bg-white/10 cursor-pointer group animate-fade-in-up"
              onClick={() => onSelectResult(item.result)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-white/60 text-xs font-mono truncate">
                    {item.expression}
                  </p>
                  <p className="text-white font-semibold text-lg font-mono">
                    = {item.result}
                  </p>
                  <p className="text-white/40 text-xs mt-1">
                    {formatDate(item.createdAt)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(item);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70"
                  title="Copy calculation"
                >
                  {copiedId === item.id ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-3.5 h-3.5 text-green-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-3.5 h-3.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
