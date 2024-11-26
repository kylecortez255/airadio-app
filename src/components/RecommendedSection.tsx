import React, { useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { ContentCard } from './ContentCard';
import { useSpotifyStore } from '../store/spotifyStore';

export function RecommendedSection() {
  const { recommendations, fetchRecommendations, isLoading } = useSpotifyStore();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold">Recommended for You</h2>
        <Sparkles className="w-5 h-5 text-blue-400 animate-pulse-slow" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((track) => (
          <ContentCard
            key={track.id}
            content={{
              id: track.id,
              title: track.title,
              artist: track.artist,
              type: 'music',
              duration: track.duration,
              imageUrl: track.coverUrl,
              audioUrl: track.previewUrl,
              description: `From ${track.album}`,
              tags: track.explicit ? ['Explicit'] : [],
              likes: track.popularity * 100,
              plays: track.popularity * 1000,
              createdAt: new Date(track.releaseDate)
            }}
          />
        ))}
      </div>
    </section>
  );
}