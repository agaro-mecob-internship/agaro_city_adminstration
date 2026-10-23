import React, { useState, useEffect } from 'react';
import { Language } from '../../../types';
import { Calendar, Clock, User, ChevronRight, Image as ImageIcon, FileText } from 'lucide-react';

interface NewsViewProps {
  currentLang: Language;
}

// API Base URL - change to match your PHP backend location
const API_BASE_URL = 'http://localhost/agaro/php_export';

export default function NewsView({ currentLang }: NewsViewProps) {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dict = {
    title: {
      en: 'Latest News',
      om: 'Oduu Haaraa',
      am: 'የቅርብ ጊዜ ዜና'
    },
    subtitle: {
      en: 'Stay updated with the latest news and announcements from Agaro City',
      om: 'Oduu fi labsiiwwan haaraa magaalaa Aggaaroo wajjin haala haaraa eegu',
      am: 'ከአጋሮ ከተማ የቅርብ ጊዜ ዜናዎችን እና ማስታወቂያዎችን ይከታተሉ'
    },
    readMore: {
      en: 'Read More',
      om: 'Dabalataan Dubbisuu',
      am: 'ተጨማሪ አንብብ'
    },
    noNews: {
      en: 'No news articles found',
      om: 'Oduun hin argamne',
      am: 'ምንም ዜና አልተገኘም'
    },
    loadingText: {
      en: 'Loading news...',
      om: 'Oduu fe\'achaa...',
      am: 'ዜና በመጫን ላይ...'
    },
    errorText: {
      en: 'Error loading news',
      om: 'Dogoggora oduu fe\'isuun',
      am: 'ዜና በማስገባት ላይ ስህተት'
    },
    category: {
      en: 'Category',
      om: 'Ramaddii',
      am: 'ምድብ'
    },
    published: {
      en: 'Published',
      om: 'Baafame',
      am: 'ታተመ'
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api_news.php?action=all`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('News API Response:', result); // Debug log
      
      if (result.success) {
        setNews(result.data);
      } else {
        setError(result.error || 'Failed to load news');
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  // Get category badge color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Infrastructure': 'bg-blue-100 text-blue-800',
      'Health': 'bg-green-100 text-green-800',
      'Education': 'bg-purple-100 text-purple-800',
      'Agriculture': 'bg-yellow-100 text-yellow-800',
      'Municipal': 'bg-indigo-100 text-indigo-800',
      'Community': 'bg-pink-100 text-pink-800',
      'Economy': 'bg-emerald-100 text-emerald-800',
      'Environment': 'bg-teal-100 text-teal-800',
      'General': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
          <p className="text-gray-600">{dict.loadingText[currentLang]}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <p className="text-red-600 font-medium">{dict.errorText[currentLang]}</p>
          <p className="text-sm text-red-500 mt-2">{error}</p>
          <button
            onClick={fetchNews}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">{dict.noNews[currentLang]}</p>
          <p className="text-sm text-gray-400 mt-1">Check back later for updates</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{dict.title[currentLang]}</h1>
        <p className="text-gray-600 mt-2">{dict.subtitle[currentLang]}</p>
        <div className="h-1 w-20 bg-emerald-600 rounded-full mt-4"></div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => {
          // Get the title in the current language or fallback to English
          const title = item.title?.[currentLang] || item.title?.en || 'Untitled';
          const excerpt = item.excerpt?.[currentLang] || item.excerpt?.en || 'No description available';
          const imageUrl = item.image ? `${API_BASE_URL}/${item.image}` : null;
          
          return (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Image */}
              {imageUrl ? (
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      // Show placeholder if image fails to load
                      const parent = (e.target as HTMLImageElement).parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="h-48 w-full bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
                            <svg class="h-12 w-12 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="h-48 w-full bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-emerald-300" />
                </div>
              )}

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                {/* Category and Date */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                    {item.category || 'General'}
                  </span>
                  {item.date && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(item.date)}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 flex-1">
                  {title}
                </h2>

                {/* Excerpt */}
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                  {excerpt}
                </p>

                {/* Read More Link */}
                <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1 transition-colors mt-auto">
                  {dict.readMore[currentLang]} <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}