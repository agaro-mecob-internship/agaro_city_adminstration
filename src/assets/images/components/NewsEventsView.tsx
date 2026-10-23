import React, { useState, useEffect } from 'react';
import { Language } from '../../../types';
import { Calendar, Clock, MapPin, ChevronRight, Image as ImageIcon, FileText, X, Newspaper } from 'lucide-react';

interface NewsEventsViewProps {
  currentLang: Language;
}

// API Base URL
const API_BASE_URL = 'http://localhost/agaro/php_export';

export default function NewsEventsView({ currentLang }: NewsEventsViewProps) {
  const [news, setNews] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'news' | 'event'>('news');

  const dict = {
    title: {
      en: 'News & Events',
      om: 'Oduu fi Taateewwan',
      am: 'ዜና እና ዝግጅቶች'
    },
    subtitle: {
      en: 'Stay updated with the latest news and upcoming events in Agaro City',
      om: 'Oduu fi taateewwan haaraa magaalaa Aggaaroo wajjin haala haaraa eegu',
      am: 'በአጋሮ ከተማ ውስጥ ያሉ የቅርብ ጊዜ ዜናዎችን እና መጪ ዝግጅቶችን ይከታተሉ'
    },
    newsTitle: {
      en: 'Latest News',
      om: 'Oduu Haaraa',
      am: 'የቅርብ ጊዜ ዜና'
    },
    eventsTitle: {
      en: 'Upcoming Events',
      om: 'Taateewwan Dhufu',
      am: 'መጪ ዝግጅቶች'
    },
    readMore: {
      en: 'Read More',
      om: 'Dabalataan Dubbisuu',
      am: 'ተጨማሪ አንብብ'
    },
    close: {
      en: 'Close',
      om: 'Cufi',
      am: 'ዝጋ'
    },
    noNews: {
      en: 'No news available',
      om: 'Oduun hin jiru',
      am: 'ምንም ዜና የለም'
    },
    noEvents: {
      en: 'No upcoming events',
      om: 'Taateewwan hin jiran',
      am: 'ምንም መጪ ዝግጅቶች የሉም'
    },
    loadingText: {
      en: 'Loading...',
      om: 'Fe\'achaa...',
      am: 'በመጫን ላይ...'
    },
    errorText: {
      en: 'Error loading content',
      om: 'Dogoggora qabxii fe\'isuun',
      am: 'ይዘት በማስገባት ላይ ስህተት'
    },
    category: {
      en: 'Category',
      om: 'Ramaddii',
      am: 'ምድብ'
    },
    date: {
      en: 'Date',
      om: 'Guyyaa',
      am: 'ቀን'
    },
    time: {
      en: 'Time',
      om: 'Yeroo',
      am: 'ሰዓት'
    },
    location: {
      en: 'Location',
      om: 'Bakka',
      am: 'ቦታ'
    },
    details: {
      en: 'Details',
      om: 'Ibsa',
      am: 'ዝርዝር'
    },
    viewAllNews: {
      en: 'View All News',
      om: 'Oduu Hunda Argadhu',
      am: 'ሁሉንም ዜና ተመልከት'
    },
    viewAllEvents: {
      en: 'View All Events',
      om: 'Taateewwan Hunda Argadhu',
      am: 'ሁሉንም ዝግጅቶች ተመልከት'
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch News
      const newsResponse = await fetch(`${API_BASE_URL}/api_news.php?action=all`);
      const newsResult = await newsResponse.json();
      
      // Fetch Events
      const eventsResponse = await fetch(`${API_BASE_URL}/api_events.php?action=all`);
      const eventsResult = await eventsResponse.json();
      
      if (newsResult.success) {
        setNews(newsResult.data.slice(0, 4)); // Get only 4 latest news
      }
      
      if (eventsResult.success) {
        setEvents(eventsResult.data.slice(0, 4)); // Get only 4 upcoming events
      }
      
      if (!newsResult.success || !eventsResult.success) {
        setError('Failed to load some content');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

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
      'Festival': 'bg-purple-100 text-purple-800',
      'Meeting': 'bg-blue-100 text-blue-800',
      'Workshop': 'bg-yellow-100 text-yellow-800',
      'Conference': 'bg-indigo-100 text-indigo-800',
      'Sports': 'bg-green-100 text-green-800',
      'Cultural': 'bg-red-100 text-red-800',
      'Religious': 'bg-amber-100 text-amber-800',
      'General': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

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

  const openDetails = (item: any, type: 'news' | 'event') => {
    setSelectedItem(item);
    setModalType(type);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeDetails = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    document.body.style.overflow = 'auto';
  };

  const renderNewsCard = (item: any) => {
    const title = item.title?.[currentLang] || item.title?.en || 'Untitled';
    const excerpt = item.excerpt?.[currentLang] || item.excerpt?.en || 'No description available';
    const imageUrl = item.image ? `${API_BASE_URL}/${item.image}` : null;

    return (
      <div
        key={item.id}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col cursor-pointer"
        onClick={() => openDetails(item, 'news')}
      >
        {imageUrl ? (
          <div className="relative h-40 w-full overflow-hidden bg-gray-100">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div className="h-40 w-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
            <Newspaper className="h-10 w-10 text-blue-300" />
          </div>
        )}

        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
              {item.category || 'General'}
            </span>
            {item.date && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(item.date)}
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-gray-800 mb-1 line-clamp-2 flex-1">
            {title}
          </h3>

          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-2">
            {excerpt}
          </p>

          <button 
            className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1 transition-colors mt-auto"
            onClick={(e) => {
              e.stopPropagation();
              openDetails(item, 'news');
            }}
          >
            {dict.readMore[currentLang]} <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  };

  const renderEventCard = (item: any) => {
    const title = item.title?.[currentLang] || item.title?.en || 'Untitled';
    const excerpt = item.excerpt?.[currentLang] || item.excerpt?.en || 'No description available';
    const imageUrl = item.image ? `${API_BASE_URL}/${item.image}` : null;

    return (
      <div
        key={item.id}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col cursor-pointer"
        onClick={() => openDetails(item, 'event')}
      >
        {imageUrl ? (
          <div className="relative h-40 w-full overflow-hidden bg-gray-100">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div className="h-40 w-full bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
            <Calendar className="h-10 w-10 text-purple-300" />
          </div>
        )}

        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
              {item.category || 'General'}
            </span>
            {item.date && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(item.date)}
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-gray-800 mb-1 line-clamp-2 flex-1">
            {title}
          </h3>

          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-2">
            {excerpt}
          </p>

          {item.location?.[currentLang] && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
              <MapPin className="h-3 w-3" />
              <span>{item.location[currentLang]}</span>
            </div>
          )}

          {item.time && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>{item.time}</span>
            </div>
          )}

          <button 
            className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1 transition-colors mt-2"
            onClick={(e) => {
              e.stopPropagation();
              openDetails(item, 'event');
            }}
          >
            {dict.readMore[currentLang]} <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
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
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
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

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* News Column */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Newspaper className="h-6 w-6 text-emerald-600" />
              {dict.newsTitle[currentLang]}
            </h2>
            <button 
              onClick={() => window.location.href = '/news'}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              {dict.viewAllNews[currentLang]} →
            </button>
          </div>
          
          {news.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">{dict.noNews[currentLang]}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {news.map((item) => renderNewsCard(item))}
            </div>
          )}
        </div>

        {/* Events Column */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-purple-600" />
              {dict.eventsTitle[currentLang]}
            </h2>
            <button 
              onClick={() => window.location.href = '/events'}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              {dict.viewAllEvents[currentLang]} →
            </button>
          </div>
          
          {events.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">{dict.noEvents[currentLang]}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((item) => renderEventCard(item))}
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {isModalOpen && selectedItem && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={closeDetails}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900">
                {modalType === 'news' ? dict.newsTitle[currentLang] : dict.eventsTitle[currentLang]} - {dict.details[currentLang]}
              </h2>
              <button
                onClick={closeDetails}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Image */}
              {selectedItem.image && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
                  <img
                    src={`${API_BASE_URL}/${selectedItem.image}`}
                    alt={selectedItem.title?.[currentLang] || selectedItem.title?.en}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Category Badge */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedItem.category)}`}>
                  {selectedItem.category || 'General'}
                </span>
                {selectedItem.date && (
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(selectedItem.date)}
                  </span>
                )}
                {modalType === 'event' && selectedItem.time && (
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {selectedItem.time}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {selectedItem.title?.[currentLang] || selectedItem.title?.en}
              </h3>

              {/* Location (for events) */}
              {modalType === 'event' && selectedItem.location?.[currentLang] && (
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  <span>{selectedItem.location[currentLang]}</span>
                </div>
              )}

              {/* Description */}
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {selectedItem.excerpt?.[currentLang] || selectedItem.excerpt?.en || 'No description available'}
                </p>
                {selectedItem.content?.[currentLang] && (
                  <p className="text-gray-700 leading-relaxed mt-4">
                    {selectedItem.content[currentLang]}
                  </p>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={closeDetails}
                className="mt-6 w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                {dict.close[currentLang]}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}