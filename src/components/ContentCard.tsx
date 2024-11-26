import React from 'react';
import { Play, Pause, Clock, Heart, Share2 } from 'lucide-react';
import { useContentStore, type Content } from '../store/contentStore';
import { usePlayerStore } from '../store/playerStore';
import { cn } from '../lib/utils';

interface ContentCardProps {
  content: Content;
  className?: string;
}

export function ContentCard({ content, className }: ContentCardProps) {
  const { currentContent, setCurrentContent } = useContentStore();
  const { isPlaying, setPlaying } = usePlayerStore();
  const isCurrentTrack = currentContent?.id === content.id;

  const handlePlay = () => {
    if (!content.audioUrl) return;

    if (isCurrentTrack) {
      setPlaying(!isPlaying);
    } else {
      setCurrentContent(content);
      setPlaying(true);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-lg bg-gray-900 transition-all hover:scale-105",
      className
    )}>
      <div className="aspect-square w-full overflow-hidden">
        <img
          src={content.imageUrl}
          alt={content.title}
          className="h-full w-full object-cover transition-all group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://source.unsplash.com/random/800x800?music&sig=${content.id}`;
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 p-4 w-full">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white line-clamp-1">{content.title}</h3>
              <p className="text-sm text-gray-300 line-clamp-1">{content.artist}</p>
            </div>
            <button 
              onClick={handlePlay}
              disabled={!content.audioUrl}
              className={cn(
                "rounded-full p-3 text-white transition",
                content.audioUrl 
                  ? "bg-blue-500 hover:bg-blue-600" 
                  : "bg-gray-500 cursor-not-allowed"
              )}
            >
              {isCurrentTrack && isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="mt-2 flex items-center gap-3 text-sm text-gray-300">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatDuration(content.duration)}
            </span>
            <button className="flex items-center gap-1 hover:text-blue-400 transition">
              <Heart className="h-4 w-4" />
              {content.likes.toLocaleString()}
            </button>
            <button className="flex items-center gap-1 hover:text-blue-400 transition">
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}