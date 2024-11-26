import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Settings, LogOut, User as UserIcon, Crown } from 'lucide-react';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-white/10 rounded-full p-1 transition"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-sm font-medium">{user.name[0]}</span>
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-700">
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
          
          {user.subscription === 'premium' && (
            <div className="px-4 py-2 text-sm text-blue-400 flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Premium Member
            </div>
          )}
          
          <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-700 flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            Profile
          </button>
          <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-700 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <button
            onClick={logout}
            className="w-full px-4 py-2 text-sm text-left hover:bg-gray-700 flex items-center gap-2 text-red-400"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}