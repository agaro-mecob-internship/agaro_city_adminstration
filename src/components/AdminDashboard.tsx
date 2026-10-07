import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { 
  LogOut, Plus, Edit, Trash2, Newspaper, Calendar, ClipboardList,
  Check, AlertCircle, RefreshCw, Shield, X, Save, Eye, Image,
  Users, FileText, Settings, BarChart, Activity, Clock,
  TrendingUp, Folder, Layers, Home, BookOpen, Heart, Briefcase,
  Coffee, Building, Droplet, ShoppingBag, Wrench, Award, ChevronRight,
  LayoutDashboard, Server, UserCog, HelpCircle, Menu
} from 'lucide-react';

interface AdminDashboardProps {
  currentLang: Language;
  onLogout: () => void;
}

// API Base URL
const API_BASE_URL = 'http://localhost/agaro/php_export';

// Category options for all sections
const CATEGORIES = {
  news: [
    { value: 'General', label: 'General', icon: '📰' },
    { value: 'Infrastructure', label: 'Infrastructure', icon: '🏗️' },
    { value: 'Health', label: 'Health', icon: '🏥' },
    { value: 'Education', label: 'Education', icon: '📚' },
    { value: 'Agriculture', label: 'Agriculture', icon: '🌾' },
    { value: 'Municipal', label: 'Municipal', icon: '🏛️' },
    { value: 'Community', label: 'Community', icon: '👥' },
    { value: 'Economy', label: 'Economy', icon: '💰' },
    { value: 'Environment', label: 'Environment', icon: '🌿' },
  ],
  events: [
    { value: 'Community', label: 'Community Event', icon: '🎉' },
    { value: 'Festival', label: 'Festival', icon: '🎪' },
    { value: 'Meeting', label: 'Public Meeting', icon: '🤝' },
    { value: 'Workshop', label: 'Workshop', icon: '🛠️' },
    { value: 'Conference', label: 'Conference', icon: '🎤' },
    { value: 'Sports', label: 'Sports', icon: '⚽' },
    { value: 'Cultural', label: 'Cultural', icon: '🎭' },
    { value: 'Religious', label: 'Religious', icon: '⛪' },
    { value: 'Other', label: 'Other', icon: '📌' },
  ],
  projects: [
    { value: 'Infrastructure', label: 'Infrastructure', icon: '🏗️' },
    { value: 'Health', label: 'Health', icon: '🏥' },
    { value: 'Education', label: 'Education', icon: '📚' },
    { value: 'Water', label: 'Water Supply', icon: '💧' },
    { value: 'Market', label: 'Market', icon: '🛒' },
    { value: 'Housing', label: 'Housing', icon: '🏠' },
    { value: 'Transport', label: 'Transport', icon: '🚌' },
    { value: 'Energy', label: 'Energy', icon: '⚡' },
    { value: 'Agriculture', label: 'Agriculture', icon: '🌾' },
    { value: 'Technology', label: 'Technology', icon: '💻' },
  ]
};

export default function AdminDashboard({ currentLang, onLogout }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState<'news' | 'events' | 'projects'>('news');
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaTarget, setMediaTarget] = useState('gallery-1');
  const [governmentForm, setGovernmentForm] = useState({ name: '', task: '', location: '', email: '' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    title_en: '', title_om: '', title_am: '',
    excerpt_en: '', excerpt_om: '', excerpt_am: '',
    content_en: '', content_om: '', content_am: '',
    category: 'General',
    date: '',
    time: '',
    location_en: '', location_om: '', location_am: '',
    name_en: '', name_om: '', name_am: '',
    description_en: '', description_om: '', description_am: '',
    status: 'planning',
    progress: 0,
    budget: '',
    manager: '',
    kebele: '',
    image: ''
  });

  // Stats data
  const stats = [
    { label: 'Total Users', value: '2,543', icon: Users, color: 'blue', change: '+12%' },
    { label: 'Service Requests', value: '348', icon: Activity, color: 'green', change: '+8%' },
    { label: 'News & Updates', value: '56', icon: Newspaper, color: 'purple', change: '+5%' },
    { label: 'Ongoing Projects', value: '23', icon: ClipboardList, color: 'orange', change: '+3%' },
  ];

  // Sidebar menu items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'service-management', label: 'SERVICE MANAGEMENT', icon: Server, isHeader: true },
    { id: 'digital-services', label: 'Digital Services', icon: Folder },
    { id: 'service-requests', label: 'Service Requests', icon: Activity },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'user-management', label: 'USER MANAGEMENT', icon: UserCog, isHeader: true },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'roles-permissions', label: 'Roles & Permissions', icon: Shield },
    { id: 'content-header', label: 'CONTENT', icon: FileText, isHeader: true },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'projects', label: 'Projects', icon: ClipboardList },
    { id: 'pages', label: 'Pages', icon: FileText },
    { id: 'galleries', label: 'Galleries', icon: Image },
    { id: 'documents', label: 'Documents', icon: Folder },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Recent activities
  const recentActivities = [
    { title: 'New service request submitted', detail: 'Birth Certificate Request', time: '2 mins ago' },
    { title: 'New user registered', detail: 'temesgen21@gmail.com', time: '15 mins ago' },
    { title: 'News published', detail: 'Road Construction Update', time: '1 hour ago' },
    { title: 'Project updated', detail: 'Aqaro City Water Supply Project', time: '2 hours ago' },
    { title: 'Document uploaded', detail: 'City Budget 2024.pdf', time: '3 hours ago' },
  ];

  // Latest service requests
  const serviceRequests = [
    { id: 1, service: 'Business License', requester: 'Abebe Kebede', status: 'Pending', date: 'May 31, 2024' },
    { id: 2, service: 'Building Permit', requester: 'Selamawit Alemu', status: 'In Progress', date: 'May 31, 2024' },
    { id: 3, service: 'Birth Certificate', requester: 'Mekdes Tadesse', status: 'Completed', date: 'May 30, 2024' },
    { id: 4, service: 'Property Tax', requester: 'Yonas Girma', status: 'Pending', date: 'May 30, 2024' },
    { id: 5, service: 'Trade License', requester: 'Hana Mohammed', status: 'In Progress', date: 'May 30, 2024' },
  ];

  const dict = {
    title: {
      en: 'AqaroCity Admin',
      om: 'Bulchiinsa AqaroCity',
      am: 'አካሮሲቲ አስተዳዳሪ'
    },
    dashboard: {
      en: 'Dashboard',
      om: 'Daa\'imoo',
      am: 'ዳሽቦርድ'
    },
    welcome: {
      en: 'Welcome back, Admin!',
      om: 'Baga nagaan deebite, Admin!',
      am: 'እንኳን ደህና መጡ፣ አስተዳዳሪ!'
    },
    subtitle: {
      en: "Here's what's happening in AqaroCity.",
      om: 'Waan magaalaa AqaroCity keessa ta\'e kunoo.',
      am: 'በአካሮሲቲ ውስጥ እየተከሰተ ያለው ነገር ይህ ነው።'
    },
    news: {
      en: 'News',
      om: 'Oduu',
      am: 'ዜና'
    },
    events: {
      en: 'Events',
      om: 'Taateewwan',
      am: 'ዝግጅቶች'
    },
    projects: {
      en: 'Projects',
      om: 'Pirojektoota',
      am: 'ፕሮጀክቶች'
    },
    addNew: {
      en: 'Add New',
      om: 'Haaraa Iddahi',
      am: 'አዲስ አክል'
    },
    edit: {
      en: 'Edit',
      om: 'Jijjiiri',
      am: 'አርትዕ'
    },
    delete: {
      en: 'Delete',
      om: 'Balleessi',
      am: 'ሰርዝ'
    },
    save: {
      en: 'Save',
      om: 'Kusuu',
      am: 'አስቀምጥ'
    },
    cancel: {
      en: 'Cancel',
      om: 'Haqi',
      am: 'ሰርዝ'
    },
    logout: {
      en: 'Logout',
      om: 'Baasii',
      am: 'ውጣ'
    },
    loading: {
      en: 'Loading...',
      om: 'Fe\'achaa...',
      am: 'በመጫን ላይ...'
    },
    noItems: {
      en: 'No items found',
      om: 'Waan hin argamne',
      am: 'ምንም አልተገኘም'
    },
    titleLabel: {
      en: 'Title',
      om: 'Mataduree',
      am: 'ርዕስ'
    },
    categoryLabel: {
      en: 'Category',
      om: 'Ramaddii',
      am: 'ምድብ'
    },
    dateLabel: {
      en: 'Date',
      om: 'Guyyaa',
      am: 'ቀን'
    },
    actions: {
      en: 'Actions',
      om: 'Gochaawwan',
      am: 'ተግባራት'
    },
    status: {
      en: 'Status',
      om: 'Haala',
      am: 'ሁኔታ'
    },
    progress: {
      en: 'Progress',
      om: 'Guddina',
      am: 'እድገት'
    },
    budget: {
      en: 'Budget',
      om: 'Bajata',
      am: 'በጀት'
    },
    manager: {
      en: 'Manager',
      om: 'Bulchaa',
      am: 'አስተዳዳሪ'
    },
    kebele: {
      en: 'Kebele',
      om: 'Goxxaa',
      am: 'ቀበሌ'
    },
    location: {
      en: 'Location',
      om: 'Bakka',
      am: 'ቦታ'
    },
    time: {
      en: 'Time',
      om: 'Yeroo',
      am: 'ሰዓት'
    },
    excerpt: {
      en: 'Excerpt',
      om: 'Gabaaba',
      am: 'ማጠቃለያ'
    },
    // Changed from 'content' to 'contentLabel' to avoid duplicate key
    contentLabel: {
      en: 'Content',
      om: 'Qabxii',
      am: 'ይዘት'
    },
    description: {
      en: 'Description',
      om: 'Ibsa',
      am: 'መግለጫ'
    },
    image: {
      en: 'Image',
      om: 'Fakkii',
      am: 'ምስል'
    },
    quickActions: {
      en: 'Quick Actions',
      om: 'Gocha Dafaa',
      am: 'ፈጣን ተግባራት'
    },
    recentActivities: {
      en: 'Recent Activities',
      om: 'Gochaawwan Dhiyoo',
      am: 'የቅርብ ጊዜ ተግባራት'
    },
    latestRequests: {
      en: 'Latest Service Requests',
      om: 'Gaaffii Tajaajila Haaraa',
      am: 'የቅርብ ጊዜ የአገልግሎት ጥያቄዎች'
    },
    analytics: {
      en: 'Analytics Overview',
      om: 'Ibsa Xinxaalchaa',
      am: 'የትንታኔ አጠቃላይ እይታ'
    },
    service: {
      en: 'Service',
      om: 'Tajaajila',
      am: 'አገልግሎት'
    },
    requester: {
      en: 'Requester',
      om: 'Gaafataa',
      am: 'ጠያቂ'
    },
    pending: {
      en: 'Pending',
      om: 'Eega',
      am: 'በመጠበቅ ላይ'
    },
    inProgress: {
      en: 'In Progress',
      om: 'Gaggeeffamaa',
      am: 'በሂደት ላይ'
    },
    completed: {
      en: 'Completed',
      om: 'Xumurame',
      am: 'ተጠናቋል'
    },
    serviceManagement: {
      en: 'SERVICE MANAGEMENT',
      om: 'BULCHIINSA TAJAAJILAA',
      am: 'የአገልግሎት አስተዳደር'
    },
    userManagement: {
      en: 'USER MANAGEMENT',
      om: 'BULCHIINSA FAYYADAMTAA',
      am: 'የተጠቃሚ አስተዳደር'
    },
    // Changed from 'content' to 'contentHeader' for the header section
    contentHeader: {
      en: 'CONTENT',
      om: 'QABXII',
      am: 'ይዘት'
    },
    digitalServices: {
      en: 'Digital Services',
      om: 'Tajaajila Dijitaalaa',
      am: 'ዲጂታል አገልግሎቶች'
    },
    serviceRequests: {
      en: 'Service Requests',
      om: 'Gaaffii Tajaajilaa',
      am: 'የአገልግሎት ጥያቄዎች'
    },
    faqs: {
      en: 'FAQs',
      om: 'Gaaffiiwwan',
      am: 'ተዘውትረው የሚጠየቁ ጥያቄዎች'
    },
    users: {
      en: 'Users',
      om: 'Fayyadamtoota',
      am: 'ተጠቃሚዎች'
    },
    rolesPermissions: {
      en: 'Roles & Permissions',
      om: 'Gahee fi Hayyama',
      am: 'ሚናዎች እና ፈቃዶች'
    },
    pages: {
      en: 'Pages',
      om: 'Fuula',
      am: 'ገጾች'
    },
    galleries: {
      en: 'Galleries',
      om: 'Kuusaa Fakkii',
      am: 'ማሳያዎች'
    },
    documents: {
      en: 'Documents',
      om: 'Sanadoota',
      am: 'ሰነዶች'
    },
    settings: {
      en: 'Settings',
      om: 'Qindaa\'ina',
      am: 'ቅንብሮች'
    },
    addEvent: {
      en: 'Add Event',
      om: 'Taatee Iddahi',
      am: 'ዝግጅት አክል'
    },
    addProject: {
      en: 'Add Project',
      om: 'Pirojektii Iddahi',
      am: 'ፕሮጀክት አክል'
    },
    manageUsers: {
      en: 'Manage Users',
      om: 'Fayyadamtoota Bulchi',
      am: 'ተጠቃሚዎችን አስተዳድር'
    },
    systemSettings: {
      en: 'System Settings',
      om: 'Qindaa\'ina Sistimii',
      am: 'የስርዓት ቅንብሮች'
    }
  };

  const getApiEndpoint = () => {
    switch(activeSection) {
      case 'news': return `${API_BASE_URL}/api_news.php`;
      case 'events': return `${API_BASE_URL}/api_events.php`;
      case 'projects': return `${API_BASE_URL}/api_projects.php`;
      default: return `${API_BASE_URL}/api_news.php`;
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeSection]);

  useEffect(() => {
    if (activeMenuItem !== 'galleries') return;
    const fetchMedia = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api_media.php`);
        const result = await response.json();
        setMediaItems(result.success ? [...(result.data || []), ...(result.government || [])] : []);
      } catch (error) {
        console.error('Error fetching media:', error);
        setMediaItems([]);
      }
    };
    fetchMedia();
  }, [activeMenuItem]);

  useEffect(() => {
    const profile = mediaItems.find((item) => item.asset_key === mediaTarget);
    if (mediaTarget === 'mayor' || mediaTarget.startsWith('cab-')) {
      setGovernmentForm({
        name: profile?.name || '',
        task: profile?.task || '',
        location: profile?.location || '',
        email: profile?.email || ''
      });
    }
  }, [mediaTarget, mediaItems]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = getApiEndpoint();
      const response = await fetch(`${endpoint}?action=all`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setItems(result.data);
        } else {
          setItems([]);
        }
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const endpoint = getApiEndpoint();
      const action = editingItem ? 'update' : 'create';
      const method = editingItem ? 'PUT' : 'POST';
      
      const submitData = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (formData[key as keyof typeof formData] !== undefined && formData[key as keyof typeof formData] !== '') {
          submitData.append(key, String(formData[key as keyof typeof formData]));
        }
      });
      
      if (imageFile) {
        submitData.append('image_file', imageFile);
      }
      
      if (editingItem) {
        submitData.append('id', editingItem.id);
      }

      if (activeSection === 'projects') {
        submitData.append('name_en', formData.name_en || formData.title_en);
        submitData.append('name_om', formData.name_om || formData.title_om);
        submitData.append('name_am', formData.name_am || formData.title_am);
        submitData.append('description_en', formData.description_en || formData.excerpt_en);
        submitData.append('description_om', formData.description_om || formData.excerpt_om);
        submitData.append('description_am', formData.description_am || formData.excerpt_am);
      }

      const url = editingItem 
        ? `${endpoint}?action=${action}&id=${editingItem.id}`
        : `${endpoint}?action=${action}`;

      const response = await fetch(url, {
        method: method,
        body: submitData,
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Saved successfully!' });
        setShowForm(false);
        setEditingItem(null);
        resetForm();
        fetchData();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save' });
      }
    } catch (error) {
      console.error('Error saving:', error);
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    setLoading(true);
    try {
      const endpoint = getApiEndpoint();
      const response = await fetch(`${endpoint}?action=delete&id=${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (result.success) {
        setMessage({ type: 'success', text: 'Deleted successfully!' });
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting:', error);
      setMessage({ type: 'error', text: 'Failed to delete' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      ...formData,
      title_en: item.title?.en || item.name?.en || '',
      title_om: item.title?.om || item.name?.om || '',
      title_am: item.title?.am || item.name?.am || '',
      name_en: item.name?.en || '',
      name_om: item.name?.om || '',
      name_am: item.name?.am || '',
      description_en: item.description?.en || '',
      description_om: item.description?.om || '',
      description_am: item.description?.am || '',
      category: item.category || 'General',
      date: item.date || '',
      time: item.time || '',
      status: item.status || 'planning',
      progress: item.progress || 0,
      budget: item.budget || '',
      manager: item.manager || '',
      kebele: item.kebele || '',
      location_en: item.location?.en || '',
      location_om: item.location?.om || '',
      location_am: item.location?.am || '',
      excerpt_en: item.excerpt?.en || '',
      excerpt_om: item.excerpt?.om || '',
      excerpt_am: item.excerpt?.am || '',
      image: item.image || ''
    });
    setImagePreview(item.image ? `${API_BASE_URL}/${item.image}` : null);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title_en: '', title_om: '', title_am: '',
      excerpt_en: '', excerpt_om: '', excerpt_am: '',
      content_en: '', content_om: '', content_am: '',
      category: 'General',
      date: '',
      time: '',
      location_en: '', location_om: '', location_am: '',
      name_en: '', name_om: '', name_am: '',
      description_en: '', description_om: '', description_am: '',
      status: 'planning',
      progress: 0,
      budget: '',
      manager: '',
      kebele: '',
      image: ''
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingItem(null);
  };

  const handleMenuItemClick = (itemId: string) => {
    setActiveMenuItem(itemId);
    if (itemId === 'news') {
      setActiveSection('news');
      setShowForm(false);
      setEditingItem(null);
      resetForm();
    } else if (itemId === 'events') {
      setActiveSection('events');
      setShowForm(false);
      setEditingItem(null);
      resetForm();
    } else if (itemId === 'projects') {
      setActiveSection('projects');
      setShowForm(false);
      setEditingItem(null);
      resetForm();
    } else if (itemId === 'galleries') {
      setShowForm(false);
      setEditingItem(null);
      resetForm();
    } else {
      // For other menu items, just update the active state
    }
  };

  const getCategoryOptions = () => {
    if (activeSection === 'news') return CATEGORIES.news;
    if (activeSection === 'events') return CATEGORIES.events;
    return CATEGORIES.projects;
  };

  const renderForm = () => {
    const categoryOptions = getCategoryOptions();
    const isProject = activeSection === 'projects';
    const isEvent = activeSection === 'events';

    return (
      <div className="space-y-4">
        {/* Category Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {dict.categoryLabel[currentLang]} *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            >
              {categoryOptions.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>
          {!isProject && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {dict.dateLabel[currentLang]} {isEvent ? '*' : ''}
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required={isEvent}
              />
            </div>
          )}
          {isProject && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {dict.status[currentLang]}
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="planning">📋 Planning</option>
                  <option value="ongoing">🔄 Ongoing</option>
                  <option value="completed">✅ Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {dict.progress[currentLang]}
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value) || 0})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </>
          )}
        </div>

        {/* Title Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder={isProject ? "Name (English)*" : "Title (English)*"}
            value={isProject ? formData.name_en : formData.title_en}
            onChange={(e) => setFormData({
              ...formData, 
              ...(isProject ? { name_en: e.target.value } : { title_en: e.target.value })
            })}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
          <input
            type="text"
            placeholder={isProject ? "Name (Afan Oromo)*" : "Title (Afan Oromo)*"}
            value={isProject ? formData.name_om : formData.title_om}
            onChange={(e) => setFormData({
              ...formData, 
              ...(isProject ? { name_om: e.target.value } : { title_om: e.target.value })
            })}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
          <input
            type="text"
            placeholder={isProject ? "Name (Amharic)*" : "Title (Amharic)*"}
            value={isProject ? formData.name_am : formData.title_am}
            onChange={(e) => setFormData({
              ...formData, 
              ...(isProject ? { name_am: e.target.value } : { title_am: e.target.value })
            })}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        {/* Excerpt/Description Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <textarea
            placeholder={isProject ? "Description (English)" : "Excerpt (English)"}
            value={isProject ? formData.description_en : formData.excerpt_en}
            onChange={(e) => setFormData({
              ...formData, 
              ...(isProject ? { description_en: e.target.value } : { excerpt_en: e.target.value })
            })}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            rows={2}
          />
          <textarea
            placeholder={isProject ? "Description (Afan Oromo)" : "Excerpt (Afan Oromo)"}
            value={isProject ? formData.description_om : formData.excerpt_om}
            onChange={(e) => setFormData({
              ...formData, 
              ...(isProject ? { description_om: e.target.value } : { excerpt_om: e.target.value })
            })}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            rows={2}
          />
          <textarea
            placeholder={isProject ? "Description (Amharic)" : "Excerpt (Amharic)"}
            value={isProject ? formData.description_am : formData.excerpt_am}
            onChange={(e) => setFormData({
              ...formData, 
              ...(isProject ? { description_am: e.target.value } : { excerpt_am: e.target.value })
            })}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            rows={2}
          />
        </div>

        {/* Content/Additional Fields */}
        {!isProject && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <textarea
              placeholder="Content (English)"
              value={formData.content_en}
              onChange={(e) => setFormData({...formData, content_en: e.target.value})}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              rows={4}
            />
            <textarea
              placeholder="Content (Afan Oromo)"
              value={formData.content_om}
              onChange={(e) => setFormData({...formData, content_om: e.target.value})}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              rows={4}
            />
            <textarea
              placeholder="Content (Amharic)"
              value={formData.content_am}
              onChange={(e) => setFormData({...formData, content_am: e.target.value})}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              rows={4}
            />
          </div>
        )}

        {/* Project specific fields */}
        {isProject && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Budget"
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <input
              type="text"
              placeholder="Manager"
              value={formData.manager}
              onChange={(e) => setFormData({...formData, manager: e.target.value})}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <input
              type="text"
              placeholder="Kebele"
              value={formData.kebele}
              onChange={(e) => setFormData({...formData, kebele: e.target.value})}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <input
              type="date"
              placeholder="Date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        )}

        {/* Event specific fields */}
        {isEvent && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Location (English)"
              value={formData.location_en}
              onChange={(e) => setFormData({...formData, location_en: e.target.value})}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <input
              type="text"
              placeholder="Location (Afan Oromo)"
              value={formData.location_om}
              onChange={(e) => setFormData({...formData, location_om: e.target.value})}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <input
              type="text"
              placeholder="Location (Amharic)"
              value={formData.location_am}
              onChange={(e) => setFormData({...formData, location_am: e.target.value})}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        )}

        {/* Image Upload */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {dict.image[currentLang]}
          </label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
            />
            {imagePreview && (
              <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderItems = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-emerald-700" />
          <span className="ml-2 text-gray-600">{dict.loading[currentLang]}</span>
        </div>
      );
    }

    if (!items || items.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600">{dict.noItems[currentLang]}</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-3 text-xs font-medium text-gray-500 uppercase">{dict.titleLabel[currentLang]}</th>
              <th className="p-3 text-xs font-medium text-gray-500 uppercase">{dict.categoryLabel[currentLang]}</th>
              <th className="p-3 text-xs font-medium text-gray-500 uppercase">{dict.dateLabel[currentLang]}</th>
              {activeSection === 'projects' && (
                <>
                  <th className="p-3 text-xs font-medium text-gray-500 uppercase">{dict.status[currentLang]}</th>
                  <th className="p-3 text-xs font-medium text-gray-500 uppercase">{dict.progress[currentLang]}</th>
                </>
              )}
              {activeSection === 'events' && (
                <th className="p-3 text-xs font-medium text-gray-500 uppercase">{dict.time[currentLang]}</th>
              )}
              <th className="p-3 text-xs font-medium text-gray-500 uppercase text-right">{dict.actions[currentLang]}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-3 font-medium text-gray-800">
                  {item.title?.en || item.name?.en || 'Untitled'}
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs">
                    {item.category || 'General'}
                  </span>
                </td>
                <td className="p-3 text-sm text-gray-500">{item.date || 'N/A'}</td>
                {activeSection === 'projects' && (
                  <>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.status === 'completed' ? 'bg-green-100 text-green-800' :
                        item.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status || 'planning'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${item.progress || 0}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-500">{item.progress || 0}%</span>
                      </div>
                    </td>
                  </>
                )}
                {activeSection === 'events' && (
                  <td className="p-3 text-sm text-gray-500">{item.time || 'N/A'}</td>
                )}
                <td className="p-3 text-right">
                  <button 
                    onClick={() => handleEdit(item)} 
                    className="text-blue-600 hover:text-blue-800 mr-2 transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4 inline" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)} 
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderMediaManager = () => {
    const mediaOptions = [
      ...Array.from({ length: 6 }, (_, index) => ({ key: `gallery-${index + 1}`, label: `Gallery image ${index + 1}` })),
      { key: 'mayor', label: 'City administrator / Mayor' },
      ...Array.from({ length: 5 }, (_, index) => ({ key: `cab-${index + 1}`, label: `Cabinet member ${index + 1}` })),
      { key: 'mesob-center', label: 'Agaro Mesob Center administrator' },
      { key: 'services-leader-1', label: 'Services leadership: Ato Kemal Jemal' },
      { key: 'services-leader-2', label: 'Services leadership: Dr. Chaltu Gemeda' }
    ];
    const currentAsset = mediaItems.find((item) => item.asset_key === mediaTarget);
    const isGovernmentTarget = mediaTarget === 'mayor' || mediaTarget.startsWith('cab-') || mediaTarget === 'mesob-center' || mediaTarget.startsWith('services-leader-');

    const handleMediaUpload = async (event: React.FormEvent) => {
      event.preventDefault();
      if (!mediaFile && !isGovernmentTarget) return;
      setLoading(true);
      setMessage(null);
      try {
        const data = new FormData();
        data.append('asset_key', mediaTarget);
        if (mediaFile) data.append('image_file', mediaFile);
        if (isGovernmentTarget) {
          data.append('name', governmentForm.name);
          data.append('task', governmentForm.task);
          data.append('location', governmentForm.location);
          data.append('email', governmentForm.email);
        }
        const response = await fetch(`${API_BASE_URL}/api_media.php`, { method: 'POST', body: data });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.error || 'Upload failed');
        setMessage({ type: 'success', text: 'Image updated successfully.' });
        setMediaItems((current) => [
          ...current.filter((item) => item.asset_key !== mediaTarget),
          { asset_key: mediaTarget, image: result.image, ...governmentForm }
        ]);
        setMediaFile(null);
      } catch (error) {
        console.error('Error uploading media:', error);
        setMessage({ type: 'error', text: 'Unable to upload image.' });
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gallery & Government Images</h2>
          <p className="text-sm text-gray-600 mt-1">Replace public gallery and city administration cabinet images.</p>
        </div>
        {message && (
          <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {message.type === 'success' ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            {message.text}
          </div>
        )}
        <form onSubmit={handleMediaUpload} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
          <label className="block text-sm font-medium text-gray-700">Image location</label>
          <select value={mediaTarget} onChange={(event) => setMediaTarget(event.target.value)} className="w-full p-2 border rounded-lg">
            {mediaOptions.map((option) => <option key={option.key} value={option.key}>{option.label}</option>)}
          </select>
          {currentAsset?.image && (
            <img src={`${API_BASE_URL}/${currentAsset.image}`} alt="Current media" className="h-32 w-48 rounded-lg object-cover border" />
          )}
          {isGovernmentTarget && (
            <div className="grid gap-3 md:grid-cols-2">
              <input type="text" required placeholder="Full name" value={governmentForm.name} onChange={(event) => setGovernmentForm({ ...governmentForm, name: event.target.value })} className="p-2 border rounded-lg" />
              <input type="email" placeholder="Email" value={governmentForm.email} onChange={(event) => setGovernmentForm({ ...governmentForm, email: event.target.value })} className="p-2 border rounded-lg" />
              <input type="text" required placeholder="Main task / portfolio" value={governmentForm.task} onChange={(event) => setGovernmentForm({ ...governmentForm, task: event.target.value })} className="p-2 border rounded-lg" />
              <input type="text" required placeholder="Office location" value={governmentForm.location} onChange={(event) => setGovernmentForm({ ...governmentForm, location: event.target.value })} className="p-2 border rounded-lg" />
            </div>
          )}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" required={!isGovernmentTarget} onChange={(event) => setMediaFile(event.target.files?.[0] || null)} className="block w-full text-sm text-gray-500" />
          <button type="submit" disabled={(!mediaFile && !isGovernmentTarget) || loading} className="flex items-center gap-2 px-5 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 disabled:opacity-50">
            <Save className="h-4 w-4" />
            {loading ? 'Uploading...' : 'Upload image'}
          </button>
        </form>
      </div>
    );
  };

  // Render sidebar
  const renderSidebar = () => {
    return (
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto transition-all duration-300 flex-shrink-0`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-emerald-700" />
            {isSidebarOpen && (
              <span className="text-lg font-bold text-gray-800">{dict.title[currentLang]}</span>
            )}
          </div>
        </div>
        <nav className="p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            if (item.isHeader) {
              return isSidebarOpen ? (
                <div key={item.id} className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {item.id === 'content-header' ? dict.contentHeader[currentLang] : item.label}
                </div>
              ) : null;
            }
            const isActive = activeMenuItem === item.id || 
              (item.id === 'news' && activeSection === 'news') ||
              (item.id === 'events' && activeSection === 'events') ||
              (item.id === 'projects' && activeSection === 'projects');
            return (
              <button
                key={item.id}
                onClick={() => handleMenuItemClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-emerald-700' : 'text-gray-400'}`} />
                {isSidebarOpen && item.label}
              </button>
            );
          })}
        </nav>
      </div>
    );
  };

  // Render main content
  const renderMainContent = () => {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Header with toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{dict.dashboard[currentLang]}</h1>
                <p className="text-gray-600">{dict.subtitle[currentLang]}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              {dict.logout[currentLang]}
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                      <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-green-600">{stat.change}</span>
                    <span className="text-xs text-gray-400 ml-1">from last month</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Analytics Overview */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">{dict.analytics[currentLang]}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Website Visitors</p>
                <div className="h-8 w-full bg-gray-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Service Requests</p>
                <div className="h-8 w-full bg-gray-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">New Users</p>
                <div className="h-8 w-full bg-gray-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities and Service Requests */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-emerald-600" />
                  {dict.recentActivities[currentLang]}
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50">
                    <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.detail}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest Service Requests */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-600" />
                  {dict.latestRequests[currentLang]}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-xs font-medium text-gray-500 uppercase">#</th>
                      <th className="p-3 text-xs font-medium text-gray-500 uppercase">{dict.service[currentLang]}</th>
                      <th className="p-3 text-xs font-medium text-gray-500 uppercase">{dict.requester[currentLang]}</th>
                      <th className="p-3 text-xs font-medium text-gray-500 uppercase">{dict.status[currentLang]}</th>
                      <th className="p-3 text-xs font-medium text-gray-500 uppercase">{dict.dateLabel[currentLang]}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {serviceRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50">
                        <td className="p-3 text-sm text-gray-500">{req.id}</td>
                        <td className="p-3 text-sm font-medium text-gray-800">{req.service}</td>
                        <td className="p-3 text-sm text-gray-600">{req.requester}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            req.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            req.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-gray-500">{req.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">{dict.quickActions[currentLang]}</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setActiveSection('events');
                  setShowForm(true);
                  setActiveMenuItem('events');
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" /> {dict.addEvent[currentLang]}
              </button>
              <button
                onClick={() => {
                  setActiveSection('projects');
                  setShowForm(true);
                  setActiveMenuItem('projects');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <ClipboardList className="h-4 w-4" /> {dict.addProject[currentLang]}
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
                <Users className="h-4 w-4" /> {dict.manageUsers[currentLang]}
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
                <Settings className="h-4 w-4" /> {dict.systemSettings[currentLang]}
              </button>
            </div>
          </div>

          {/* Content Management Section */}
          <div className="mt-6">
            {activeMenuItem === 'galleries' ? renderMediaManager() : (
              <>
            {/* Section Navigation */}
            <div className="flex flex-wrap gap-2 mb-4">
              {['news', 'events', 'projects'].map((section) => (
                <button
                  key={section}
                  onClick={() => {
                    setActiveSection(section as any);
                    setShowForm(false);
                    setEditingItem(null);
                    resetForm();
                    setActiveMenuItem(section);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2
                    ${activeSection === section 
                      ? 'bg-emerald-700 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                  {section === 'news' && <Newspaper className="h-4 w-4" />}
                  {section === 'events' && <Calendar className="h-4 w-4" />}
                  {section === 'projects' && <ClipboardList className="h-4 w-4" />}
                  {dict[section as keyof typeof dict][currentLang]}
                </button>
              ))}
            </div>

            {/* Message */}
            {message && (
              <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
                message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.type === 'success' ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                {message.text}
              </div>
            )}

            {/* Add Button */}
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="mb-4 flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
              >
                <Plus className="h-4 w-4" />
                {dict.addNew[currentLang]}
              </button>
            )}

            {/* Form */}
            {showForm && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {editingItem ? dict.edit[currentLang] : dict.addNew[currentLang]} {dict[activeSection][currentLang]}
                </h3>
                <form onSubmit={handleSubmit}>
                  {renderForm()}
                  <div className="flex gap-3 mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      {loading ? dict.loading[currentLang] : dict.save[currentLang]}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingItem(null);
                        resetForm();
                      }}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      {dict.cancel[currentLang]}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Items List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">
                  {activeSection === 'news' ? 'Latest News' : activeSection === 'events' ? 'Upcoming Events' : 'Projects List'}
                </h3>
              </div>
              {renderItems()}
            </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {renderSidebar()}
      {renderMainContent()}
    </div>
  );
}