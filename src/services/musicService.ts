import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  previewUrl: string;
  source: 'spotify' | 'apple';
  popularity: number;
  chartPosition?: number;
}

class MusicService {
  private serializeData<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
  }

  async getTrendingTracks(): Promise<Track[]> {
    try {
      const mockTracks: Track[] = Array.from({ length: 8 }, (_, i) => ({
        id: `trending-${i}`,
        title: `Trending Track ${i + 1}`,
        artist: `Artist ${i + 1}`,
        album: `Album ${i + 1}`,
        coverUrl: `https://source.unsplash.com/random/800x800?music&sig=${i}`,
        previewUrl: 'https://example.com/preview.mp3',
        source: Math.random() > 0.5 ? 'spotify' : 'apple',
        popularity: Math.floor(Math.random() * 100),
      }));

      return this.serializeData(mockTracks);
    } catch (error) {
      console.error('Error fetching trending tracks:', error);
      return [];
    }
  }

  async getChartToppers(): Promise<Track[]> {
    try {
      const mockTracks: Track[] = Array.from({ length: 8 }, (_, i) => ({
        id: `chart-${i}`,
        title: `Chart Track ${i + 1}`,
        artist: `Artist ${i + 1}`,
        album: `Album ${i + 1}`,
        coverUrl: `https://source.unsplash.com/random/800x800?concert&sig=${i}`,
        previewUrl: 'https://example.com/preview.mp3',
        source: Math.random() > 0.5 ? 'spotify' : 'apple',
        popularity: Math.floor(Math.random() * 100),
        chartPosition: i + 1
      }));

      return this.serializeData(mockTracks);
    } catch (error) {
      console.error('Error fetching chart toppers:', error);
      return [];
    }
  }

  async searchTracks(query: string): Promise<Track[]> {
    try {
      const mockTracks: Track[] = Array.from({ length: 5 }, (_, i) => ({
        id: `search-${i}`,
        title: `${query} Result ${i + 1}`,
        artist: `Artist ${i + 1}`,
        album: `Album ${i + 1}`,
        coverUrl: `https://source.unsplash.com/random/800x800?music&sig=${i}`,
        previewUrl: 'https://example.com/preview.mp3',
        source: Math.random() > 0.5 ? 'spotify' : 'apple',
        popularity: Math.floor(Math.random() * 100)
      }));

      return this.serializeData(mockTracks);
    } catch (error) {
      console.error('Error searching tracks:', error);
      return [];
    }
  }
}

export const musicService = new MusicService();