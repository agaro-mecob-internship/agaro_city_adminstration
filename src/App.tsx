import React, { useState } from 'react';
import { Language } from './types';
import HomeView from './components/HomeView';
import AboutView from './components/AboutView';
import ServicesView from './components/ServicesView';
import DepartmentsView from './components/DepartmentsView';
import NewsEventsView from './components/NewsEventsView';
import ProjectsView from './components/ProjectsView';
import ContactView from './components/ContactView';
import LoginView from './components/LoginView';
import AdminDashboard from './components/AdminDashboard';
import ChatbotWidget from './components/ChatbotWidget';
import { 
  Menu, 
  X, 
  Landmark, 
  MapPin, 
  Phone,
  Globe,
  Home,
  Info,
  Server,
  Building2,
  Newspaper,
  Calendar,
  ClipboardList,
  Mail,
  LogIn,
  Shield,
  ChevronDown
} from 'lucide-react';

//import './components/ServicesView.css';

function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [subOption, setSubOption] = useState<string | null>(null);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  // Navigation items
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: Info },
    { id: 'services', label: 'Services', icon: Server },
    { id: 'departments', label: 'Government', icon: Building2 },
    { id: 'news', label: 'News & Events', icon: Newspaper },
    { id: 'projects', label: 'Projects', icon: ClipboardList },
    { id: 'contact', label: 'Contact', icon: Mail },
    //{ id: 'login', label: 'Admin Login', icon: LogIn },
  ];

  // Language options with flags
  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'om', label: 'Afaan Oromoo', flag: '🇪🇹' },
    { code: 'am', label: 'አማርኛ', flag: '🇪🇹' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const handleTabChange = (tabId: string, itemSubId?: string | null) => {
    setActiveTab(tabId);
    setSubOption(itemSubId || null);
    setIsMobileMenuOpen(false);
  };

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    setIsLanguageDropdownOpen(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setActiveTab('admin');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('home');
  };

  // Get current language label and flag
  const currentLanguage = languages.find(lang => lang.code === currentLang);

  const getPageTitle = () => {
    const titles: Record<string, Record<Language, string>> = {
      home: { en: 'Home', om: 'Mana', am: 'መነሻ' },
      about: { en: 'About', om: 'Waa\'ee', am: 'ስለ' },
      services: { en: 'Services', om: 'Tajaajila', am: 'አገልግሎቶች' },
      departments: { en: 'Government', om: 'Mootummaa', am: 'መንግስት' },
      news: { en: 'News & Events', om: 'Oduu fi Taateewwan', am: 'ዜና እና ዝግጅቶች' },
      projects: { en: 'Projects', om: 'Pirojektoota', am: 'ፕሮጀክቶች' },
      contact: { en: 'Contact', om: 'Quunnamtii', am: 'እውቂያ' },
      login: { en: 'Login', om: 'Galmaa\'i', am: 'ግባ' },
      admin: { en: 'Admin', om: 'Bulchiinsa', am: 'አስተዳዳሪ' },
    };
    return titles[activeTab]?.[currentLang] || 'Agaro City';
  };

  const renderView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView currentLang={currentLang} onNavigateToTab={handleTabChange} />;
      case 'about':
        return <AboutView currentLang={currentLang} />;
      case 'services':
        return <ServicesView currentLang={currentLang} />;
      case 'departments':
        return <DepartmentsView currentLang={currentLang} />;
      case 'news':
        return <NewsEventsView currentLang={currentLang}  />;
      case 'projects':
        return <ProjectsView currentLang={currentLang} />;
      case 'contact':
        return <ContactView currentLang={currentLang} />;
      case 'login':
        return <LoginView currentLang={currentLang} onLogin={handleLogin} />;
      case 'admin':
        if (isAuthenticated) {
          return <AdminDashboard currentLang={currentLang} onLogout={handleLogout} />;
        } else {
          return <LoginView currentLang={currentLang} onLogin={handleLogin} />;
        }
      default:
        return <HomeView currentLang={currentLang} onNavigateToTab={handleTabChange} />;
    }
  };

  return (
    <div className="app-container min-h-screen bg-gray-50">
      {/* Top Header Bar - only show on non-admin pages */}
      {activeTab !== 'login' && activeTab !== 'admin' && (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo and Brand */}
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleTabChange('home')}>
                <img 
                  src="/src/assets/images/agaro.jpg" 
                  alt="Agaro City Logo" 
                  className="h-10 w-10 rounded-full object-cover border-2 border-emerald-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      const fallback = document.createElement('div');
                      fallback.className = 'h-10 w-10 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold text-lg';
                      fallback.textContent = 'A';
                      parent.prepend(fallback);
                    }
                  }}
                />
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-800 leading-tight">
                    Agaro City
                  </span>
                  <span className="text-xs text-gray-500 leading-tight">
                    Administration
                  </span>
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isLogin = item.id === 'login';
                  const isNews = item.id === 'news';
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
                        ${activeTab === item.id 
                          ? 'bg-emerald-700 text-white shadow-md' 
                          : isLogin
                          ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }
                        ${isNews ? 'text-xs' : ''}`}
                    >
                      <Icon className={`${isNews ? 'h-3 w-3' : 'h-4 w-4'}`} />
                      <span className={isNews ? 'text-xs' : ''}>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Right side - Language Dropdown with only Globe Icon and Login */}
              <div className="flex items-center gap-4">
                {/* Language Dropdown - Icon only with rounded full */}
                <div className="relative">
                  <button
                    onClick={toggleLanguageDropdown}
                    className="w-9 h-9 rounded-full hover:bg-gray-100 transition-colors border border-gray-200 flex items-center justify-center"
                    aria-label="Select Language"
                  >
                    <Globe className="h-5 w-5 text-gray-600" />
                  </button>

                  {/* Dropdown Menu */}
                  {isLanguageDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code as Language)}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center gap-3
                            ${currentLang === lang.code ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-700'}`}
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <span>{lang.label}</span>
                          {currentLang === lang.code && (
                            <span className="ml-auto text-emerald-600">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Login Button - Small box */}
                <button
                  onClick={() => handleTabChange('login')}
                  className="px-3 py-1.5 bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-100 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="h-3 w-3.5" />
                  Login
                </button>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={toggleMobileMenu}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6 text-gray-600" />
                  ) : (
                    <Menu className="h-6 w-6 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-gray-100">
                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isLogin = item.id === 'login';
                    const isNews = item.id === 'news';
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3
                          ${activeTab === item.id 
                            ? 'bg-emerald-700 text-white' 
                            : isLogin
                            ? 'bg-amber-50 text-amber-700'
                            : 'text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        <Icon className={isNews ? 'h-4 w-4' : 'h-5 w-5'} />
                        <span className={isNews ? 'text-xs' : ''}>{item.label}</span>
                      </button>
                    );
                  })}
                  
                  {/* Mobile Language Options */}
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <p className="text-xs text-gray-400 px-4 py-1">Language</p>
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code as Language)}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center gap-3
                          ${currentLang === lang.code ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-700'}`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </nav>
              </div>
            )}
          </div>
        </header>
      )}

      {/* Page Title Bar - only show on non-admin pages */}
      {activeTab !== 'login' && activeTab !== 'admin' && activeTab !== 'home' && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <h1 className="text-xl font-semibold text-gray-800">
              {getPageTitle()}
            </h1>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={activeTab === 'login' || activeTab === 'admin' ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}>
        {renderView()}
      </main>

      {/* Chatbot Widget - only show on non-admin pages */}
      {activeTab !== 'login' && activeTab !== 'admin' && (
        <ChatbotWidget currentLang={currentLang} />
      )}

      {/* Footer - only show on non-admin pages */}
      {activeTab !== 'login' && activeTab !== 'admin' && (
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <img 
                    src="/src/assets/images/agaro.jpg" 
                    alt="Agaro City Logo" 
                    className="h-8 w-8 rounded-full object-cover border border-emerald-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <span className="text-lg font-bold text-gray-800">Agaro City</span>
                </div>
                <p className="text-sm text-gray-500">
                  Decentralized Service, Strategic Value Chains, and Citizen Welfare
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Quick Links</h3>
                <ul className="space-y-2">
                  {navItems.slice(0, 7).map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => handleTabChange(item.id)}
                        className="text-sm text-gray-500 hover:text-emerald-700 transition-colors"
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Contact</h3>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Agaro Town, Oromia, Ethiopia
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    +251 123 456 789
                  </li>
                  <li className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    www.agarocity.gov.et
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Language</h3>
                <div className="flex flex-col gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code as Language)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-left flex items-center gap-3
                        ${currentLang === lang.code 
                          ? 'bg-emerald-700 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
              <p>&copy; {new Date().getFullYear()} Agaro City Administration. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;