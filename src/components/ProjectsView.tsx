import React, { useState, useEffect } from 'react';
import { Language, Project } from '../types';
import { Landmark, TrendingUp, CheckCircle, HardHat, FileText, BadgePercent, Loader2, Image as ImageIcon } from 'lucide-react';

interface ProjectsViewProps {
  currentLang: Language;
}

// API Base URL - change this to match your PHP backend location
const API_BASE_URL = 'http://localhost/agaro/php_export';

export default function ProjectsView({ currentLang }: ProjectsViewProps) {
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'planning' | 'ongoing' | 'completed'>('All');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    totalBudget: '0 ETB'
  });

  const dict = {
    title: {
      en: 'Municipal Projects Tracker',
      om: 'Hordoffii Pirojektoota Magaalaa',
      am: 'የከተማው ፕሮጀክቶች መከታተያ'
    },
    subtitle: {
      en: 'Transparent physical and financial progress parameters for key city development infrastructures.',
      om: 'Guddina ijaarsa pirojektoota magaalaa kan akka daandii aspaaltii, manneen fayyaafi barnootaa hunda ilaalaa.',
      am: 'ለዋና ዋና ከተማ ግንባታዎች እና ልማቶች ግልጽ የአካላዊ እና የፋይናንስ እድገት መለኪያዎች መከታተያ።'
    },
    budgetLabel: {
      en: 'Allocated Budget',
      om: 'Bajata Ramadame',
      am: 'የተመደበ በጀት'
    },
    managerLabel: {
      en: 'Project Director',
      om: 'Gulaaltu Pirojektichaa',
      am: 'የፕሮጀክት ሥራ አስኪያጅ'
    },
    statusBadge: {
      planning: { en: 'Planning Stage', om: 'Pilaanii Irra', am: 'በእቅድ ደረጃ' },
      ongoing: { en: 'In progress', om: 'Gaggeeffamaa jira', am: 'በግንባታ ላይ' },
      completed: { en: 'Fully Commissioned', om: 'Xumurameera', am: 'ተጠናቋል' }
    },
    noProjects: {
      en: 'No projects found',
      om: 'Pirojektoon hin argamne',
      am: 'ምንም ፕሮጀክቶች አልተገኙም'
    },
    loadingText: {
      en: "Loading projects...",
      om: "Pirojektoowwan feisanii...",
      am: "ፕሮጀክቶች በመጫን ላይ..."
    },
    errorText: {
      en: 'Error loading projects',
      om: "Dogoggora pirojektoowwan fe'isuun",
      am: "ፕሮጀክቶችን በማስገባት ላይ ስህተት"
    }
  };

  // Fetch projects from API
  useEffect(() => {
    fetchProjects();
    fetchStats();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api_projects.php?action=all`);
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const result = await response.json();
      if (result.success) {
        setProjects(result.data);
      } else {
        setError(result.error || 'Failed to load projects');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api_projects.php?action=stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const result = await response.json();
      if (result.success) {
        setStats({
          total: result.data.total_projects,
          totalBudget: result.data.total_budget
        });
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const filteredProjects = projects.filter((proj) => {
    return selectedStatus === 'All' || proj.status === selectedStatus;
  });

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'ongoing': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'planning': return 'bg-amber-50 text-[#a16207] border-amber-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case 'ongoing': return <HardHat className="h-4 w-4 text-blue-600 animate-pulse" />;
      case 'planning': return <FileText className="h-4 w-4 text-[#ca8a04]" />;
      default: return null;
    }
  };

  // Helper function to get full image URL
  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) return null;
    // If it's already a full URL, return it
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // If it starts with 'uploads/', use it as is with base URL
    if (imagePath.startsWith('uploads/')) {
      return `${API_BASE_URL}/${imagePath}`;
    }
    // Otherwise, assume it's a relative path
    return `${API_BASE_URL}/${imagePath}`;
  };

  // Show loading state
  if (loading) {
    return (
      <section id="projects-section" className="space-y-12 py-6 font-sans">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="font-display text-3.5xl font-bold text-slate-800 tracking-tight leading-tight md:text-4xl">
            {dict.title[currentLang]}
          </h1>
          <div className="flex items-center justify-center gap-3 py-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-green-700" />
            <span className="text-slate-600">{dict.loadingText[currentLang]}</span>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section id="projects-section" className="space-y-12 py-6 font-sans">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="font-display text-3.5xl font-bold text-slate-800 tracking-tight leading-tight md:text-4xl">
            {dict.title[currentLang]}
          </h1>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <p className="text-red-600">{dict.errorText[currentLang]}</p>
            <p className="text-sm text-red-500 mt-2">{error}</p>
            <button
              onClick={fetchProjects}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects-section" className="space-y-12 py-6 font-sans">
      {/* Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="font-display text-3.5xl font-bold text-slate-800 tracking-tight leading-tight md:text-4xl">
          {dict.title[currentLang]}
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          {dict.subtitle[currentLang]}
        </p>
        <div className="h-1 w-20 bg-brand-gold-500 mx-auto rounded-full"></div>
      </div>

      {/* Top statistics overview panel */}
      <div className="grid gap-5 md:grid-cols-3 max-w-5xl mx-auto">
        <div className="bg-white border border-slate-100 rounded-2.5xl p-5 flex items-center gap-4 shadow-xs">
          <div className="h-12 w-12 rounded-xl bg-brand-green-50 text-brand-green-700 flex items-center justify-center shrink-0">
            <Landmark className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-2xl font-display font-bold text-slate-800">
              Total Funding
            </span>
            <span className="text-xs text-slate-400 font-medium">Total Active Funding Pool</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2.5xl p-5 flex items-center gap-4 shadow-xs">
          <div className="h-12 w-12 rounded-xl bg-amber-50 text-brand-gold-700 flex items-center justify-center shrink-0">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-2xl font-display font-bold text-slate-800">
              {stats.total} Major
            </span>
            <span className="text-xs text-slate-400 font-medium">Investments Monitored</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2.5xl p-5 flex items-center gap-4 shadow-xs">
          <div className="h-12 w-12 rounded-xl bg-green-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-2xl font-display font-bold text-slate-800">100% Secure</span>
            <span className="text-xs text-slate-400 font-medium">Community Accountability</span>
          </div>
        </div>
      </div>

      {/* Status control buttons */}
      <div className="max-w-5xl mx-auto flex items-center justify-center pt-2">
        <div className="inline-flex bg-slate-100/80 p-1 rounded-2xl border border-slate-200 gap-1 flex-wrap justify-center">
          {(['All', 'planning', 'ongoing', 'completed'] as const).map((status) => (
            <button
              id={`btn-proj-status-toggle-${status}`}
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2.5 rounded-xl text-xs.5 font-semibold transition-all cursor-pointer ${
                selectedStatus === status
                  ? 'bg-white text-slate-800 shadow-xs border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {status === 'All' ? 'Complete Listing' : dict.statusBadge[status][currentLang]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List Projects */}
      <div className="max-w-5xl mx-auto">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-200">
            <FileText className="h-12 w-12 mx-auto text-slate-400 mb-3" />
            <p className="text-slate-600 font-medium">{dict.noProjects[currentLang]}</p>
            <p className="text-sm text-slate-400 mt-1">
              {selectedStatus === 'All' 
                ? 'No projects have been added yet' 
                : `No ${dict.statusBadge[selectedStatus][currentLang].toLowerCase()} projects available`}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 pt-2">
            {filteredProjects.map((proj) => {
              const imageUrl = getImageUrl(proj.image);
              return (
                <div
                  key={proj.id}
                  className="bg-white border border-slate-150 rounded-3xl p-6 shadow-xs select-none flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-4">
                    {/* Badge & Kebele */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 text-slate-500 rounded-lg px-2.5 py-1 text-xs font-mono">
                        {proj.kebele || 'Kebele N/A'}
                      </span>
                      <span className={`inline-flex items-center gap-1 border rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(proj.status)}`}>
                        {getStatusIcon(proj.status)}
                        {dict.statusBadge[proj.status][currentLang]}
                      </span>
                    </div>

                    {/* Project Image */}
                    {imageUrl ? (
                      <div className="relative w-full h-48 rounded-xl overflow-hidden bg-slate-100">
                        <img 
                          src={imageUrl} 
                          alt={proj.name[currentLang] || proj.name.en}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            // If image fails to load, show placeholder
                            (e.target as HTMLImageElement).style.display = 'none';
                            const parent = (e.target as HTMLImageElement).parentElement;
                            if (parent) {
                              const placeholder = document.createElement('div');
                              placeholder.className = 'w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100';
                              placeholder.innerHTML = `
                                <div class="flex flex-col items-center gap-2 text-slate-400">
                                  <svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                  </svg>
                                  <span class="text-sm">No Image</span>
                                </div>
                              `;
                              parent.appendChild(placeholder);
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                          <ImageIcon className="h-12 w-12" />
                          <span className="text-sm">No Image</span>
                        </div>
                      </div>
                    )}

                    {/* Title & info */}
                    <div className="space-y-1.5">
                      <h3 className="font-display font-bold text-slate-800 text-lg leading-snug">
                        {proj.name[currentLang] || proj.name.en}
                      </h3>
                      <p className="text-slate-500 text-xs.5 leading-relaxed">
                        {proj.description[currentLang] || proj.description.en || 'No description available'}
                      </p>
                    </div>
                  </div>

                  {/* Progress segment */}
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <BadgePercent className="h-4 w-4 text-brand-green-700" />
                          Physical Progress
                        </span>
                        <span className="text-brand-green-700 font-mono">{proj.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-brand-green-700 h-full rounded-full transition-all duration-500"
                          style={{ width: `${proj.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Budget and details footer */}
                    <div className="h-px bg-slate-150 my-4" />

                    <div className="grid grid-cols-2 gap-4 min-w-0">
                      <div className="space-y-0.5 min-w-0">
                        <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                          {dict.budgetLabel[currentLang]}
                        </span>
                        <span className="block text-sm font-bold text-slate-800 font-mono-muted break-all leading-5">
                          Total Funding
                        </span>
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                          {dict.managerLabel[currentLang]}
                        </span>
                        <span className="block text-xs font-bold text-slate-700 truncate">
                          {proj.manager || 'Not assigned'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}