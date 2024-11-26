import { create } from 'zustand';
import { Content } from './contentStore';

interface PlayerState {
  isPlaying: boolean;
  currentTrack: Content | null;
  queue: Content[];
  playbackPromise: Promise<void> | null;
  setPlaying: (playing: boolean) => void;
  setTrack: (track: Content | null) => void;
  setPlaybackPromise: (promise: Promise<void> | null) => void;
  addToQueue: (track: Content) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  currentTrack: null,
  queue: [],
  playbackPromise: null,
  setPlaying: (playing) => set({ isPlaying: playing }),
  setTrack: (track) => set({ currentTrack: track }),
  setPlaybackPromise: (promise) => set({ playbackPromise: promise }),
  addToQueue: (track) => set((state) => ({ queue: [...state.queue, track] })),
  removeFromQueue: (id) => set((state) => ({
    queue: state.queue.filter((track) => track.id !== id)
  })),
  clearQueue: () => set({ queue: [] })
}));