import React, { useEffect } from 'react';
import { useSpotifyStore } from '../store/spotifyStore';
import { ContentCard } from '../components/ContentCard';
import { RecommendedSection } from '../components/RecommendedSection';
import { ArtistShowcase } from '../components/ArtistShowcase';
import { Music, TrendingUp, Crown } from 'lucide-react';

export function HomePage() {
  const { 
    topTracks, 
    newReleases, 
    isLoading, 
    error,
    fetchTopTracks,
    fetchNewReleases
  } = useSpotifyStore();

  useEffect(() => {
    fetchTopTracks();
    fetchNewReleases();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => {
              fetchTopTracks();
              fetchNewReleases();
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
        
        <ArtistShowcase />

        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold">Top Charts</h2>
            <Crown className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topTracks.map((track, index) => (
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
                  description: `#${index + 1} on Spotify Charts`,
                  tags: track.explicit ? ['Explicit'] : [],
                  likes: track.popularity * 100,
                  plays: track.popularity * 1000,
                  createdAt: new Date(track.releaseDate)
                }}
              />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold">New Releases</h2>
            <Music className="w-5 h-5 text-green-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newReleases.map((track) => (
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
                  description: `Released ${new Date(track.releaseDate).toLocaleDateString()}`,
                  tags: track.explicit ? ['Explicit'] : [],
                  likes: track.popularity * 100,
                  plays: track.popularity * 1000,
                  createdAt: new Date(track.releaseDate)
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