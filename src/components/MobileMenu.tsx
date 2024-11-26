import React from 'react';
import { X, Mic, Newspaper, Upload, Settings, Crown, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-lg z-50 md:hidden">
      <div className="flex flex-col h-full">
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-8">
          <div className="space-y-4">
            <Link 
              to="/"
              onClick={onClose}
              className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg transition"
            >
              <Mic className="w-6 h-6" />
              <span className="text-lg">Home</span>
            </Link>
            <Link 
              to="/news"
              onClick={onClose}
              className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg transition"
            >
              <Newspaper className="w-6 h-6" />
              <span className="text-lg">News</span>
            </Link>
            <Link 
              to="/plans"
              onClick={onClose}
              className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg transition"
            >
              <Crown className="w-6 h-6" />
              <span className="text-lg">Plans</span>
            </Link>
            <Link 
              to="/submit-ad"
              onClick={onClose}
              className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg transition"
            >
              <DollarSign className="w-6 h-6" />
              <span className="text-lg">Submit Ad</span>
            </Link>
            <Link 
              to="/upload"
              onClick={onClose}
              className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg transition"
            >
              <Upload className="w-6 h-6" />
              <span className="text-lg">Upload Music</span>
            </Link>
            <hr className="border-white/10 my-6" />
            <button className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg transition w-full">
              <Settings className="w-6 h-6" />
              <span className="text-lg">Settings</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}