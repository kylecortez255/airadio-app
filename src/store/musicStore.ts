import { create } from 'zustand';
import { musicService, type Track } from '../services/musicService';

interface MusicState {
  trendingTracks: Track[];
  chartTracks: Track[];
  isLoading: boolean;
  error: string | null;
  fetchTrending: () => Promise<void>;
  fetchCharts: () => Promise<void>;
  searchTracks: (query: string) => Promise<Track[]>;
}

export const useMusicStore = create<MusicState>((set, get) => ({
  trendingTracks: [],
  chartTracks: [],
  isLoading: false,
  error: null,

  fetchTrending: async () => {
    set({ isLoading: true, error: null });
    try {
      const tracks = await musicService.getTrendingTracks();
      set({ trendingTracks: tracks });
    } catch (error) {
      set({ error: 'Failed to fetch trending tracks' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCharts: async () => {
    set({ isLoading: true, error: null });
    try {
      const tracks = await musicService.getChartToppers();
      set({ chartTracks: tracks });
    } catch (error) {
      set({ error: 'Failed to fetch chart tracks' });
    } finally {
      set({ isLoading: false });
    }
  },

  searchTracks: async (query: string) => {
    try {
      return await musicService.searchTracks(query);
    } catch (error) {
      set({ error: 'Failed to search tracks' });
      return [];
    }
  }
}));