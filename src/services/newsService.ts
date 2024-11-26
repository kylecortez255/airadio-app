import axios from 'axios';
import { format } from 'date-fns';
import { faker } from '@faker-js/faker';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
  category?: string;
}

class NewsService {
  private formatArticle(rawArticle: any, category?: string): NewsArticle {
    // Ensure all properties are serializable
    const article: NewsArticle = {
      id: String(rawArticle.id || Math.random().toString(36).substr(2, 9)),
      title: String(rawArticle.title || ''),
      description: String(rawArticle.description || ''),
      source: {
        id: rawArticle.source?.id ? String(rawArticle.source.id) : null,
        name: String(rawArticle.source?.name || 'Unknown')
      },
      author: rawArticle.author ? String(rawArticle.author) : null,
      url: String(rawArticle.url || ''),
      urlToImage: rawArticle.urlToImage ? String(rawArticle.urlToImage) : null,
      publishedAt: format(new Date(rawArticle.publishedAt || new Date()), 'MMM dd, yyyy HH:mm'),
      content: rawArticle.content ? String(rawArticle.content) : null,
      category: category ? String(category) : 'general'
    };

    return article;
  }

  async getTopHeadlines(category?: string): Promise<NewsArticle[]> {
    try {
      if (!API_KEY) {
        console.warn('News API key is not configured');
        return this.getMockNews();
      }

      const response = await axios.get(`${BASE_URL}/top-headlines`, {
        params: {
          apiKey: API_KEY,
          country: 'us',
          category,
          pageSize: 20
        }
      });

      // Ensure we have an array of articles
      const articles = Array.isArray(response.data.articles) ? response.data.articles : [];
      
      // Map and format each article
      return articles.map(article => this.formatArticle(article, category));
    } catch (error) {
      console.error('Error fetching news:', error);
      return this.getMockNews();
    }
  }

  async searchNews(query: string): Promise<NewsArticle[]> {
    try {
      if (!API_KEY) {
        console.warn('News API key is not configured');
        return this.getMockNews();
      }

      const response = await axios.get(`${BASE_URL}/everything`, {
        params: {
          apiKey: API_KEY,
          q: query,
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 20
        }
      });

      // Ensure we have an array of articles
      const articles = Array.isArray(response.data.articles) ? response.data.articles : [];
      
      // Map and format each article
      return articles.map(article => this.formatArticle(article));
    } catch (error) {
      console.error('Error searching news:', error);
      return this.getMockNews();
    }
  }

  private getMockNews(): NewsArticle[] {
    return Array.from({ length: 10 }, (_, i) => ({
      id: `mock-${i}`,
      title: String(`${faker.company.catchPhrase()} - ${faker.company.buzzPhrase()}`),
      description: String(faker.lorem.paragraph()),
      source: {
        id: null,
        name: String(faker.company.name())
      },
      author: String(faker.person.fullName()),
      url: 'https://example.com',
      urlToImage: `https://source.unsplash.com/random/800x600?news&sig=${i}`,
      publishedAt: format(faker.date.recent(), 'MMM dd, yyyy HH:mm'),
      content: String(faker.lorem.paragraphs(3)),
      category: 'general'
    }));
  }
}

export const newsService = new NewsService();