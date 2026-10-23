import React, { useState } from 'react';
import {
  Award, MapPin, ChevronRight, X, Mail, Phone, Globe,
  Briefcase, GraduationCap
} from 'lucide-react';
import { Language } from '../../../types';

interface CompactLeadershipSpotlightProps {
  currentLang?: Language;
  onNavigateToTab?: (tabId: string, itemSubId?: string | null) => void;
}

export default function CompactLeadershipSpotlight({ currentLang = 'en', onNavigateToTab }: CompactLeadershipSpotlightProps) {
  const [showFullProfile, setShowFullProfile] = useState(false);

  const translations = {
    en: {
      title: 'Leadership Spotlight',
      subtitle: 'City Administrator',
      name: 'Nazif',
      role: 'City Administrator',
      quote: '"Committed to excellence, focused on progress, dedicated to our community\'s success."',
      stats: [
        { label: 'Projects', value: '3+' },
        { label: 'Approval', value: '98%' },
        { label: 'Woredas', value: '21' },
        { label: 'Years', value: '2020' }
      ],
      bio: 'Leading transformative initiatives in infrastructure, education, and economic development across Agaro City. A visionary administrator dedicated to sustainable growth and community welfare.',
      viewProfile: 'View Full Profile',
      modalTitle: 'Nazif - Full Profile',
      contact: 'Contact Information',
      email: 'tijani.nasir@jimmazone.gov.et',
      phone: '+251 911 234 567',
      website: 'www.jimmazone.gov.et',
      experience: 'Experience',
      exp1: 'City Administrator - Agaro City (2020 - Present)',
      exp2: 'Deputy Administrator - Agaro City (2016 - 2020)',
      exp3: 'Director of Planning - Oromia Regional State (2010 - 2016)',
      education: 'Education',
      edu1: 'PhD in Public Administration - Addis Ababa University',
      edu2: 'Masters in Development Economics - Jimma University',
      edu3: 'Bachelors in Economics - Haramaya University',
      achievements: 'Key Achievements',
      achievementsList: [
        'Led 15+ major infrastructure projects across 21 woredas',
        'Improved education access by 40% through 50 new schools',
        'Increased agricultural productivity by 35% through modern farming initiatives',
        'Successfully implemented digital governance in 80% of government offices'
      ]
    },
    om: {
      title: 'Hooggansa Joornootaa',
      subtitle: 'Bulchaa Magaalaa',
      name: 'Nazif',
      role: 'Bulchaa Magaalaa',
      quote: '"Qulqullinaaf of kennuu, jabaachuuf xiyyeeffachuu, milkaa\'ina ummataaf of kennuu."',
      stats: [
        { label: 'Meeshaalee', value: '3+' },
        { label: 'Mirkaneessa', value: '98%' },
        { label: 'Aanaalee', value: '21' },
        { label: 'Waggaa', value: '2020' }
      ],
      bio: 'Misooma bu\'uuraa, barnootaa, fi misooma dinagdee Magaalaa Agaroo keessatti geggeessuu. Bulchaa argannoon miseensaa guddina ittifufaa fi fayyuummataaf of kenne.',
      viewProfile: 'Profaayilii Guutuu Ilaali',
      modalTitle: 'Nazif - Profaayilii Guutuu',
      contact: 'Odeeffannoo Quunnamtii',
      email: 'tijani.nasir@jimmazone.gov.et',
      phone: '+251 911 234 567',
      website: 'www.jimmazone.gov.et',
      experience: 'Muuxannoo',
      exp1: 'Bulchaa Magaalaa - Magaalaa Agaroo (2020 - Amma)',
      exp2: 'Gargaaraa Bulchaa - Magaalaa Agaroo (2016 - 2020)',
      exp3: 'Akaakaa Karooraa - Naannoo Oromiyaa (2010 - 2016)',
      education: 'Barnoota',
      edu1: 'PhD Hawaasa Bulchiinsa - Yuunivarsiitii Finfinnee',
      edu2: 'Masters Dinagdee Misooma - Yuunivarsiitii Jimmaa',
      edu3: 'Bachelors Dinagdee - Yuunivarsiitii Haramayaa',
      achievements: 'Milkaa\'ina Gurguddoo',
      achievementsList: [
        'Meeshaalee bu\'uuraa 15+ aanaalee 21 keessatti geggeessuu',
        'Barnoota 40% kan 50 mana barumsaa haaraa jedhan karaa dabaluu',
        'Oomisha qonnaa 35% karaa misooma qonnaa haaraa dabaluu',
        'Bulchiinsaa dijitaalaa ofiisoota 80% keessatti hojii irra oolchuu'
      ]
    },
    am: {
      title: 'የአመራር ትኩረት',
      subtitle: 'የከተማ አስተዳዳሪ',
      name: 'ናዚፍ',
      role: 'የከተማ አስተዳዳሪ',
      quote: '"ለልህቀት የተገዛ፣ ለእድገት ያተኮረ፣ ለህብረተሰባችን ስኬት የተሰጠ።"',
      stats: [
        { label: 'ፕሮጀክቶች', value: '3+' },
        { label: 'ማረጋገጫ', value: '98%' },
        { label: 'ወረዳዎች', value: '21' },
        { label: 'አመታት', value: '2020' }
      ],
      bio: 'በአጋሮ ከተማ በመሠረተ ልማት፣ በትምህርት እና በኢኮኖሚ ልማት ላይ ለውጥ አራማጅ ተግባራትን በመምራት ላይ። ለዘላቂ እድገት እና ለህብረተሰብ ደህንነት የተሰጠ ታይቶ የማያውቅ አስተዳዳሪ።',
      viewProfile: 'ሙሉ መገለጫ ይመልከቱ',
      modalTitle: 'ናዚፍ - ሙሉ መገለጫ',
      contact: 'የመገናኛ መረጃ',
      email: 'tijani.nasir@jimmazone.gov.et',
      phone: '+251 911 234 567',
      website: 'www.jimmazone.gov.et',
      experience: 'ልምድ',
      exp1: 'የከተማ አስተዳዳሪ - አጋሮ ከተማ (2020 - አሁን)',
      exp2: 'ምክትል አስተዳዳሪ - አጋሮ ከተማ (2016 - 2020)',
      exp3: 'የእቅድ ዳይሬክተር - ኦሮሚያ ክልል (2010 - 2016)',
      education: 'ትምህርት',
      edu1: 'የፒኤችዲ በህዝብ አስተዳደር - አዲስ አበባ ዩኒቨርሲቲ',
      edu2: 'የማስተርስ በልማት ኢኮኖሚክስ - ጅማ ዩኒቨርሲቲ',
      edu3: 'የባችለር በኢኮኖሚክስ - ሀረማያ ዩኒቨርሲቲ',
      achievements: 'ቁልፍ ስኬቶች',
      achievementsList: [
        'በ21 ወረዳዎች ውስጥ 15+ ዋና ዋና የመሠረተ ልማት ፕሮጀክቶችን መርቷል',
        'በ50 አዳዲስ ትምህርት ቤቶች የትምህርት ተደራሽነትን በ40% አሻሽሏል',
        'በዘመናዊ የግብርና ልማት ተነሳሽነቶች የግብርና ምርታማነትን በ35% ጨምሯል',
        'በ80% የመንግስት ቢሮዎች ውስጥ ዲጂታል አስተዳደርን በተሳካ ሁኔታ ተግባራዊ አድርጓል'
      ]
    }
  };

  const t = translations[currentLang] || translations.en;

  const handleViewProfile = () => {
    if (onNavigateToTab) {
      onNavigateToTab('departments', 'administrator');
      return;
    }

    setShowFullProfile(true);
  };

  const profileImages = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=600&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=600&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=600&fit=crop&crop=face'
  ];

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transition-all hover:shadow-2xl">
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 px-6 py-3">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Award className="h-4 w-4" />
            <span>{t.title}</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/5 relative bg-emerald-50">
            <div className="relative h-80 md:h-full min-h-[320px]">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=face"
                alt={t.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${t.name.replace(' ', '+')}&size=600&background=064E3B&color=ffffff&bold=true`;
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
                <div className="text-white">
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">{t.subtitle}</p>
                  <h3 className="text-xl font-bold">{t.name}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-3/5 p-6 md:p-8">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{t.name}</h2>
                <p className="text-emerald-600 font-medium flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {t.role}
                </p>
              </div>

              <p className="text-slate-600 text-sm italic leading-relaxed bg-emerald-50/50 p-3 rounded-lg border-l-4 border-emerald-600">
                {t.quote}
              </p>

              <div className="grid grid-cols-4 gap-2">
                {t.stats.map((stat, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-lg px-3 py-2.5 text-center border border-slate-100">
                    <div className="text-lg font-bold text-emerald-700">{stat.value}</div>
                    <div className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>

              <p className="text-slate-600 text-sm leading-relaxed">
                {t.bio}
              </p>

              <button
                onClick={handleViewProfile}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg group"
              >
                <span>{t.viewProfile}</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showFullProfile && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-black/70 backdrop-blur-sm"
              onClick={() => setShowFullProfile(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 px-6 py-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-400" />
                  {t.modalTitle}
                </h3>
                <button
                  onClick={() => setShowFullProfile(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 max-h-[80vh] overflow-y-auto">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="grid grid-cols-2 gap-3">
                      {profileImages.map((img, idx) => (
                        <div key={idx} className={`${idx === 0 ? 'col-span-2' : ''} rounded-lg overflow-hidden bg-slate-100`}>
                          <img
                            src={img}
                            alt={`${t.name} profile ${idx + 1}`}
                            className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${t.name.replace(' ', '+')}&size=400&background=064E3B&color=ffffff&bold=true`;
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-emerald-600" />
                        {t.contact}
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2 text-slate-600">
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          {t.email}
                        </p>
                        <p className="flex items-center gap-2 text-slate-600">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          {t.phone}
                        </p>
                        <p className="flex items-center gap-2 text-slate-600">
                          <Globe className="h-3.5 w-3.5 text-slate-400" />
                          {t.website}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-emerald-600" />
                        {t.experience}
                      </h4>
                      <ul className="space-y-1.5 text-sm text-slate-600">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600 mt-1">•</span>
                          <span>{t.exp1}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600 mt-1">•</span>
                          <span>{t.exp2}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600 mt-1">•</span>
                          <span>{t.exp3}</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-emerald-600" />
                        {t.education}
                      </h4>
                      <ul className="space-y-1.5 text-sm text-slate-600">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600 mt-1">•</span>
                          <span>{t.edu1}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600 mt-1">•</span>
                          <span>{t.edu2}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600 mt-1">•</span>
                          <span>{t.edu3}</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Award className="h-4 w-4 text-emerald-600" />
                        {t.achievements}
                      </h4>
                      <ul className="space-y-1.5 text-sm text-slate-600">
                        {t.achievementsList.map((achievement, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-600 mt-1">✓</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setShowFullProfile(false)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
