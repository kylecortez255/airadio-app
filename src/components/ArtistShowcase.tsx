import React from 'react';
import { useMusicUploadStore } from '../store/musicUploadStore';
import { Music, Play, Clock, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useContentStore } from '../store/contentStore';
import { usePlayerStore } from '../store/playerStore';

export function ArtistShowcase() {
  const { getApprovedTracks } = useMusicUploadStore();
  const { setCurrentContent } = useContentStore();
  const { setPlaying } = usePlayerStore();
  const tracks = getApprovedTracks();

  const handlePlay = (track: any) => {
    setCurrentContent({
      id: track.id,
      title: track.title,
      artist: track.artist,
      type: 'music',
      duration: 0,
      imageUrl: track.coverUrl || `https://source.unsplash.com/random/800x800?artist&sig=${track.id}`,
      audioUrl: track.audioUrl,
      description: `Uploaded by ${track.artist}`,
      tags: [track.genre],
      likes: track.playCount * 10,
      plays: track.playCount,
      createdAt: new Date(track.uploadedAt)
    });
    setPlaying(true);
  };

  if (tracks.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold">Community Artists</h2>
        <Music className="w-5 h-5 text-purple-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tracks.map((track) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg overflow-hidden group hover:bg-gray-700 transition"
          >
            <div className="aspect-square relative">
              <img
                src={track.coverUrl || `https://source.unsplash.com/random/800x800?artist&sig=${track.id}`}
                alt={track.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handlePlay(track)}
                  className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition transform scale-90 group-hover:scale-100"
                >
                  <Play className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-1 line-clamp-1">{track.title}</h3>
              <p className="text-sm text-gray-400 mb-2">{track.artist}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(track.uploadedAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <BarChart3 className="w-4 h-4" />
                  {track.playCount} plays
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}