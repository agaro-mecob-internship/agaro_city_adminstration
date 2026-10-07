import React, { useState, useEffect } from 'react';
import { MapPin, Award, Navigation, Leaf, Landmark, Target, ArrowRight, Star } from 'lucide-react';
import { Language } from '../types';

interface AboutViewProps {
  currentLang: Language;
  initialSubTab?: string | null;
  onSubTabChange?: (tabId: string) => void;
}

const STATS = [
  { item: { en: 'Population', om: 'Baay\'ina Uummataa', am: 'የሕዝብ ቁጥር' }, value: '50,500+' },
  { item: { en: 'Kebeles', om: 'Goxaxxeewwan', am: 'ቀበሌዎች' }, value: '9 Kebeles' },
  { item: { en: 'Elevation', om: 'Olka\'iinsa Lafa', am: 'ከፍታ' }, value: '1,560 meters' },
  { item: { en: 'Primary Export', om: 'Oomisha Gurguddo', am: 'ዋና ምርት' }, value: 'Organic Arabica Coffee' }
];

export default function AboutView({ currentLang, initialSubTab, onSubTabChange }: AboutViewProps) {
  const [activeTab, setActiveTab] = useState<'history' | 'structure' | 'vision'>('history');

  useEffect(() => {
    if (initialSubTab && ['history', 'structure', 'vision'].includes(initialSubTab)) {
      setActiveTab(initialSubTab as any);
    }
  }, [initialSubTab]);

  const handleTabChange = (tab: 'history' | 'structure' | 'vision') => {
    setActiveTab(tab);
    if (onSubTabChange) {
      onSubTabChange(tab);
    }
  };

  const contentDict = {
    title: {
      en: 'About Agaro City Administration',
      om: 'Bulchiinsa Magaalaa Aggaaroo',
      am: 'ስለ አጋሮ ከተማ አስተዳደር'
    },
    subtitle: {
      en: 'Explore the legacy of southwestern Oromia’s trade capital, from its Oromo Kingdom roots to a digitized public administration.',
      om: 'Seenaa handhuura Oromiyaa dhihaa daldala bunaatiifi caasaa bulchiinsa ammayyaa keenya asitti gamaggamaa.',
      am: 'ከቀደሙት የኦሮሞ መንግስታት ጀምሮ እስከ ዘመናዊው ዲጂታል የአገልግሎት ማዕከል ድረስ ያለውን የአጋሮን ጥንታዊ ታሪክ ይወቁ።'
    },
    historyTab: {
      en: 'History & Location',
      om: 'Seenaafi Teessuma',
      am: 'ታሪክና መገኛ'
    },
    structureTab: {
      en: 'Structure',
      om: 'Caasaa Magaalaa',
      am: 'ድርጅታዊ መዋቅር'
    },
    visionTab: {
      en: 'Vision & Mission',
      om: 'Mul’ataafi Ergama',
      am: 'ራዕይና ተልዕኮ'
    }
  };

  return (
    <section id="about-section" className="space-y-12 py-6 font-sans">
      {/* Upper header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="font-display text-3.5xl font-extrabold text-slate-850 tracking-tight leading-tight md:text-4xl">
          {contentDict.title[currentLang]}
        </h1>
        <p className="text-base text-slate-650 leading-relaxed max-w-2xl mx-auto">
          {contentDict.subtitle[currentLang]}
        </p>
        <div className="h-1.5 w-24 bg-brand-gold-500 mx-auto rounded-full"></div>
      </div>

      {/* Grid of Key Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 max-w-5xl mx-auto">
        {STATS.map((stat, idx) => (
          <div key={idx} className="bg-white border border-slate-150 p-5 rounded-2xl text-center shadow-subtle hover:border-brand-green-500/20 transition-all">
            <span className="block text-3xl font-display font-black text-brand-green-700 mb-1">{stat.value}</span>
            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">{stat.item[currentLang]}</span>
          </div>
        ))}
      </div>

      {/* Modern Horizontal Tabs bar */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="flex border-b border-slate-100 bg-slate-50 flex-wrap">
          <button
            id="tab-about-history"
            onClick={() => handleTabChange('history')}
            className={`flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 px-6 py-4 text-xs.5 font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'border-brand-green-700 text-brand-green-700 bg-white shadow-inner-top'
                : 'border-transparent text-slate-600 hover:text-brand-green-700 hover:bg-slate-100/40'
            }`}
          >
            <MapPin className="h-4 w-4 shrink-0 text-brand-green-600" />
            {contentDict.historyTab[currentLang]}
          </button>
          
          <button
            id="tab-about-structure"
            onClick={() => handleTabChange('structure')}
            className={`flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 px-6 py-4 text-xs.5 font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'structure'
                ? 'border-brand-green-700 text-brand-green-700 bg-white shadow-inner-top'
                : 'border-transparent text-slate-600 hover:text-brand-green-700 hover:bg-slate-100/40'
            }`}
          >
            <Landmark className="h-4 w-4 shrink-0 text-brand-green-600" />
            {contentDict.structureTab[currentLang]}
          </button>

          <button
            id="tab-about-vision"
            onClick={() => handleTabChange('vision')}
            className={`flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 px-6 py-4 text-xs.5 font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'vision'
                ? 'border-brand-green-700 text-brand-green-700 bg-white shadow-inner-top'
                : 'border-transparent text-slate-600 hover:text-brand-green-700 hover:bg-slate-100/40'
            }`}
          >
            <Target className="h-4 w-4 shrink-0 text-brand-green-600" />
            {contentDict.visionTab[currentLang]}
          </button>
        </div>

        {/* Tab content viewport */}
        <div className="p-6 md:p-8">
          
          {/* 1. History & Location TAB */}
          {activeTab === 'history' && (
            <div className="space-y-8">
              
              <div className="grid md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-7 space-y-5">
                  <span className="inline-flex items-center gap-1.5 bg-brand-green-50 text-brand-green-700 text-xs px-2.5 py-1 rounded-full font-bold">
                    <Award className="h-3.5 w-3.5 text-brand-gold-500" />
                    Kingdom of Gomma Capital Heritage
                  </span>
                  
                  <h3 className="font-display text-2xl font-extrabold text-slate-800 tracking-tight">
                    {currentLang === 'en' ? 'The Historic Royal Journey of Agaro' : currentLang === 'om' ? 'Seenaa Aggaaroo Handhuura Dhaala' : 'የአጋሮ ከተማ ጥንታዊ ታሪካዊ ጉዞ'}
                  </h3>
                  
                  <div className="text-slate-600 text-sm.5 leading-relaxed space-y-4">
                    <p>
                      {currentLang === 'en' 
                        ? 'Agaro (Aggaaroo) is one of the oldest and most culturally significant urban settlements in southwestern Oromia. The town has a rich historical and cultural heritage closely linked with the former Kingdom of Gomma, one of the renowned Gibe Oromo kingdoms that flourished during the nineteenth century.'
                        : currentLang === 'om'
                        ? 'Aggaaroon magaalaawwan gurguddoo bulchiinsa naannoo Oromiyaa keessatti argaman keessaa ishee tokkofi seenaa guddaa qabdudha. Seenaan magaalichaa Mootummaa Gommaa isa jaarraa Kudha-Sagaalffaa keessa saboota naannoo Gibeetiin beekamaa turee wajjin kan wal-qabatudha.'
                        : 'አጋሮ በደቡብ ምዕራብ ኦሮሚያ ካሉት ጥንታዊና በባህል እጅግ የታወቁ የከተማ ሰፈራዎች አንዷ ናት። የከተማዋ ታሪክ በባለፈው አሥራ ዘጠነኛው ክፍለ ዘመን በደመቀውና ዝነኛ በነበረው የጎማ መንግሥት (የጊቤ ኦሮሞ መንግሥታት አንዱ) ጋር በቅርብ የተቆራኘ ታሪካዊ ቅርስ አለው።'}
                    </p>
                    <p>
                      {currentLang === 'en'
                        ? 'Agaro served as the proud Royal Capital of the Kingdom of Gomma and became an important center for regional administration, trade, and cultural exchange. The kingdom played a significant role in regional politics and economic activities before its incorporation into the Ethiopian Empire during the late nineteenth century. Historical records indicate that Gomma was conquered in 1886 by Dejazmach Bashah Aboye on behalf of Emperor Menelik II.'
                        : currentLang === 'om'
                        ? 'Aggaaroon teessuma mootummaa Gommaa ta’uun tajaajilteera, kanaanis daldalaa, bulchiinsaafi wal-jijjiirraa aadaa naannoo Gibeetiif handhuura guddaa taateetti. Mootummaan kun siyaasaafi diinagdee handhuura sanii keessatti qooda guddaa erga taphateen booda gara xumura jaarraa 19ffaatti gara Naannoo Impaayera Itoophiyaatti makame. Ragaaleen seenaa akka agarsiisanitti Gommaan bara 1886tti Deejjaazmaach Baasha Aboyyeetiin handhuura mooticha Menelik II jalatti mo’amte.'
                        : 'አጋሮ የጎማ መንግሥት ዋና ከተማ ሆና ስታገለግል የኖረች ሲሆን የክልሉ አስተዳደር፣ የንግድ እና የባሪያ ገበያ የባህል ልውውጥ ወሳኝ ማዕከል ነበረች። ግዛቱ በአሥራ ዘጠነኛው ክፍለ ዘመን መገባደጃ ላይ ወደ ኢትዮጵያ ግዛት ከማካተቱ በፊት በክልሉ ፖለቲካ እና ኢኮኖሚያዊ እንቅስቃሴዎች ውስጥ ከፍተኛ ሚና ተጫውቷል። የታሪክ መዛግብት እንደሚያመለክቱት ጎማ በ1886 በደጃዝማች ባሻ አቦዬ በአፄ ሚኒሊክ ትዕዛዝ ድል ተደርጓል።'}
                    </p>
                  </div>
                </div>

                <div className="md:col-span-5 space-y-6">
                  {/* Photo Section */}
                  <div className="relative rounded-2xl overflow-hidden border border-slate-100 shadow-md">
                    <img 
                      src="/src/assets/images/agaro_landscape_1780989482675.png" 
                      alt="Agaro Highlands" 
                      className="w-full h-52 object-cover object-center filter saturate-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-4">
                      <div>
                        <span className="block font-display font-black text-white text-sm">Agaro Valley Highs</span>
                        <span className="text-brand-gold-400 text-[10px] font-bold uppercase tracking-wider">Gateway of specialty Oromo Arabica</span>
                      </div>
                    </div>
                  </div>

                  {/* Location Info Box */}
                  <div className="bg-slate-50 rounded-2xl border border-slate-150 p-5 space-y-3">
                    <h4 className="font-display font-bold text-slate-800 text-sm.5 flex items-center gap-2">
                      <Navigation className="h-4.5 w-4.5 text-brand-gold-500 shrink-0" />
                      {currentLang === 'en' ? 'Geographical Location' : currentLang === 'om' ? 'Teessuma Lafa Magaalaa' : 'ጂኦግራፊያዊ አቀማመጥ'}
                    </h4>
                    <p className="text-slate-600 text-xs.5 leading-relaxed">
                      {currentLang === 'en'
                        ? 'Agaro lies approximately 390 kilometers southwest of Addis Ababa by road, and sits at an elevation of around 1,560 meters above sea level (with high ridges scaling up to 1,675m). Strategically nesting in the highly fertile Jimma Zone of southwestern Oromia, it serves as an intersection of specialty trade caravans.'
                        : currentLang === 'om'
                        ? 'Aggaaroon karaa konkolaataa Finfinneerraa gara dhihaatti kilomeetira 390 fageenyarratti argamti, lafarras garba olitti meetira 1,560 olka’a. Jimma Zoonii keessatti argamuun daldala bunaafi oomishoota mukkeenitii gurguddoo dhihaafi jiddugala biyyaa wal quunnamsiis.'
                        : 'አጋሮ በመንገድ ከአዲስ አበባ በስተደቡብ ምዕራብ በግምት 390 ኪሎ ሜትር ርቀት ላይ ትገኛለች። በባህር ጠለል በላይ በግምት 1,560 ሜትር ከፍታ ላይ የተቀመጠች ሲሆን በኦሮሚያ ክልል ጅማ ዞን ለም በሆነው የእርሻ ቀበቶ ውስጥ የምትገኝ ልዩ የንግድ መስመር ናት።'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Coffee culture addition */}
              <div className="border-t border-slate-100 pt-6 grid sm:grid-cols-2 gap-6">
                <div className="flex gap-4 items-start">
                  <div className="h-10 w-10 shrink-0 bg-amber-50 rounded-xl flex items-center justify-center text-amber-700">
                    <Leaf className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm.5">{currentLang === 'en' ? 'Wild Undergrowth Arabica' : currentLang === 'om' ? 'Buna Bosona Gommaa' : 'የጎማ ዱር ቡና ዝርያ'}</h5>
                    <p className="text-slate-550 text-xs leading-relaxed mt-1">Historically, the Gomma forests hosted some of the first wild varieties of coffee beans, cementing the zone as a global biodiversity sanctuary.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="h-10 w-10 shrink-0 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                    <Star className="h-5 w-5 fill-current" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm.5">{currentLang === 'en' ? 'Oldest Co-Ops Roots' : currentLang === 'om' ? 'Hundeeffama Federeeshinii Bunaa' : 'የመጀመሪያው ህብረት ስራ ማህበር'}</h5>
                    <p className="text-slate-550 text-xs leading-relaxed mt-1">First washing stations began in this valley over 70 years ago, creating the model of high-quality wet processing for African exports.</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* 2. ORGANIZATIONAL STRUCTURE TAB */}
{activeTab === 'structure' && (
  <div className="space-y-6">
    <div className="max-w-2xl">
      <h3 className="font-display text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
        {currentLang === 'en' ? 'City Governance Structure Map' : currentLang === 'om' ? 'Caasaa Gurmaa\'insaa Magaalaa' : 'የከተማው የአስተዳደር መዋቅር ካርታ'}
      </h3>
      <p className="text-sm text-slate-500 mt-1">
        How decentralized branches are structured legally to serve the 9 core Kebeles.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
      
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs hover:shadow-md hover:border-brand-green-300 transition-all">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-brand-green-50 text-brand-green-700 flex items-center justify-center font-bold text-sm shrink-0">
            1
          </div>
          <h4 className="font-bold text-slate-800 text-sm">{currentLang === 'en' ? 'City Council' : currentLang === 'om' ? 'Marii Magaalaa' : 'የከተማው ምክር ቤት'}</h4>
        </div>
        <p className="text-slate-500 text-xs leading-relaxed pl-11">
          The supreme legislative organ comprised of democratically-elected civic residents from all nine municipal Kebeles. Passes physical budgets and city codes.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs hover:shadow-md hover:border-brand-green-300 transition-all">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-brand-green-50 text-brand-green-700 flex items-center justify-center font-bold text-sm shrink-0">
            2
          </div>
          <h4 className="font-bold text-slate-800 text-sm">{currentLang === 'en' ? 'Mayor Exec Cabinet' : currentLang === 'om' ? 'Kabinee Kantiibaa' : 'ከንቲባ አስፈፃሚ ካቢኔ'}</h4>
        </div>
        <p className="text-slate-500 text-xs leading-relaxed pl-11">
          Led directly by the Mayor. Runs day-to-day operations, organizes public works, and manages specialized bureaus (Revenues, Land, Security).
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs hover:shadow-md hover:border-brand-green-300 transition-all">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-brand-green-50 text-brand-green-700 flex items-center justify-center font-bold text-sm shrink-0">
            3
          </div>
          <h4 className="font-bold text-slate-800 text-sm">{currentLang === 'en' ? 'Kebele Desks' : currentLang === 'om' ? 'Waajjiraalee Goxaxxe' : 'የቀበሌ አስተዳደር ቢሮዎች'}</h4>
        </div>
        <p className="text-slate-500 text-xs leading-relaxed pl-11">
          Each of the 9 Kebeles maintains integrated resident helpdesks, ensuring vital record forms (resident IDs, births, deaths) are close to citizens.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs hover:shadow-md hover:border-brand-green-300 transition-all">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-brand-green-50 text-brand-green-700 flex items-center justify-center font-bold text-sm shrink-0">
            4
          </div>
          <h4 className="font-bold text-slate-800 text-sm">{currentLang === 'en' ? 'Civic Watchdog' : currentLang === 'om' ? 'Yaalii Hawaasummaa' : 'የሲቪክ ቁጥጥር ማህበር'}</h4>
        </div>
        <p className="text-slate-500 text-xs leading-relaxed pl-11">
          Collaborative panel including local organic coffee farmers, trade merchants, and cooperative representatives reviewing urban environmental plans.
        </p>
      </div>

    </div>

    {/* Visual mini structural flow representation */}
    <div className="bg-slate-50 rounded-2xl border border-slate-150 p-4 sm:p-6 flex flex-col items-center justify-center py-6 sm:py-8">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Functional Authorization Flow</span>
      <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
        <span className="px-3 py-1.5 bg-brand-green-750 text-white rounded-lg text-xs font-bold shadow-xs w-full sm:w-auto">Residents & Coffee Co-ops</span>
        <ArrowRight className="h-4 w-4 text-slate-400 rotate-90 sm:rotate-0" />
        <span className="px-3 py-1.5 bg-white border border-slate-200 text-slate-800 rounded-lg text-xs font-bold shadow-xs w-full sm:w-auto">Agaro City Council</span>
        <ArrowRight className="h-4 w-4 text-slate-400 rotate-90 sm:rotate-0" />
        <span className="px-3 py-1.5 bg-brand-gold-500 text-slate-900 rounded-lg text-xs font-bold shadow-xs w-full sm:w-auto">Mayor Kemal Jemal</span>
        <ArrowRight className="h-4 w-4 text-slate-400 rotate-90 sm:rotate-0" />
        <span className="px-3 py-1.5 bg-slate-900 text-slate-100 rounded-lg text-xs font-bold shadow-xs w-full sm:w-auto">Kebele Local Desks</span>
      </div>
    </div>
  </div>
)}




          {/* 4. VISION AND MISSION TAB */}
          {activeTab === 'vision' && (
            <div className="grid md:grid-cols-2 gap-8 items-stretch pt-4">
              
              {/* Vision Card */}
              <div className="bg-brand-green-50/40 rounded-2xl border border-brand-green-150 p-6 md:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="h-11 w-11 rounded-xl bg-brand-green-700 text-white flex items-center justify-center font-bold">
                    <Star className="h-5 w-5 fill-current text-white" />
                  </div>
                  
                  <h4 className="font-display text-2xl font-black text-brand-green-800">
                    {currentLang === 'en' ? 'Our Strategic Vision' : currentLang === 'om' ? 'Mul’ata Keenya' : 'ስትራቴጂካዊ ራዕያችን'}
                  </h4>
                  
                  <p className="text-slate-700 text-sm.5 leading-relaxed">
                    {currentLang === 'en'
                      ? 'To establish Agaro as the gold standard of organic trade, regional coffee-heritage preservation, and digital e-government integration in East Africa by 2030, ensuring high quality of life, environmental safety, and shared prosperity for all residents.'
                      : currentLang === 'om'
                      ? 'Bara 2030tti Aggaaroon gabaa buna dabalatee, misooma hawaas-diinagdee hundagaleessaafi tajaajila mootummaa dijitaalaa handhuura baha Afrikaa keessatti fakkii filatamaa gochuu, jireenya jiraattota hundaa foyyeessuuf.'
                      : 'እ.ኤ.አ በ2030 አጋሮን በምስራቅ አፍሪካ የኦርጋኒክ ንግድ፣ የአካባቢ ቡና ቅርስ ጥበቃ እና የዲጂታል ኢ-አገልግሎቶች መሪ ከተማ ማድረግ፤ ለሁሉም ነዋሪዎች ምቹ ኑሮን፣ አካባቢያዊ ደህንነትን እና የጋራ ብልጽግናን ማረጋገጥ።'}
                  </p>
                </div>
                
                <div className="text-[10px] font-bold text-brand-green-700 uppercase tracking-widest font-mono">
                  Vision Target: 2030 Achievement Frame
                </div>
              </div>

              {/* Mission Card */}
              <div className="bg-brand-gold-50/30 rounded-2xl border border-[#fef08a] p-6 md:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="h-11 w-11 rounded-xl bg-brand-gold-500 text-slate-900 flex items-center justify-center font-bold">
                    <Target className="h-5 w-5" />
                  </div>
                  
                  <h4 className="font-display text-2xl font-black text-brand-gold-800">
                    {currentLang === 'en' ? 'Our Operational Mission' : currentLang === 'om' ? 'Ergama Keenya' : 'አስፈፃሚ ተልዕኳችን'}
                  </h4>
                  
                  <p className="text-slate-700 text-sm.5 leading-relaxed">
                    {currentLang === 'en'
                      ? 'To deliver transparent, decentralized, and e-service-empowered city administration through modern infrastructure investment, sustainable coffee forestry stewardship, proactive citizen care, and collaborative economic alliances.'
                      : currentLang === 'om'
                      ? 'Hojii tajaajila bulchiinsa magaalaa iftoomina ragaa qabuu, tajaajiloota e-portal humna-namaa quunnamuufi misooma qaxxaamura bunaa bosonaa haala mirgaafi hiyyeessaaf mijatuun dhiyeessuu.'
                      : 'ዘመናዊ መሠረተ ልማቶችን በመገንባት፣ ዘላቂ የቡና ደን ጥበቃን በመንከባከብ፣ ቀልጣፋ እና ግልጽነት ያለው የዲጂታል አገልግሎትን በማቅረብ እና ከንግዱ ማህበረሰብ ጋር በመተባበር ነዋሪዎችን በቅንነት ማገልገል።'}
                  </p>
                </div>
                
                <div className="text-[10px] font-bold text-brand-gold-800 uppercase tracking-widest font-mono">
                  Daily Execution Oath Of Municipal Staff
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </section>
  );
}
