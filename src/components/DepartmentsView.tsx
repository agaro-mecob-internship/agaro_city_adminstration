import React, { useState, useEffect } from 'react';
import { DEPARTMENTS_DATA } from '../data';
import { getStoredCabinet, getStoredMayor } from '../dataStore';
import { Language } from '../types';
import { 
  Mail, Phone, Clock, ArrowRight, Shield, Sparkles, User, 
  Users, MapPin, Building, Globe, Send, CheckCircle, Award
} from 'lucide-react';

const API_BASE_URL = 'http://localhost/agaro/php_export';

interface DepartmentsViewProps {
  currentLang: Language;
  initialSubTab?: string | null;
  onSubTabChange?: (tabId: string) => void;
}

export default function DepartmentsView({ currentLang, initialSubTab, onSubTabChange }: DepartmentsViewProps) {
  const [activeTab, setActiveTab] = useState<string>('administrator'); // Default to Administrator
  const [selectedDept, setSelectedDept] = useState<string>(DEPARTMENTS_DATA[0].id);
  const [cabinetMembers, setCabinetMembers] = useState<any[]>([]);
  const [mayorInfo, setMayorInfo] = useState<any>(null);

  useEffect(() => {
    const loadGovernmentImages = async () => {
      const cabinet = getStoredCabinet();
      const mayor = getStoredMayor();
      try {
        const response = await fetch(`${API_BASE_URL}/api_media.php`);
        const result = await response.json();
        const assets = result.success
          ? result.data.reduce((map: Record<string, string>, asset: any) => {
              map[asset.asset_key] = asset.image;
              return map;
            }, {})
          : {};
        const profiles = result.success
          ? result.government.reduce((map: Record<string, any>, profile: any) => {
              map[profile.asset_key] = profile;
              return map;
            }, {})
          : {};
        const imageUrl = (image: string) => image.startsWith('http') ? image : `${API_BASE_URL}/${image}`;

        setCabinetMembers(cabinet.map((member, index) => ({
          ...member,
          ...(profiles[member.id] || {}),
          image: profiles[member.id]?.image ? imageUrl(profiles[member.id].image) : (assets[member.id] ? imageUrl(assets[member.id]) : member.image),
          desk: profiles[member.id]?.task ? { en: profiles[member.id].task, om: profiles[member.id].task, am: profiles[member.id].task } : member.desk
        })));
        setMayorInfo({
          ...mayor,
          ...(profiles.mayor || {}),
          image: profiles.mayor?.image ? imageUrl(profiles.mayor.image) : (assets.mayor ? imageUrl(assets.mayor) : mayor.image),
          desk: profiles.mayor?.task ? { en: profiles.mayor.task, om: profiles.mayor.task, am: profiles.mayor.task } : mayor.desk
        });
      } catch (error) {
        console.error('Error fetching government images:', error);
        setCabinetMembers(cabinet);
        setMayorInfo(mayor);
      }
    };

    loadGovernmentImages();
  }, []);

  useEffect(() => {
    if (initialSubTab) {
      if (['administrator', 'cabinets', 'woredas', 'offices'].includes(initialSubTab)) {
        setActiveTab(initialSubTab);
      }
    }
  }, [initialSubTab]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onSubTabChange) {
      onSubTabChange(tabId);
    }
  };

  const glossary = {
    administrator: {
      en: 'Executive Office of the Mayor',
      om: 'Waajjira Kantiibaa Ol\'aanaa',
      am: 'የከንቲባው ዋና የሥራ አስፈፃሚ ቢሮ'
    },
    cabinets: {
      en: 'City Administration Cabinets',
      om: 'Miseensota Kaabinee Magaalaa',
      am: 'የከተማዋ አስተዳደር ካቢኔ አባላት'
    },
    woredas: {
      en: 'Municipal Kebele Divisions',
      om: 'Bulchiinsa Goxootaafi Kebellee',
      am: 'የቀበሌና ወረዳ አስተዳደር ክፍሎች'
    },
    offices: {
      en: 'Municipal Offices & Desks',
      om: 'Kutalee Hojii Guguddoo',
      am: 'የማዘጋጃ ቤት የሥራ ክፍሎች'
    },
    title: {
      en: 'Agaro City Government',
      om: 'Mootummaa Magaalaa Aggaaroo',
      am: 'የአጋሮ ከተማ መስተዳድር'
    },
    subtitle: {
      en: 'Detailed organizational divisions, leadership cabinets, executive mandates, and decentralized Kebele centers of Agaro City.',
      om: 'Misoomaafi caasaalee bulchiinsaa magaalaa Aggaaroo kanneen kantiibaa, kaabineefi woredaalee hammate.',
      am: 'የአጋሮ ከተማ ዝርዝር መዋቅራዊ ክፍፍሎች፣ የከንቲባው ቢሮ፣ የካቢኔ አባላት እና ያልተማከሉ የቀበሌ አስተዳደር ማዕከላት አገልግሎቶች።'
    },
    mandateTitle: {
      en: 'Mandate & Core Duties',
      om: 'Irgamaafi Hojii Kutichaa',
      am: 'የክፍሉ የሥራ ኃላፊነት እና ግዴታዎች'
    },
    contactTitle: {
      en: 'Direct Office Inquiries',
      om: 'Quunnamtii Kallattii Waajjiraa',
      am: 'ቀጥታ የቢሮ መጠይቆች'
    },
    contactHead: {
      en: 'Executive Officer',
      om: 'Hoggansa Ol\'aanaa',
      am: 'ዋና ኃላፊ'
    }
  };

  // Cabinet members state is loaded at component initialization

  // Woredas / Kebeles details
  const kebeleDivisions = [
    {
      name: { en: 'Kebele 01 Administration', om: 'Bulchiinsa Kebele 01', am: 'የቀበሌ 01 አስተዳደር' },
      zone: { en: 'Central Trade & Markets Zone', om: 'Zoonii Daldala Giddugalaa', am: 'የመካከለኛው ንግድ እና ገበያ ዞን' },
      coordinator: 'Ato Solomon Bekele',
      phone: '+251 47 555 2001',
      location: { en: 'Near Central Coffee Market, Agaro', om: 'Gabaa Bunaa Giddugalaa bira', am: 'ከማዕከላዊ የቡና ገበያ አጠገብ' }
    },
    {
      name: { en: 'Kebele 02 Administration', om: 'Bulchiinsa Kebele 02', am: 'የቀበሌ 02 አስተዳደር' },
      zone: { en: 'Industrial Dry Mills & Coffee Zone', om: 'Zoonii Warshaalee Bunaa', am: 'የኢንዱስትሪ ቡና ፋብሪካዎች ዞን' },
      coordinator: 'Ato Ahmedin Kemal',
      phone: '+251 47 555 2002',
      location: { en: 'Logistics Bypass Road, Agaro', om: 'Karaa Dabarsaa Loojistiksii', am: 'አጋሮ የሎጂስቲክስ ማለፊያ መንገድ' }
    },
    {
      name: { en: 'Kebele 03 Administration', om: 'Bulchiinsa Kebele 03', am: 'የቀበሌ 03 አስተዳደር' },
      zone: { en: 'Residential & Academic Sector', om: 'Zoonii Barnootaafi Jireenyaa', am: 'የመኖሪያ እና የትምህርት ዘርፍ' },
      coordinator: 'W/ro Tigist Demeke',
      phone: '+251 47 555 2003',
      location: { en: 'Near Agaro High School', om: 'Mana Barnoota Ol\'aanaa Aggaaroo bira', am: 'ከአጋሮ ሁለተኛ ደረጃ ትምህርት ቤት አጠገብ' }
    },
    {
      name: { en: 'Kebele 04 Administration', om: 'Bulchiinsa Kebele 04', am: 'የቀበሌ 04 አስተዳደር' },
      zone: { en: 'Southern Eco-Green Outskirts', om: 'Zoonii Misooma Magariisa Kibbaa', am: 'የደቡባዊ አረንጓዴ ልማት ዞን' },
      coordinator: 'Ato Abraham Tolesa',
      phone: '+251 47 555 2004',
      location: { en: 'Southern Arterial Bypass, Agaro', om: 'Karaa Geengoo Kibba Magaalaa', am: 'የደቡባዊ ቀለበት መንገድ መውጫ' }
    },
    {
      name: { en: 'Kebele 05 Administration', om: 'Bulchiinsa Kebele 05', am: 'የቀበሌ 05 አስተዳደር' },
      zone: { en: 'Eastern Agricultural Expansion Zone', om: 'Zoonii Babal’ina Qonnaa Bahaa', am: 'የምስራቃዊ ግብርና ማስፋፊያ ዞን' },
      coordinator: 'W/ro Chaltu Kebede',
      phone: '+251 47 555 2005',
      location: { en: 'Near Eastern Coffee Co-operatives, Agaro', om: 'Bira Waldaalee Bunaa Bahaa', am: 'ከምስራቅ የቡና ህብረት ስራ ማህበራት አጠገብ' }
    },
    {
      name: { en: 'Kebele 06 Administration', om: 'Bulchiinsa Kebele 06', am: 'የቀበሌ 06 አስተዳደር' },
      zone: { en: 'Northern Civic & Social Block', om: 'Kutaa Hawaasummaa fi Bulchiinsa Kaabaa', am: 'የሰሜናዊ ሲቪክ እና ማህበራዊ ዞን' },
      coordinator: 'Ato Mohammed Abafita',
      phone: '+251 47 555 2006',
      location: { en: 'Near Northern Public Poly-Clinic', om: 'Bira Buufata Fayyaa Kaabaa', am: 'ከሰሜን ፖሊ-ክሊኒክ አጠገብ' }
    },
    
  ];

  const activeDeptData = DEPARTMENTS_DATA.find(d => d.id === selectedDept) || DEPARTMENTS_DATA[0];

  return (
    <section id="departments-section" className="space-y-12 py-6 font-sans">
      
      {/* Header Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="font-display text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
          {glossary.title[currentLang]}
        </h1>
        <p className="text-sm.5 text-slate-600 leading-relaxed max-w-xl mx-auto">
          {glossary.subtitle[currentLang]}
        </p>
        <div className="h-1 w-20 bg-brand-gold-500 mx-auto rounded-full"></div>
      </div>

      {/* Government Suboptions Tab switcher */}
      <div className="flex border border-slate-200 bg-white shadow-subtle rounded-2xl p-1.5 max-w-4xl mx-auto gap-2 select-none">
        <button
          id="btn-dept-subtab-administrator"
          onClick={() => handleTabChange('administrator')}
          className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-xs.5 font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'administrator'
              ? 'bg-brand-green-700 text-white shadow-sm font-bold'
              : 'text-slate-600 hover:text-brand-green-700 hover:bg-slate-100/50'
          }`}
        >
          {glossary.administrator[currentLang]}
        </button>
        <button
          id="btn-dept-subtab-cabinets"
          onClick={() => handleTabChange('cabinets')}
          className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-xs.5 font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'cabinets'
              ? 'bg-brand-green-700 text-white shadow-sm font-bold'
              : 'text-slate-600 hover:text-brand-green-700 hover:bg-slate-100/50'
          }`}
        >
          {glossary.cabinets[currentLang]}
        </button>
        <button
          id="btn-dept-subtab-woredas"
          onClick={() => handleTabChange('woredas')}
          className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-xs.5 font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'woredas'
              ? 'bg-brand-green-700 text-white shadow-sm font-bold'
              : 'text-slate-600 hover:text-brand-green-700 hover:bg-slate-100/50'
          }`}
        >
          {glossary.woredas[currentLang]}
        </button>
        <button
          id="btn-dept-subtab-offices"
          onClick={() => handleTabChange('offices')}
          className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-xs.5 font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'offices'
              ? 'bg-brand-green-700 text-white shadow-sm font-bold'
              : 'text-slate-600 hover:text-brand-green-700 hover:bg-slate-100/50'
          }`}
        >
          {glossary.offices[currentLang]}
        </button>
      </div>

      {/* 1. ADMINISTRATOR VIEW (Office of the Mayor) */}
      {activeTab === 'administrator' && (
        <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-150 overflow-hidden shadow-sm grid md:grid-cols-12">
          {/* Portrait Sidebar */}
          <div className="md:col-span-4 bg-slate-50 border-r border-slate-150 p-8 flex flex-col items-center justify-center text-center space-y-5">
            <div className="h-36 w-36 rounded-full overflow-hidden border-[3.5px] border-brand-gold-500 flex items-center justify-center shadow-md bg-white animate-fade-in">
              <img 
                src={mayorInfo?.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256"} 
                alt={mayorInfo?.name || "Hon. Nezif"} 
                className="h-full w-full object-cover object-top hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {mayorInfo?.role?.[currentLang] || (currentLang === 'en' ? 'Honorary Mayor' : currentLang === 'om' ? 'Kantiibaa Kabajaa Magaalaa' : 'የክብር ከንቲባ')}
              </span>
              <h2 className="font-display text-xl font-bold text-slate-800 mt-1">{mayorInfo?.name || "Hon. Nezif"}</h2>
              <p className="text-xs text-brand-green-750 font-semibold font-mono mt-0.5">{mayorInfo?.email || "mayor@agarocity.gov.et"}</p>
            </div>
            <div className="pt-4 border-t border-slate-200 w-full text-xs text-slate-500 space-y-1.5 font-mono">
              <p>📍 {mayorInfo?.location || 'Admin Block, 1st Floor'}</p>
              <p>⏱️ Term: {mayorInfo?.term?.[currentLang] || (currentLang === 'en' ? '2022 - present' : '2022 - Amma')}</p>
            </div>
          </div>

          {/* Core Content */}
          <div className="md:col-span-8 p-8 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-brand-gold-700 uppercase bg-brand-gold-100/50 border border-brand-gold-200/50 px-2.5 py-1 rounded-md">Municipal Strategy</span>
              <h3 className="font-display text-2xl font-bold text-slate-800 tracking-tight">Executive Address & Mandate</h3>
              <p className="text-slate-650 text-sm leading-relaxed">
                {currentLang === 'en' 
                  ? "Under the Oromia Regional Government framework, the Mayor drives civic development, infrastructure expansion, and digital e-governance solutions to establish Agaro as southwestern Ethiopia's premier industrial coffee and commercial hub."
                  : currentLang === 'om'
                  ? "Bulchiinsa Mootummaa Naannoo Oromiyaa jalatti, Kantiibaan haaraa dhimma guddina magaalaa, misooma bu'uraalee, fi tajaajila dijiitaalaa saffisiisanii Agaro giddugala daldalaa bunaa ol'aanaa gochuuf hojjetu."
                  : "በኦሮሚያ ክልላዊ መንግሥት መዋቅር ሥር፣ ከንቲባው የከተማ ዕድገትን፣ የመሠረተ ልማት ዝርጋታን እና የዲጂታል አስተዳደርን በማቀናጀት አጋሮን በደቡብ ምዕራብ ኢትዮጵያ ዋነኛ የቡና እና የኢኮኖሚ ማዕከል ለማድረግ እየሰሩ ይገኛሉ።"}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-5 space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Award className="h-4 w-4 text-brand-gold-500 shrink-0" />
                Special Administrative Strategic Priorities
              </h4>
              <div className="grid gap-4 sm:grid-cols-3">
                {(mayorInfo?.priorities?.[currentLang] || []).map((priority: string, pIdx: number) => (
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
      )}

      {/* 2. CABINETS VIEW */}
      {activeTab === 'cabinets' && (
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="font-display text-xl.5 font-bold text-slate-800">The Municipal Cabinet</h3>
            <p className="text-xs text-slate-500 leading-relaxed">The high executive steering council meeting bi-weekly to draft, coordinate, and enact public safety, budget allocations, and commercial zoning bylaws in Agaro City.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cabinetMembers.map((member, idx) => (
              <div key={idx} className="bg-white border border-slate-150 rounded-2xl p-5 space-y-4 hover:shadow-subtle transition-all">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-slate-100 flex items-center justify-center shadow-inner">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="h-full w-full object-cover object-top hover:scale-105 transition-transform duration-300" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm.5">{member.name}</h4>
                    <p className="text-[10.5px] text-slate-450 font-medium">{member.role[currentLang]}</p>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs text-slate-650 space-y-1">
                  <span className="block text-[8.5px] font-bold text-slate-400 uppercase tracking-widest">Portfolio Desk</span>
                  <p className="font-bold text-slate-750 truncate">{member.desk[currentLang]}</p>
                  <p className="text-[10.5px] text-slate-500 truncate">📍 {member.location || 'City Administration Office'}</p>
                  <p className="text-[10.5px] text-[#ca8a04] hover:underline font-mono truncate">{member.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. WOREDAS VIEW */}
      {activeTab === 'woredas' && (
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="font-display text-xl.5 font-bold text-slate-800">Sectors & Kebele Administrations</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Agaro City is structured into decentralized Kebeles, allocating vital service registries, safety patrol desks, and community development closer to residents.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {kebeleDivisions.map((kebele, index) => (
              <div key={index} className="bg-white border border-slate-150 rounded-2xl p-6 flex flex-col justify-between hover:border-brand-green-700/20 hover:shadow-subtle transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] font-bold uppercase py-0.5 px-2 rounded-md bg-brand-green-50 text-brand-green-800 border border-brand-green-100 font-mono">
                      Sector Zone 0{index + 1}
                    </span>
                    <span className="text-[11px] font-bold text-[#ca8a04] flex items-center gap-1 font-mono">
                      <Phone className="h-3 w-3" /> {kebele.phone}
                    </span>
                  </div>
                  <h4 className="font-display text-lg font-bold text-slate-800">{kebele.name[currentLang]}</h4>
                  <p className="text-slate-550 text-xs leading-relaxed">{kebele.zone[currentLang]}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                  <p className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-700 shrink-0">Coordinator:</span> {kebele.coordinator}
                  </p>
                  <p className="flex items-center gap-1.5 truncate">
                    <span className="font-bold text-slate-700 shrink-0">Office:</span> 📍 {kebele.location[currentLang]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. MAIN OFFICES VIEW (Original departments list logic) */}
      {activeTab === 'offices' && (
        <div className="grid md:grid-cols-12 gap-8 max-w-6xl mx-auto items-start">
          {/* Department Left Checklist */}
          <div className="md:col-span-5 space-y-3 select-none">
            {DEPARTMENTS_DATA.map((dept) => (
              <button
                id={`btn-dept-select-${dept.id}`}
                key={dept.id}
                onClick={() => setSelectedDept(dept.id)}
                className={`w-full text-left p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedDept === dept.id
                    ? 'border-brand-green-700 bg-brand-green-50/50 shadow-xs'
                    : 'border-slate-150 bg-white hover:bg-slate-100/50'
                }`}
              >
                <div className="space-y-1">
                  <span className="block font-display font-extrabold text-slate-800 text-sm.5 leading-snug">
                    {dept.name[currentLang]}
                  </span>
                  <span className="block text-[11px] font-bold text-slate-450 font-mono">
                    {dept.head}
                  </span>
                </div>
                <ArrowRight className={`h-4.5 w-4.5 shrink-0 transition-transform ${
                  selectedDept === dept.id ? 'text-brand-green-700 translate-x-1' : 'text-slate-450'
                }`} />
              </button>
            ))}
          </div>

          {/* Detailed Panel (Right) */}
          <div className="md:col-span-7 bg-white rounded-3xl border border-slate-150 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 bg-brand-gold-50 px-2.5 py-1 rounded-full text-brand-gold-700 text-xs font-semibold mb-2 select-none">
                  <Shield className="h-3.5 w-3.5" />
                  Official Municipal Unit
                </span>
                <h2 className="font-display text-2xl font-bold text-slate-800 tracking-tight">
                  {activeDeptData.name[currentLang]}
                </h2>
              </div>
            </div>

            {/* Mandate Items */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 select-none">
                <Sparkles className="h-4 w-4 text-brand-gold-500 shrink-0" />
                {glossary.mandateTitle[currentLang]}
              </h3>
              <ul className="space-y-3">
                {activeDeptData.mandate[currentLang].map((mand, index) => (
                  <li key={index} className="flex gap-3 text-sm.5 text-slate-600 leading-relaxed">
                    <span className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full bg-brand-green-50 text-brand-green-700 text-xs font-bold mt-0.5 select-none">
                      {index + 1}
                    </span>
                    <span>{mand}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="h-px bg-slate-100 my-6"></div>

            {/* Contact Details pane */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider select-none">
                {glossary.contactTitle[currentLang]}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 p-4 bg-slate-50/50 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{glossary.contactHead[currentLang]}</span>
                  <p className="font-bold text-slate-800 text-sm">{activeDeptData.head}</p>
                </div>

                <div className="rounded-2xl border border-slate-100 p-4 bg-slate-50/50 space-y-1.5 flex flex-col justify-center font-mono text-[11.5px] text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                    <a href={`mailto:${activeDeptData.email}`} className="hover:text-brand-green-700 transition-colors underline">{activeDeptData.email}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                    <a href={`tel:${activeDeptData.phone}`} className="hover:text-brand-green-700 transition-colors">{activeDeptData.phone}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>{activeDeptData.hours}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
