import React, { useEffect, useRef, useState } from 'react';
import { usePlayerStore } from '../store/playerStore';
import { useAudioStore } from '../store/audioStore';
import { useContentStore } from '../store/contentStore';
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart, Share2, VolumeX } from 'lucide-react';
import { cn } from '../lib/utils';

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const { currentContent } = useContentStore();
  const { setPlaying, isPlaying, playbackPromise, setPlaybackPromise } = usePlayerStore();
  const { initialize, setVolume, volume } = useAudioStore();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (currentContent?.audioUrl && audioRef.current) {
      audioRef.current.src = currentContent.audioUrl;
      audioRef.current.volume = volume;
      if (isPlaying) {
        const promise = audioRef.current.play();
        setPlaybackPromise(promise);
        promise.catch((error) => {
          console.error('Playback failed:', error);
          setPlaying(false);
        });
      }
    }
  }, [currentContent]);

  const handlePlayPause = async () => {
    if (!audioRef.current || !currentContent) return;
    
    if (playbackPromise) {
      await playbackPromise;
      setPlaybackPromise(null);
    }
    
    if (isPlaying) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      try {
        const promise = audioRef.current.play();
        setPlaybackPromise(promise);
        await promise;
        setPlaying(true);
      } catch (error) {
        console.error('Playback failed:', error);
        setPlaying(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      if (playbackPromise) {
        await playbackPromise;
        setPlaybackPromise(null);
      }
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      audioRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEnded = () => {
    setPlaying(false);
    setPlaybackPromise(null);
  };

  if (!currentContent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 text-white p-4 backdrop-blur-lg border-t border-white/10">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleTimeUpdate}
      />
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-[240px]">
          <img 
            src={currentContent.imageUrl} 
            alt={currentContent.title}
            className="w-12 h-12 rounded-md object-cover"
          />
          <div>
            <h3 className="font-medium line-clamp-1">{currentContent.title}</h3>
            <p className="text-sm text-gray-400 line-clamp-1">{currentContent.artist}</p>
          </div>
        </div>
        
        <div className="flex-1 max-w-2xl">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-4">
              <button className="hover:text-blue-400 transition">
                <SkipBack className="w-5 h-5" />
              </button>
              <button 
                onClick={handlePlayPause}
                className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button className="hover:text-blue-400 transition">
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
            <div className="w-full flex items-center gap-3 text-sm">
              <span className="w-12 text-right">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1"
              />
              <span className="w-12">{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 min-w-[240px] justify-end">
          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="hover:text-blue-400 transition">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24"
            />
          </div>
          <button className="hover:text-blue-400 transition">
            <Heart className="w-5 h-5" />
          </button>
          <button className="hover:text-blue-400 transition">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}