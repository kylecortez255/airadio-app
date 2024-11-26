import SpotifyWebApi from 'spotify-web-api-node';
import { faker } from '@faker-js/faker';

const spotifyApi = new SpotifyWebApi({
  clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
  clientSecret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
});

export interface SpotifyTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  previewUrl: string | null;
  popularity: number;
  chartPosition?: number;
  releaseDate: string;
  explicit: boolean;
  duration: number;
  artistId: string;
  albumId: string;
}

class SpotifyService {
  private token: string | null = null;
  private tokenExpiresAt: number = 0;

  private async ensureToken() {
    const now = Date.now();
    if (!this.token || now >= this.tokenExpiresAt) {
      try {
        if (!import.meta.env.VITE_SPOTIFY_CLIENT_ID || !import.meta.env.VITE_SPOTIFY_CLIENT_SECRET) {
          throw new Error('Spotify credentials not configured');
        }
        const data = await spotifyApi.clientCredentialsGrant();
        this.token = data.body.access_token;
        this.tokenExpiresAt = now + (data.body.expires_in * 1000) - 60000; // Expire 1 minute early
        spotifyApi.setAccessToken(this.token);
      } catch (error) {
        console.warn('Using mock data due to Spotify authentication error');
        return false;
      }
    }
    return true;
  }

  private generateMockTrack(index?: number): SpotifyTrack {
    const id = faker.string.uuid();
    return {
      id,
      title: faker.music.songName(),
      artist: faker.person.fullName(),
      album: faker.lorem.words(3),
      coverUrl: `https://source.unsplash.com/random/800x800?music&sig=${id}`,
      previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      popularity: faker.number.int({ min: 60, max: 100 }),
      chartPosition: index !== undefined ? index + 1 : undefined,
      releaseDate: faker.date.recent().toISOString(),
      explicit: faker.datatype.boolean(),
      duration: faker.number.int({ min: 180, max: 300 }),
      artistId: faker.string.uuid(),
      albumId: faker.string.uuid()
    };
  }

  private generateMockTracks(count: number, withPosition = false): SpotifyTrack[] {
    return Array.from({ length: count }, (_, i) => 
      this.generateMockTrack(withPosition ? i : undefined)
    );
  }

  private transformTrack(track: SpotifyApi.TrackObjectFull, position?: number): SpotifyTrack {
    return {
      id: track.id,
      title: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      coverUrl: track.album.images[0]?.url || `https://source.unsplash.com/random/800x800?music&sig=${track.id}`,
      previewUrl: track.preview_url,
      popularity: track.popularity,
      chartPosition: position,
      releaseDate: track.album.release_date,
      explicit: track.explicit,
      duration: Math.floor(track.duration_ms / 1000),
      artistId: track.artists[0].id,
      albumId: track.album.id
    };
  }

  async getTopTracks(): Promise<SpotifyTrack[]> {
    const hasToken = await this.ensureToken();
    if (!hasToken) {
      return this.generateMockTracks(8, true);
    }

    try {
      const response = await spotifyApi.getPlaylist('37i9dQZEVXbMDoHDwVN2tF');
      const tracks = response.body.tracks.items
        .map((item, index) => this.transformTrack(item.track as SpotifyApi.TrackObjectFull, index + 1))
        .filter(track => track.previewUrl !== null);
      
      return tracks.length > 0 ? tracks : this.generateMockTracks(8, true);
    } catch (error) {
      console.warn('Falling back to mock data for top tracks');
      return this.generateMockTracks(8, true);
    }
  }

  async getNewReleases(): Promise<SpotifyTrack[]> {
    const hasToken = await this.ensureToken();
    if (!hasToken) {
      return this.generateMockTracks(8);
    }

    try {
      const response = await spotifyApi.getNewReleases({ limit: 20, country: 'US' });
      const tracks = await Promise.all(
        response.body.albums.items.slice(0, 8).map(async (album) => {
          const trackResponse = await spotifyApi.getAlbumTracks(album.id);
          const track = trackResponse.body.items[0];
          return this.transformTrack({
            ...track,
            album: album,
            popularity: 80,
            preview_url: track.preview_url,
          } as SpotifyApi.TrackObjectFull);
        })
      );
      
      return tracks.filter(track => track.previewUrl !== null);
    } catch (error) {
      console.warn('Falling back to mock data for new releases');
      return this.generateMockTracks(8);
    }
  }

  async getRecommendations(): Promise<SpotifyTrack[]> {
    const hasToken = await this.ensureToken();
    if (!hasToken) {
      return this.generateMockTracks(8);
    }

    try {
      const response = await spotifyApi.getRecommendations({
        min_popularity: 70,
        seed_genres: ['pop', 'rock', 'hip-hop'],
        limit: 8
      });
      const tracks = response.body.tracks
        .map(track => this.transformTrack(track))
        .filter(track => track.previewUrl !== null);
      
      return tracks.length > 0 ? tracks : this.generateMockTracks(8);
    } catch (error) {
      console.warn('Falling back to mock data for recommendations');
      return this.generateMockTracks(8);
    }
  }

  async searchTracks(query: string): Promise<SpotifyTrack[]> {
    const hasToken = await this.ensureToken();
    if (!hasToken) {
      return this.generateMockTracks(8);
    }

    try {
      const response = await spotifyApi.searchTracks(query, { limit: 8 });
      const tracks = response.body.tracks.items
        .map(track => this.transformTrack(track))
        .filter(track => track.previewUrl !== null);
      
      return tracks.length > 0 ? tracks : this.generateMockTracks(8);
    } catch (error) {
      console.warn('Falling back to mock data for search results');
      return this.generateMockTracks(8);
    }
  }
}

export const spotifyService = new SpotifyService();