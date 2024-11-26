import React, { useEffect } from 'react';
import { useNewsStore } from '../store/newsStore';
import { motion } from 'framer-motion';
import { Newspaper, ExternalLink, RefreshCcw } from 'lucide-react';

const categories = [
  'general',
  'business',
  'technology',
  'entertainment',
  'health',
  'science',
  'sports'
];

const fallbackImage = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&q=80';

export function NewsPage() {
  const { 
    articles, 
    featuredArticle,
    category,
    isLoading,
    error,
    setCategory,
    fetchNews
  } = useNewsStore();

  useEffect(() => {
    fetchNews();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => fetchNews()}
            className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Newspaper className="w-8 h-8" />
            Latest News
          </h1>
          <button
            onClick={() => fetchNews()}
            disabled={isLoading}
            className="flex items-center gap-2 bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              disabled={isLoading}
              className={`px-4 py-2 rounded-full capitalize whitespace-nowrap transition ${
                category === cat
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 hover:bg-gray-700'
              } disabled:opacity-50`}
            >
              {cat}
            </button>
          ))}
        </div>

        {featuredArticle && (
          <div className="mb-12">
            <a
              href={featuredArticle.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-gray-800 rounded-xl overflow-hidden hover:ring-2 hover:ring-blue-500 transition"
            >
              <div className="aspect-video relative">
                <img
                  src={featuredArticle.urlToImage || fallbackImage}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = fallbackImage;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 p-6">
                  <div className="flex items-center gap-2 text-sm text-blue-400 mb-2">
                    <span className="bg-blue-500/20 px-3 py-1 rounded-full">
                      {featuredArticle.source.name}
                    </span>
                    <span>{featuredArticle.publishedAt}</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-gray-300">{featuredArticle.description}</p>
                </div>
              </div>
            </a>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(1).map((article) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition"
            >
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="aspect-video">
                  <img
                    src={article.urlToImage || fallbackImage}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = fallbackImage;
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <span className="bg-blue-500/20 px-2 py-1 rounded-full text-blue-400">
                      {article.source.name}
                    </span>
                    <span>{article.publishedAt}</span>
                  </div>
                  <h3 className="font-semibold mb-2 line-clamp-2 hover:text-blue-400 transition">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-3">
                    {article.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-blue-400 text-sm">
                    <ExternalLink className="w-4 h-4" />
                    Read more
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </div>

        {isLoading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        )}
      </div>
    </div>
  );
}