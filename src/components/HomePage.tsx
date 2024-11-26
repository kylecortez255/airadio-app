import React, { useEffect } from 'react';
import { useMusicStore } from '../store/musicStore';
import { ContentCard } from '../components/ContentCard';
import { RecommendedSection } from '../components/RecommendedSection';
import { Music, TrendingUp, Crown } from 'lucide-react';

export function HomePage() {
  const { 
    trendingTracks, 
    chartTracks, 
    isLoading, 
    error,
    fetchTrending,
    fetchCharts
  } = useMusicStore();

  useEffect(() => {
    fetchTrending();
    fetchCharts();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => {
              fetchTrending();
              fetchCharts();
            }}
            className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="max-w-7xl mx-auto">
        <RecommendedSection />

        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold">Trending Now</h2>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingTracks.map((track) => (
              <ContentCard
                key={track.id}
                content={{
                  id: track.id,
                  title: track.title,
                  artist: track.artist,
                  type: 'music',
                  duration: 0,
                  imageUrl: track.coverUrl,
                  audioUrl: track.previewUrl,
                  description: `From ${track.album}`,
                  tags: [track.source],
                  likes: track.popularity * 100,
                  plays: track.popularity * 1000,
                  createdAt: new Date(),
                }}
              />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold">Top Charts</h2>
            <Crown className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {chartTracks.map((track) => (
              <ContentCard
                key={track.id}
                content={{
                  id: track.id,
                  title: track.title,
                  artist: track.artist,
                  type: 'music',
                  duration: 0,
                  imageUrl: track.coverUrl,
                  audioUrl: track.previewUrl,
                  description: `#${track.chartPosition} on ${track.source} Charts`,
                  tags: [track.source],
                  likes: track.popularity * 100,
                  plays: track.popularity * 1000,
                  createdAt: new Date(),
                }}
              />
            ))}
          </div>
        </section>

        {isLoading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        )}
      </div>
    </div>
  );
}