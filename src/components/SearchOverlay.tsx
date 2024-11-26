import React, { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-lg z-50">
      <div className="max-w-3xl mx-auto px-4 pt-20">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for music, podcasts, news..."
            className="w-full bg-white/10 border border-white/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-400 mb-4">Recent Searches</h3>
          <div className="space-y-2">
            {['Tech News', 'Chill Music', 'Sports Updates'].map((item) => (
              <button
                key={item}
                className="flex items-center gap-3 w-full p-2 hover:bg-white/5 rounded-lg transition"
              >
                <Search className="w-4 h-4 text-gray-400" />
                <span>{item}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}