import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Mic, Volume2, VolumeX } from 'lucide-react';
import { useSpotifyStore } from '../store/spotifyStore';
import { useNewsStore } from '../store/newsStore';
import { useAdStore } from '../store/adStore';
import { useMusicUploadStore } from '../store/musicUploadStore';
import { useContentStore } from '../store/contentStore';
import { usePlayerStore } from '../store/playerStore';
import { generateSpeech } from '../services/openAIService';

interface Announcement {
  id: string;
  type: 'news' | 'song' | 'ad' | 'greeting' | 'uploaded';
  content: string;
  timestamp: Date;
  track?: any;
}

export function AIDJPresenter() {
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isAnnouncing, setIsAnnouncing] = useState(false);
  const { topTracks, newReleases } = useSpotifyStore();
  const { articles } = useNewsStore();
  const { getActiveAds, updateAnnouncementCount } = useAdStore();
  const { getNextScheduledTrack, markAsPlayed, getApprovedTracks } = useMusicUploadStore();
  const { setCurrentContent } = useContentStore();
  const { setPlaying, isPlaying } = usePlayerStore();

  const makeAnnouncement = async () => {
    if (isAnnouncing || isMuted) return;

    const types: ('news' | 'song' | 'ad' | 'greeting' | 'uploaded')[] = ['greeting'];
    
    if (articles.length > 0) types.push('news');
    if (topTracks.length > 0 || newReleases.length > 0) types.push('song');
    if (getActiveAds().length > 0) types.push('ad');
    if (getApprovedTracks().length > 0) types.push('uploaded');

    const type = types[Math.floor(Math.random() * types.length)];
    let content = '';
    let track;

    setIsAnnouncing(true);

    switch (type) {
      case 'news':
        const article = articles[Math.floor(Math.random() * articles.length)];
        content = `Breaking news: ${article.title}`;
        break;

      case 'song':
        const allTracks = [...topTracks, ...newReleases];
        track = allTracks[Math.floor(Math.random() * allTracks.length)];
        content = `Now playing: "${track.title}" by ${track.artist}. ${
          track.chartPosition ? `Currently at number ${track.chartPosition} on the charts!` : ''
        }`;
        break;

      case 'uploaded':
        const communityTracks = getApprovedTracks();
        if (communityTracks.length > 0) {
          const uploadedTrack = communityTracks[Math.floor(Math.random() * communityTracks.length)];
          content = `From our community: "${uploadedTrack.title}" by ${uploadedTrack.artist}. Supporting independent artists!`;
          track = uploadedTrack;
        }
        break;

      case 'ad':
        const ads = getActiveAds();
        if (ads.length > 0) {
          const ad = ads[Math.floor(Math.random() * ads.length)];
          content = `Quick message from our sponsor: ${ad.text}`;
          updateAnnouncementCount(ad.id);
        }
        break;

      case 'greeting':
        const hour = new Date().getHours();
        const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
        content = `Good ${timeOfDay}! You're tuned in to AI Radio, where the music never stops.`;
        break;
    }

    if (!content) {
      setIsAnnouncing(false);
      return;
    }

    const announcement: Announcement = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content,
      timestamp: new Date(),
      track
    };

    setCurrentAnnouncement(announcement);

    try {
      await generateSpeech(content);
      
      if (track) {
        // Wait a bit after the announcement before playing the track
        setTimeout(() => {
          setCurrentContent({
            id: track.id,
            title: track.title,
            artist: track.artist,
            type: 'music',
            duration: track.duration || 0,
            imageUrl: track.coverUrl || `https://source.unsplash.com/random/800x800?music&sig=${track.id}`,
            audioUrl: track.previewUrl || track.audioUrl,
            description: track.album || `Played on AI Radio`,
            tags: track.genre ? [track.genre] : [],
            likes: track.popularity ? track.popularity * 100 : track.playCount * 10,
            plays: track.popularity ? track.popularity * 1000 : track.playCount,
            createdAt: new Date(track.releaseDate || track.uploadedAt)
          });
          setPlaying(true);
        }, 2000);
      }
    } catch (error) {
      console.error('Speech generation failed:', error);
    }

    // Clear the announcement after 5 seconds
    setTimeout(() => {
      setCurrentAnnouncement(null);
      setIsAnnouncing(false);
    }, 5000);
  };

  useEffect(() => {
    if (!isPlaying && !isAnnouncing) {
      const timer = setTimeout(makeAnnouncement, 3000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, isAnnouncing]);

  return (
    <div className="fixed bottom-24 left-0 right-0 z-40 pointer-events-none">
      <div className="max-w-4xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {currentAnnouncement && (
            <motion.div
              key={currentAnnouncement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-black/80 backdrop-blur-lg rounded-lg p-4 shadow-lg pointer-events-auto"
            >
              <div className="flex items-start gap-4">
                <div className={`rounded-full p-2 ${
                  currentAnnouncement.type === 'ad' ? "bg-green-500" :
                  currentAnnouncement.type === 'news' ? "bg-red-500" :
                  currentAnnouncement.type === 'uploaded' ? "bg-purple-500" :
                  currentAnnouncement.type === 'greeting' ? "bg-yellow-500" :
                  "bg-blue-500"
                }`}>
                  {currentAnnouncement.type === 'news' ? (
                    <Radio className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-white">{currentAnnouncement.content}</p>
                </div>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:text-blue-400 transition pointer-events-auto"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}