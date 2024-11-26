import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Player } from './components/Player';
import { ContentCard } from './components/ContentCard';
import { RecommendedSection } from './components/RecommendedSection';
import { AuthModal } from './components/AuthModal';
import { useAuthStore } from './store/authStore';
import { useContentStore } from './store/contentStore';
import { AIDJPresenter } from './components/AIDJPresenter';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { PlansPage } from './pages/PlansPage';
import { SubmitAdPage } from './pages/SubmitAdPage';
import { NewsPage } from './pages/NewsPage';
import { UploadMusicPage } from './pages/UploadMusicPage';

export default function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Navigation />

      {!isAuthenticated && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
          >
            Sign In
          </button>
        </div>
      )}

      <main className="pt-20 pb-32">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/submit-ad" element={<SubmitAdPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/upload" element={<UploadMusicPage />} />
        </Routes>
      </main>

      <Player />
      <AIDJPresenter />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}