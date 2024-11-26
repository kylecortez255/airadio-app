import React, { useState } from 'react';
import { Radio, Mic, Newspaper, Search, Bell, Upload, Menu, Crown, DollarSign } from 'lucide-react';
import { SearchOverlay } from './SearchOverlay';
import { MobileMenu } from './MobileMenu';
import { UserMenu } from './UserMenu';
import { NotificationPanel } from './NotificationPanel';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import { Link, useLocation } from 'react-router-dom';

export function Navigation() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { getUnreadCount } = useNotificationStore();
  const location = useLocation();
  const unreadCount = getUnreadCount();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-lg border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2">
                <Radio className="w-8 h-8 text-blue-500" />
                <span className="text-xl font-bold">AI Radio</span>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <Link 
                to="/" 
                className={`flex items-center gap-2 transition ${
                  location.pathname === '/' ? 'text-blue-400' : 'hover:text-blue-400'
                }`}
              >
                <Mic className="w-5 h-5" />
                Home
              </Link>
              <Link 
                to="/news" 
                className={`flex items-center gap-2 transition ${
                  location.pathname === '/news' ? 'text-blue-400' : 'hover:text-blue-400'
                }`}
              >
                <Newspaper className="w-5 h-5" />
                News
              </Link>
              <Link 
                to="/plans" 
                className={`flex items-center gap-2 transition ${
                  location.pathname === '/plans' ? 'text-blue-400' : 'hover:text-blue-400'
                }`}
              >
                <Crown className="w-5 h-5" />
                Plans
              </Link>
              <Link 
                to="/submit-ad" 
                className={`flex items-center gap-2 transition ${
                  location.pathname === '/submit-ad' ? 'text-blue-400' : 'hover:text-blue-400'
                }`}
              >
                <DollarSign className="w-5 h-5" />
                Submit Ad
              </Link>
              <Link 
                to="/upload" 
                className={`flex items-center gap-2 transition ${
                  location.pathname === '/upload' ? 'text-blue-400' : 'hover:text-blue-400'
                }`}
              >
                <Upload className="w-5 h-5" />
                Upload Music
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSearchOpen(true)} 
                className="p-2 hover:bg-white/10 rounded-full transition"
              >
                <Search className="w-5 h-5" />
              </button>
              {isAuthenticated && (
                <>
                  <button 
                    onClick={() => setIsNotificationsOpen(true)}
                    className="p-2 hover:bg-white/10 rounded-full transition relative"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <UserMenu />
                </>
              )}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 hover:bg-white/10 rounded-full transition"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <NotificationPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
    </>
  );
}