import React, { useState, useEffect } from 'react';
import { DICTIONARY } from '../data';
import { getStoredMayor } from '../dataStore';
import { Language } from '../types';
import ContactView from './ContactView';
import ProjectsView from './ProjectsView';
import {
  Building,
  MapPin,
  Coffee,
  ArrowUpRight,
  Calendar,
  UserCheck,
  Sparkles,
  FileText,
  Landmark,
  Search,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Users,
  User,
  Award,
  BookOpen,
  Hospital,
  Route,
  Sprout,
  GraduationCap,
  Heart,
  Leaf,
  TrendingUp,
  Shield,
  Lightbulb,
  BarChart3,
  Image as ImageIcon,
  Newspaper
} from 'lucide-react';

interface HomeViewProps {
  currentLang: Language;
  onNavigateToTab: (tabId: string, itemSubId?: string | null) => void;
}

// API Base URL
const API_BASE_URL = 'http://localhost/agaro/php_export';

export default function HomeView({ currentLang, onNavigateToTab }: HomeViewProps) {
  const [localSearch, setLocalSearch] = useState('');
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [mayorInfo, setMayorInfo] = useState<any>(null);
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [mediaAssets, setMediaAssets] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const stats = [
    {
      icon: Users,
      value: "1,500,000+",
      title: "Population Served",
      color: "text-blue-100",
    },
    
    {
      icon: GraduationCap,
      value: "30+",
      title: "Educational Institutions",
      color: "text-violet-400",
    },
    {
      icon: Heart,
      value: "15",
      title: "Healthcare Facilities",
      color: "text-red-400",
    },
    {
      icon: Route,
      value: "800 km",
      title: "Roads Built",
      color: "text-orange-400",
    },
    {
      icon: Leaf,
      value: "85%",
      title: "Agricultural Projects",
      color: "text-emerald-400",
    },
  ];

  const achievements = [
    {
      title: "National Excellence Award",
      year: "2023",
      icon: Award,
      text: "Recognized for outstanding public service innovation.",
    },
    {
      title: "Economic Growth Leader",
      year: "2022",
      icon: TrendingUp,
      text: "Highest regional GDP growth for three consecutive years.",
    },
    {
      title: "Good Governance Certification",
      year: "2023",
      icon: Shield,
      text: "Awarded for transparency and accountability.",
    },
    {
      title: "Digital Transformation Pioneer",
      year: "2022",
      icon: Lightbulb,
      text: "First fully digitalized administration services.",
    },
  ];

  useEffect(() => {
    setMayorInfo(getStoredMayor());
  }, []);

  useEffect(() => {
    const fetchMediaAssets = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api_media.php`);
        const result = await response.json();
        if (result.success) {
          const assets = result.data.reduce((map: Record<string, string>, asset: any) => {
            map[asset.asset_key] = getImageUrl(asset.image) || '';
            return map;
          }, {});
          setMediaAssets(assets);
          const mayorProfile = result.government?.find((profile: any) => profile.asset_key === 'mayor');
          if (mayorProfile) {
            setMayorInfo({
              ...getStoredMayor(),
              ...mayorProfile,
              image: mayorProfile.image ? getImageUrl(mayorProfile.image) : assets.mayor || getStoredMayor().image
            });
          }
        }
      } catch (error) {
        console.error('Error fetching media assets:', error);
      }
    };

    fetchMediaAssets();
  }, []);

  // Helper function to get image URL
  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    if (imagePath.startsWith('uploads/')) {
      return `${API_BASE_URL}/${imagePath}`;
    }
    return `${API_BASE_URL}/${imagePath}`;
  };

  // Fetch news and events from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch latest 2 news articles
        const newsResponse = await fetch(`${API_BASE_URL}/api_news.php?action=latest&limit=2`);
        const newsResult = await newsResponse.json();
        
        if (newsResult.success) {
          const transformedNews = newsResult.data.map((article: any) => ({
            ...article,
            image: getImageUrl(article.image),
            title: {
              en: article.title?.en || article.title_en || '',
              om: article.title?.om || article.title_om || '',
              am: article.title?.am || article.title_am || ''
            },
            excerpt: {
              en: article.excerpt?.en || article.excerpt_en || '',
              om: article.excerpt?.om || article.excerpt_om || '',
              am: article.excerpt?.am || article.excerpt_am || ''
            },
            content: {
              en: article.content?.en || article.content_en || '',
              om: article.content?.om || article.content_om || '',
              am: article.content?.am || article.content_am || ''
            }
          }));
          setLatestNews(transformedNews);
        }

        // Fetch upcoming events
        const eventsResponse = await fetch(`${API_BASE_URL}/api_events.php?action=upcoming&limit=3`);
        const eventsResult = await eventsResponse.json();
        
        if (eventsResult.success) {
          const transformedEvents = eventsResult.data.map((event: any) => ({
            ...event,
            id: event.id,
            image: getImageUrl(event.image),
            date: event.date || event.event_date || 'Date TBA',
            time: event.time || event.event_time || 'Time TBA',
            title: {
              en: event.title?.en || event.title_en || '',
              om: event.title?.om || event.title_om || '',
              am: event.title?.am || event.title_am || ''
            },
            desc: {
              en: event.excerpt?.en || event.desc_en || event.excerpt_en || '',
              om: event.excerpt?.om || event.desc_om || event.excerpt_om || '',
              am: event.excerpt?.am || event.desc_am || event.excerpt_am || ''
            },
            loc: {
              en: event.location?.en || event.loc_en || event.location_en || '',
              om: event.location?.om || event.loc_om || event.location_om || '',
              am: event.location?.am || event.loc_am || event.location_am || ''
            },
            category: event.category || 'General'
          }));
          setUpcomingEvents(transformedEvents);
        }
      } catch (error) {
        console.error('Error fetching news and events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const galleryImages = [
    {
      id: 1,
      src: mediaAssets['gallery-1'] || './src/assets/images/AGARO18.jpg',
      alt: { en: 'Agaro City Hall', om: 'Galma Kellaa Aggaaroo', am: 'አጋሮ ከተማ አስተዳደር' },
      caption: { en: 'City Hall Main Building', om: 'Galma Kellaa Magaalaa', am: 'ዋና የከተማው አስተዳደር ህንፃ' }
    },
    {
      id: 2,
      src: mediaAssets['gallery-2'] || './src/assets/images/AGARO11.jpg',
      alt: { en: 'Agaro Central Market', om: 'Gabaayya Giddu Galeessa', am: 'አጋሮ ማዕከላዊ ገበያ' },
      caption: { en: 'Bustling Central Market', om: 'Gabaayya Giddu Galeessa', am: 'የተጨናነቀ ማዕከላዊ ገበያ' }
    },
    {
      id: 3,
      src: mediaAssets['gallery-3'] || './src/assets/images/AGARO12.jpg',
      alt: { en: 'Coffee Processing Center', om: 'Qaboo Buna', am: 'ቡና ማቀነባበሪያ ማእከል' },
      caption: { en: 'Modern Coffee Processing Facility', om: 'Qaboo Buna Faayidaa', am: 'ዘመናዊ የቡና ማቀነባበሪያ ፋብሪካ' }
    },
    {
      id: 4,
      src: mediaAssets['gallery-4'] || './src/assets/images/AGARO15.jpg',
      alt: { en: 'Road Construction Project', om: 'Waanummii Daandii', am: 'የመንገድ ግንባታ ፕሮጀክት' },
      caption: { en: 'Asphalt Road Development', om: 'Daandii Asphaltii', am: 'አስፋልት መንገድ ግንባታ' }
    },
    {
      id: 5,
      src: mediaAssets['gallery-5'] || './src/assets/images/AGARO10.jpg',
      alt: { en: 'Sports Stadium', om: 'Istaadiyeemii', am: 'ስታዲየም' },
      caption: { en: 'Municipal Sports Complex', om: 'Istaadiyeemii Magaalaa', am: 'የስፖርት ስታዲየም' }
    },
    {
      id: 6,
      src: mediaAssets['gallery-6'] || './src/assets/images/AGARO14.jpg',
      alt: { en: 'Agaro Cityscape', om: 'Magaala Agaaro', am: 'የአጋሮ ከተማ እይታ' },
      caption: { en: 'Scenic City View', om: 'Mulʼata Magaalaa', am: 'የከተማ እይታ' }
    }
  ];

  const servicesQuick = [
    { id: 'business-license', title: { en: 'Business License', om: 'Hayyama Daldalaa', am: 'የንግድ ክፍያ ፈቃድ' }, icon: 'Building' },
    { id: 'resident-certificate', title: { en: 'Resident Certificate', om: 'Ragaa Jireenyaa', am: 'የነዋሪነት የምስክር ወረቀት' }, icon: 'FileText' },
    { id: 'land-services', title: { en: 'Land Services', om: 'Tajaajila Lafaa', am: 'የመሬት ልማት አገልግሎት' }, icon: 'MapPin' },
    { id: 'pay-fees', title: { en: 'Pay Municipal Fees', om: 'Kaffaltii Tajaajilaa', am: 'ማዘጋጃ ቤት ክፍያዎችን ይክፈሉ' }, icon: 'Landmark' }
  ];

  const goToPrevious = () => {
    setGalleryIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setGalleryIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSearch = localSearch.toLowerCase().trim();
    if (!cleanSearch) return;

    if (cleanSearch.includes('license') || cleanSearch.includes('hayyama') || cleanSearch.includes('ፈቃድ') || cleanSearch.includes('business')) {
      onNavigateToTab('services', 'business-license');
    } else if (cleanSearch.includes('resident') || cleanSearch.includes('residency') || cleanSearch.includes('eenyummaa') || cleanSearch.includes('ነዋሪነት')) {
      onNavigateToTab('services', 'resident-certificate');
    } else if (cleanSearch.includes('land') || cleanSearch.includes('plot') || cleanSearch.includes('pilaanii') || cleanSearch.includes('መሬት')) {
      onNavigateToTab('services', 'land-services');
    } else if (cleanSearch.includes('complain') || cleanSearch.includes('trash') || cleanSearch.includes('leak') || cleanSearch.includes('ቆሻሻ') || cleanSearch.includes('አቤቱታ')) {
      onNavigateToTab('services', 'submit-complaint');
    } else if (cleanSearch.includes('pay') || cleanSearch.includes('fee') || cleanSearch.includes('tax') || cleanSearch.includes('ብር')) {
      onNavigateToTab('services', 'pay-fees');
    } else {
      onNavigateToTab('services', 'all');
    }
  };

  const getSrvIcon = (name: string) => {
    switch (name) {
      case 'Building':
        return <Building className="h-5 w-5" />;
      case 'FileText':
        return <FileText className="h-5 w-5" />;
      case 'MapPin':
        return <MapPin className="h-5 w-5" />;
      case 'Landmark':
        return <Landmark className="h-5 w-5" />;
      default:
        return <Sparkles className="h-5 w-5" />;
    }
  };

  return (
    <div id="home-view" className="space-y-14 font-sans">
      {/* Hero Banner */}
      <div
        className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-100 bg-slate-900 select-none"
        style={{ height: '460px' }}
      >
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/agaro18.jpg"
            alt="Agaro Highland Banner"
            className="w-full h-full object-cover opacity-35"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to- from-brand-green-950/95 via-brand-green-950/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to- from-brand-green-950/90 via-transparent to-transparent"></div>
        </div>

        <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-10 md:p-12 text-white">
          <div className="max-w-2xl space-y-4 pt-4 md:pt-8">
            <div className="inline-flex items-center gap-1.5 bg-brand-gold-500/20 border border-brand-gold-500/35 px-3 py-1 rounded-full text-brand-gold-500 text-xs font-semibold uppercase tracking-wider backdrop-blur-xs font-display">
              <Coffee className="h-3.5 w-3.5 shrink-0" />
              Ethiopia specialty coffee capital
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight leading-none text-shadow-md drop-shadow-md">
              {DICTIONARY.heroTitle[currentLang]}
            </h1>
            <p className="text-sm.5 sm:text-base text-slate-200 leading-relaxed text-shadow-sm font-sans font-normal opacity-95">
              {DICTIONARY.heroSubtitle[currentLang]}
            </p>
          </div>

          <div className="max-w-xl w-full">
            <form onSubmit={handleQuickSearchSubmit} className="flex gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/20 backdrop-blur-md w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-200" />
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder={DICTIONARY.quickSearchPlaceholder[currentLang]}
                  className="w-full pl-10 pr-4 py-3 text-xs.5 text-white placeholder-slate-300 bg-transparent border-0 focus:ring-0 focus:outline-none"
                />
              </div>
              <button
                id="btn-hero-search-submit"
                type="submit"
                className="bg-brand-gold-500 hover:bg-brand-gold-600 text-brand-coffee-900 font-bold px-5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0"
              >
                {DICTIONARY.searchBtn[currentLang]}
              </button>
            </form>
            <span className="block text-[11px] text-slate-300 mt-2 ml-1 font-medium italic">
              * {DICTIONARY.trackedNotice[currentLang]}
            </span>
          </div>
        </div>
      </div>

      {/* Mayor Section */}
      <div className="max-w-6xl mx-auto -mt-6 relative z-10 px-4 md:px-0">
        <div className="mx-auto bg-white rounded-3xl border border-slate-150 overflow-hidden shadow-sm grid md:grid-cols-12">
          <div className="md:col-span-4 bg-slate-50 border-r border-slate-150 p-8 flex flex-col items-center justify-center text-center space-y-5">
            <div className="h-36 w-36 rounded-full overflow-hidden border-[3.5px] border-brand-gold-500 flex items-center justify-center shadow-md bg-white animate-fade-in">
              <img
                src={mayorInfo?.image || './src/assets/images/NAZIF.jpg'}
                alt={mayorInfo?.name || 'City Administrator'}
                className="h-full w-full object-cover object-top hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {currentLang === 'en' ? 'Honorary Mayor' : currentLang === 'om' ? 'Kantiibaa Kabajaa Magaalaa' : 'የክብር ከንቲባ'}
              </span>
                <h2 className="font-display text-xl font-bold text-slate-800 mt-1">{mayorInfo?.name || 'Mr. Nezif'}</h2>
                <p className="text-xs text-brand-green-750 font-semibold font-mono mt-0.5">{mayorInfo?.email || 'mayor@agarocity.gov.et'}</p>
            </div>
            <div className="pt-4 border-t border-slate-200 w-full text-xs text-slate-500 space-y-1.5 font-mono">
              <p>📍 {mayorInfo?.location || 'Admin Block, 1st Floor'}</p>
              <p>⏱️ Term: {mayorInfo?.term?.[currentLang] || (currentLang === 'en' ? '2022 - present' : '2022 - Amma')}</p>
            </div>
          </div>

          <div className="md:col-span-8 p-8 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-brand-gold-700 uppercase bg-brand-gold-100/50 border border-brand-gold-200/50 px-2.5 py-1 rounded-md">Municipal Strategy</span>
              <h3 className="font-display text-2xl font-bold text-slate-800 tracking-tight">Executive Address & Mandate</h3>
              <p className="text-slate-650 text-sm leading-relaxed">
                {mayorInfo?.task || (currentLang === 'en'
                  ? "Under the Oromia Regional Government framework, the Mayor drives civic development, infrastructure expansion, and digital e-governance solutions to establish Agaro as southwestern Ethiopia's premier industrial coffee and commercial hub."
                  : currentLang === 'om'
                  ? "Bulchiinsa Mootummaa Naannoo Oromiyaa jalatti, Kantiibaan haaraa dhimma guddina magaalaa, misooma bu'uraalee, fi tajaajila dijiitaalaa saffisiisanii Agaro giddugala daldalaa bunaa ol'aanaa gochuuf hojjetu."
                  : 'በኦሮሚያ ክልላዊ መንግሥት መዋቅር ሥር፣ ከንቲባው የከተማ ዕድገትን፣ የመሠረተ ልማት ዝርጋታን እና የዲጂታል አስተዳደርን በማቀናጀት አጋሮን በደቡብ ምዕራብ ኢትዮጵያ ዋና የቡና እና የኢኮኖሚ ማዕከል ለማድረግ እየሰሩ ይገኛሉ።')}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-5 space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Award className="h-4 w-4 text-brand-gold-500 shrink-0" />
                Special Administrative Strategic Priorities
              </h4>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  'Expand high-yield coffee export value chains',
                  'Decentralize municipal support desks into 9 robust Kebeles',
                  'Achieve 100% electronic billing and rapid public works response'
                ].map((priority, pIdx) => (
                  <div key={pIdx} className="border border-slate-150 rounded-2xl p-4 space-y-1.5 bg-slate-50/50">
                    <span className="text-brand-green-700 text-lg font-bold">0{pIdx + 1}</span>
                    <h5 className="font-bold text-slate-800 text-xs">Priority 0{pIdx + 1}</h5>
                    <p className="text-[10.5px] text-slate-550 leading-relaxed">{priority}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="grid md:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        <div className="md:col-span-7 space-y-4">
          <h2 className="font-display text-2.5xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-brand-gold-500 shrink-0" />
            {DICTIONARY.welcomeTitle[currentLang]}
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm.5">
            {DICTIONARY.welcomeText[currentLang]}
          </p>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="border border-slate-200 p-4 rounded-xl bg-white shadow-xs flex gap-3">
              <MapPin className="h-5 w-5 text-brand-green-700 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-semibold text-slate-700 block">Agaro City, Oromia</span>
                <span className="text-slate-405">A growing urban center in the heart of Oromia</span>
              </div>
            </div>
            <div className="border border-slate-200 p-4 rounded-xl bg-white shadow-xs flex gap-3">
              <Coffee className="h-5 w-5 text-brand-green-700 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-semibold text-slate-700 block">Arabica Varieties</span>
                <span className="text-slate-450">Award winning organic washings</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <Users className="h-6 w-6 text-brand-green-700" />
              {currentLang === 'en' ? 'City Gallery' : currentLang === 'om' ? 'Galeerii Magaalaa' : 'የከተማ ጋለሪ'}
            </h2>
            <p className="text-slate-500 text-xs.5">
              {currentLang === 'en' ? 'Explore Agaro through our visual journey' : currentLang === 'om' ? 'Agaroo fakkiiwwan keessatti ilaali' : 'በአጋሮ ምስላዊ ጉዞ'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={goToPrevious}
              className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-brand-green-50 hover:border-brand-green-700 transition-colors cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5 text-slate-600" />
            </button>
            <button
              onClick={goToNext}
              className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-brand-green-50 hover:border-brand-green-700 transition-colors cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-slate-100 border border-slate-200 shadow-sm">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${galleryIndex * 100}%)` }}
          >
            {galleryImages.map((image) => (
              <div key={image.id} className="min-w-full flex-shrink-0">
                <div className="relative w-full" style={{ height: '400px' }}>
                  <img
                    src={image.src}
                    alt={image.alt[currentLang]}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect width="400" height="400" fill="%23e2e8f0"/%3E%3Ctext x="200" y="200" font-family="sans-serif" font-size="20" fill="%2394a3b8" text-anchor="middle" dy=".3em"%3ENo Image Available%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6">
                    <p className="text-white text-sm font-medium">{image.caption[currentLang]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {galleryImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setGalleryIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${idx === galleryIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stats and Excellence Section */}
      <div className="bg-gradient-to-b from-green-900 via-green-800 to-green-900 text-white relative rounded-3xl mt-12 overflow-hidden shadow-2xl">
        <div className="absolute w-72 h-72 rounded-full bg-green-600/20 blur-3xl top-20 left-20"></div>
        <div className="absolute w-96 h-96 rounded-full bg-yellow-500/10 blur-3xl bottom-10 right-20"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 py-12 sm:px-8 sm:py-14">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-green-700 px-4 py-2 rounded-full text-sm font-semibold">
              <BarChart3 size={14} />
              Progress & Achievements
            </div>
            <h1 className="text-3xl sm:text-4xl font-black mt-6 leading-tight">
              Agaro City{" "}
              <span className="text-yellow-400">By The Numbers</span>
            </h1>
            <p className="text-green-100 text-base max-w-2xl mx-auto mt-4 leading-7">
              Discover the impact of our initiatives and the progress we've made
              together in building a prosperous community.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-10">
            {stats.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white/10 border border-white/15 rounded-2xl p-5 sm:p-6 min-h-36 lg:min-h-40 flex flex-col items-center justify-center text-center backdrop-blur-md hover:-translate-y-1.5 hover:bg-white/15 duration-300 shadow-md"
                >
                  <Icon size={32} className={`${item.color} mx-auto mb-4`} />
                  <h2 className="text-2xl sm:text-3xl font-black leading-tight">{item.value}</h2>
                  <p className="text-green-100 mt-2 text-sm leading-5">{item.title}</p>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-10 lg:gap-14 mt-16">
            <div>
              <div className="inline-flex bg-green-700 rounded-full px-4 py-2 text-sm font-semibold">
                Recent Achievements
              </div>
              <h2 className="text-3xl sm:text-4xl font-black mt-4 leading-tight">
                Recognized{" "}
                <span className="text-yellow-400">Excellence</span>{" "}
                in Public Service
              </h2>
              <p className="text-green-100 mt-4 text-base leading-7">
                Our commitment to innovation, transparency and community
                development has been recognized through numerous awards
                and achievements at regional and national levels.
              </p>
              <div className="grid grid-cols-2 gap-3 mt-8">
                <div className="bg-white/10 rounded-2xl p-5 sm:p-6 border border-white/15">
                  <h3 className="text-yellow-400 text-3xl font-black">98%</h3>
                  <p className="text-green-100 mt-1.5 text-sm leading-5">Citizen Satisfaction</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-5 sm:p-6 border border-white/15">
                  <h3 className="text-yellow-400 text-3xl font-black">47%</h3>
                  <p className="text-green-100 mt-1.5 text-sm leading-5">Digital Service Adoption</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {achievements.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="relative bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 hover:bg-white/15 duration-300 min-h-[220px]"
                  >
                    <div className="flex items-start gap-4 pr-12">
                      <div className="flex flex-col gap-4 h-full">
                        <div className="bg-green-700 rounded-xl p-3 h-fit w-fit shrink-0">
                          <Icon className="text-yellow-400" size={22} />
                        </div>
                        <div>
                          <h3 className="text-base font-bold leading-6">{item.title}</h3>
                          <p className="text-green-100 mt-1.5 text-sm leading-6">{item.text}</p>
                        </div>
                      </div>
                      <div className="absolute top-5 right-5 bg-yellow-400 text-green-900 rounded-full px-3 py-1 font-bold text-sm shrink-0">
                        {item.year}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-800 tracking-tight">
              {DICTIONARY.govTitle[currentLang]}
            </h2>
            <p className="text-slate-500 text-xs.5">{DICTIONARY.govSubtitle[currentLang]}</p>
          </div>
          <button
            id="btn-all-services-link"
            onClick={() => onNavigateToTab('services', 'all')}
            className="text-xs font-bold text-brand-green-700 hover:text-brand-green-800 flex items-center shrink-0 cursor-pointer self-start sm:self-center"
          >
            Go to Services Portal →
          </button>
        </div>
      </div>

      {/* News and Events Side by Side Container */}
      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Latest Announcements Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <Calendar className="h-5 w-5 text-brand-green-700 shrink-0" />
                Latest Announcements
              </h2>
              <p className="text-slate-500 text-xs.5 mt-1">Stay informed with the latest news and updates from Agaro City</p>
            </div>
            <button
              id="btn-see-all-news"
              onClick={() => onNavigateToTab('news')}
              className="text-xs font-bold text-brand-green-700 hover:text-brand-green-800 cursor-pointer whitespace-nowrap"
            >
              See All News →
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {latestNews.length === 0 ? (
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-8 text-center">
                <Newspaper className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 font-medium">No news available</p>
                <p className="text-slate-400 text-sm mt-1">Check back later for updates</p>
              </div>
            ) : (
              latestNews.map((art) => (
                <div
                  key={art.id}
                  onClick={() => onNavigateToTab('news')}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-brand-green-700/40 transition-all cursor-pointer group"
                >
                  {/* Image Container */}
                  <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                    {art.image ? (
                      <img
                        src={art.image}
                        alt={art.title[currentLang]}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"%3E%3Crect width="600" height="400" fill="%23e2e8f0"/%3E%3Ctext x="300" y="200" font-family="sans-serif" font-size="18" fill="%2394a3b8" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200">
                        <ImageIcon className="h-12 w-12 text-slate-400" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-brand-gold-500 text-brand-coffee-900 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                      {art.category || 'News'}
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-5 space-y-3">
                    <div className="text-[11px] text-slate-400 font-mono">{art.date}</div>
                    <h3 className="font-display font-bold text-slate-800 text-base leading-snug line-clamp-2">
                      {art.title[currentLang]}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {art.excerpt[currentLang]}
                    </p>
                    <div className="flex items-center gap-2 text-brand-green-700 text-xs font-semibold pt-2 border-t border-slate-100">
                      <span>Read More</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <Calendar className="h-5 w-5 text-brand-green-700 shrink-0" />
              Upcoming Events
            </h2>
            <p className="text-slate-500 text-xs.5 mt-1">Mark your calendar for important community events and celebrations</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-5">
            {upcomingEvents.length === 0 ? (
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-8 text-center">
                <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 font-medium">No upcoming events</p>
                <p className="text-slate-400 text-sm mt-1">Check back later for community events</p>
              </div>
            ) : (
              upcomingEvents.map((evt, index) => {
                const title = evt.title?.[currentLang] || evt.title?.en || evt.title_en || 'Untitled Event';
                const desc = evt.desc?.[currentLang] || evt.desc?.en || evt.excerpt?.[currentLang] || evt.excerpt?.en || evt.excerpt_en || 'No description available';
                const location = evt.loc?.[currentLang] || evt.loc?.en || evt.location?.[currentLang] || evt.location?.en || evt.location_en || 'Location TBA';
                const eventDate = evt.date || evt.event_date || 'Date TBA';
                const eventTime = evt.time || evt.event_time || 'Time TBA';

                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-brand-green-700/40 transition-all group"
                  >
                    {/* Event Header with Color Indicator */}
                    <div className="h-2 bg-gradient-to-r from-brand-green-700 to-brand-gold-500"></div>

                    {/* Event Image */}
                    {evt.image && (
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={evt.image}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    <div className="p-5 space-y-4">
                      {/* Date & Time */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 text-sm font-bold text-brand-green-700">
                            <Calendar className="h-4 w-4 shrink-0" />
                            <span>{eventDate}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                            <span>⏱️</span>
                            <span>{eventTime}</span>
                          </div>
                        </div>
                        {evt.category && (
                          <span className="px-2.5 py-1 bg-brand-green-100 text-brand-green-800 rounded-full text-xs font-medium shrink-0">
                            {evt.category}
                          </span>
                        )}
                      </div>

                      {/* Event Title */}
                      <h3 className="font-display font-bold text-slate-800 text-base line-clamp-2">
                        {title}
                      </h3>

                      {/* Event Description */}
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {desc}
                      </p>

                      {/* Location */}
                      <div className="border-t border-slate-200 pt-3">
                        <div className="flex items-start gap-2 text-xs text-brand-green-700 font-semibold">
                          <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                          <span>{location}</span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button 
                        onClick={() => onNavigateToTab('news', 'events-section')}
                        className="w-full mt-3 py-2.5 bg-brand-green-700 hover:bg-brand-green-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Learn More
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <ProjectsView currentLang={currentLang} />

      {/* Contact Section */}
      <ContactView currentLang={currentLang} />
    </div>
  );
}