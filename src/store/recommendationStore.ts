import { create } from 'zustand';
import { useAuthStore } from './authStore';

export interface ContentItem {
  id: string;
  title: string;
  subtitle: string;
  type: 'music' | 'podcast' | 'news';
  imageUrl: string;
  duration: string;
  category: string[];
  similarity?: number;
}

interface RecommendationState {
  recommendations: ContentItem[];
  userPreferences: string[];
  setRecommendations: (items: ContentItem[]) => void;
  addPreference: (category: string) => void;
  removePreference: (category: string) => void;
  getPersonalizedContent: () => ContentItem[];
}

export const useRecommendationStore = create<RecommendationState>((set, get) => ({
  recommendations: [],
  userPreferences: ['tech', 'electronic'],
  setRecommendations: (items) => set({ recommendations: items }),
  addPreference: (category) =>
    set((state) => ({
      userPreferences: [...new Set([...state.userPreferences, category])],
    })),
  removePreference: (category) =>
    set((state) => ({
      userPreferences: state.userPreferences.filter((p) => p !== category),
    })),
  getPersonalizedContent: () => {
    const { recommendations, userPreferences } = get();
    const user = useAuthStore.getState().user;

    if (!user) return recommendations;

    return recommendations
      .map((item) => ({
        ...item,
        similarity: item.category.filter((c) => userPreferences.includes(c)).length,
      }))
      .sort((a, b) => (b.similarity || 0) - (a.similarity || 0));
  },
}));