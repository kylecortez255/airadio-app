import { create } from 'zustand';
import { faker } from '@faker-js/faker';

export interface Content {
  id: string;
  title: string;
  artist: string;
  type: 'music' | 'podcast' | 'news' | 'sports';
  duration: number;
  imageUrl: string;
  audioUrl: string;
  description: string;
  tags: string[];
  likes: number;
  plays: number;
  createdAt: Date;
}

interface ContentState {
  currentContent: Content | null;
  queue: Content[];
  history: Content[];
  isLoading: boolean;
  error: string | null;
  setCurrentContent: (content: Content) => void;
  addToQueue: (content: Content) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
  generateMockContent: () => Content;
}

export const useContentStore = create<ContentState>((set, get) => ({
  currentContent: null,
  queue: [],
  history: [],
  isLoading: false,
  error: null,

  setCurrentContent: (content) => {
    const { currentContent, history } = get();
    if (currentContent) {
      set({ history: [currentContent, ...history].slice(0, 50) });
    }
    set({ currentContent: content });
  },

  addToQueue: (content) => {
    set((state) => ({ queue: [...state.queue, content] }));
  },

  removeFromQueue: (id) => {
    set((state) => ({
      queue: state.queue.filter((item) => item.id !== id),
    }));
  },

  clearQueue: () => {
    set({ queue: [] });
  },

  generateMockContent: () => ({
    id: faker.string.uuid(),
    title: faker.music.songName(),
    artist: `${faker.person.firstName()} ${faker.person.lastName()}`,
    type: faker.helpers.arrayElement(['music', 'podcast', 'news', 'sports'] as const),
    duration: faker.number.int({ min: 60, max: 300 }),
    imageUrl: faker.image.urlLoremFlickr({ category: 'music' }),
    audioUrl: 'https://example.com/audio.mp3', // Replace with actual audio URL
    description: faker.lorem.paragraph(),
    tags: Array.from({ length: 3 }, () => faker.music.genre()),
    likes: faker.number.int({ min: 0, max: 10000 }),
    plays: faker.number.int({ min: 100, max: 1000000 }),
    createdAt: faker.date.past(),
  }),
}));