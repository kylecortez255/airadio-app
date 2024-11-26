import { create } from 'zustand';
import { newsService, type NewsArticle } from '../services/newsService';

interface NewsState {
  articles: NewsArticle[];
  featuredArticle: NewsArticle | null;
  category: string;
  isLoading: boolean;
  error: string | null;
  setCategory: (category: string) => void;
  fetchNews: () => Promise<void>;
  searchNews: (query: string) => Promise<void>;
}

export const useNewsStore = create<NewsState>((set, get) => ({
  articles: [],
  featuredArticle: null,
  category: 'general',
  isLoading: false,
  error: null,

  setCategory: (category) => {
    set({ category });
    get().fetchNews();
  },

  fetchNews: async () => {
    const { category } = get();
    set({ isLoading: true, error: null });
    
    try {
      const articles = await newsService.getTopHeadlines(category);
      set({ 
        articles,
        featuredArticle: articles.length > 0 ? articles[0] : null,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: 'Failed to fetch news',
        isLoading: false,
        articles: [],
        featuredArticle: null
      });
    }
  },

  searchNews: async (query) => {
    set({ isLoading: true, error: null });
    
    try {
      const articles = await newsService.searchNews(query);
      set({ 
        articles,
        featuredArticle: articles.length > 0 ? articles[0] : null,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: 'Failed to search news',
        isLoading: false,
        articles: [],
        featuredArticle: null
      });
    }
  }
}));