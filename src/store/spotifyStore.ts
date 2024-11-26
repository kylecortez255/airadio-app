import { create } from 'zustand';
import { spotifyService, type SpotifyTrack } from '../services/spotifyService';

interface SpotifyState {
  topTracks: SpotifyTrack[];
  newReleases: SpotifyTrack[];
  recommendations: SpotifyTrack[];
  isLoading: boolean;
  error: string | null;
  fetchTopTracks: () => Promise<void>;
  fetchNewReleases: () => Promise<void>;
  fetchRecommendations: () => Promise<void>;
}

export const useSpotifyStore = create<SpotifyState>((set) => ({
  topTracks: [],
  newReleases: [],
  recommendations: [],
  isLoading: false,
  error: null,

  fetchTopTracks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tracks = await spotifyService.getTopTracks();
      set({ topTracks: tracks });
    } catch (error) {
      set({ error: 'Failed to fetch top tracks' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchNewReleases: async () => {
    set({ isLoading: true, error: null });
    try {
      const tracks = await spotifyService.getNewReleases();
      set({ newReleases: tracks });
    } catch (error) {
      set({ error: 'Failed to fetch new releases' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchRecommendations: async () => {
    set({ isLoading: true, error: null });
    try {
      const tracks = await spotifyService.getRecommendations();
      set({ recommendations: tracks });
    } catch (error) {
      set({ error: 'Failed to fetch recommendations' });
    } finally {
      set({ isLoading: false });
    }
  }
}));