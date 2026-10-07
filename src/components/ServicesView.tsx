import React, { useEffect, useState } from 'react';
import { Language } from '../types';
import { 
  MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, 
  Send, Youtube, ChevronRight, Crown, X,
  Eye, ShieldCheck, Users, Smartphone,
  Award, CheckCircle, Building2, Landmark, TrendingUp, 
  FileText, Calendar,
  Wrench, BarChart2, Briefcase, MessageCircle,
  Menu, Home, Info, Server, ClipboardList, Newspaper,
  Ticket, Building, ClipboardCheck, DollarSign, UserCheck,
  FileCheck, CreditCard, Fingerprint, BadgeCheck,
  User, Shield, Target, Coffee
} from 'lucide-react';

interface ServicesViewProps {
  currentLang: Language;
}

const API_BASE_URL = 'http://localhost/agaro/php_export';

// Service data with requirements
const servicesData = [
  { 
    id: 'buluuta', 
    name: 'Passport Registration', 
    icon: 'Briefcase', 
    queue: 5, 
    description: 'Passport and travel document services',
    requirements: [
      'National ID (Kebele ID)',
      'Birth Certificate',
      'Service Fee Payment Receipt',
      'Passport Size Photo (4x6)',
      'Completed Application Form'
    ],
    office: 'Room 21, 2nd Floor'
  },
  { 
    id: 'adda-adda', 
    name: 'Administrative Services', 
    icon: 'Phone', 
    queue: 3, 
    description: 'Administrative and governance services',
    requirements: [
      'Letter of Request',
      'Valid ID Document',
      'Supporting Documents',
      'Service Fee Payment Receipt'
    ],
    office: 'Room 15, 2nd Floor'
  },
  { 
    id: 'kennu', 
    name: 'Utility Support Services', 
    icon: 'MessageCircle', 
    queue: 2, 
    description: 'Water and utility support services',
    requirements: [
      'Utility Bill (Previous Month)',
      'Valid ID Document',
      'Property Ownership Proof',
      'Service Application Form'
    ],
    office: 'Room 8, 1st Floor'
  },
  { 
    id: 'bulchimisa', 
    name: 'Revenue and Payment Services', 
    icon: 'Wrench', 
    queue: 4, 
    description: 'Revenue and payment services',
    requirements: [
      'Tax Identification Number (TIN)',
      'Payment Schedule',
      'Business Registration Certificate',
      'Previous Payment Receipt'
    ],
    office: 'Room 12, 1st Floor'
  },
  { 
    id: 'lufaa', 
    name: 'Land Services', 
    icon: 'BarChart2', 
    queue: 1, 
    description: 'Land and property services',
    requirements: [
      'Land Title Deed',
      'Property Survey Map',
      'Valid ID Document',
      'Land Transfer Application'
    ],
    office: 'Room 5, Ground Floor'
  },
  { 
    id: 'beanki', 
    name: 'Banking Services', 
    icon: 'Building2', 
    queue: 0, 
    description: 'Banking and financial services',
    requirements: [
      'Bank Account Details',
      'Valid ID Document',
      'Transaction Authorization',
      'Service Fee Payment Receipt'
    ],
    office: 'Room 3, Ground Floor'
  },
  { 
    id: 'moculumiyaa', 
    name: 'Tax Payment Services', 
    icon: 'Landmark', 
    queue: 3, 
    description: 'Government payment services',
    requirements: [
      'Tax Identification Number (TIN)',
      'Income Declaration',
      'Previous Tax Clearance',
      'Payment Schedule'
    ],
    office: 'Room 18, 2nd Floor'
  },
  { 
    id: 'daladaa', 
    name: 'Driving License Services', 
    icon: 'Building2', 
    queue: 2, 
    description: 'Driving license and vehicle services',
    requirements: [
      'Valid National ID',
      'Medical Certificate',
      'Driving School Certificate',
      'Passport Size Photo (4x6)',
      'Written Test Result'
    ],
    office: 'Room 25, 3rd Floor'
  },
  { 
    id: 'investiment', 
    name: 'Investment Services', 
    icon: 'TrendingUp', 
    queue: 1, 
    description: 'Investment and business development',
    requirements: [
      'Business Plan',
      'Investment Proposal',
      'Valid ID Document',
      'Certificate of Incorporation',
      'Feasibility Study'
    ],
    office: 'Room 30, 3rd Floor'
  },
  { 
    id: 'saradotata', 
    name: 'Document Registration', 
    icon: 'FileText', 
    queue: 0, 
    description: 'Document registration services',
    requirements: [
      'Original Document',
      'Copy of Document',
      'Valid ID Document',
      'Registration Fee Payment'
    ],
    office: 'Room 10, 1st Floor'
  },
  { 
    id: 'qayyumaa', 
    name: 'Professional Licensing', 
    icon: 'Wrench', 
    queue: 2, 
    description: 'Professional and construction licensing',
    requirements: [
      'Professional Certificate',
      'Valid ID Document',
      'Experience Letter',
      'License Application Form',
      'Service Fee Payment'
    ],
    office: 'Room 22, 2nd Floor'
  },
  { 
    id: 'gahumisa', 
    name: 'Competency Verification', 
    icon: 'Users', 
    queue: 1, 
    description: 'Competency verification services',
    requirements: [
      'Educational Certificates',
      'Work Experience Letter',
      'Valid ID Document',
      'Verification Application Form'
    ],
    office: 'Room 28, 3rd Floor'
  },
  { 
    id: 'ceejata', 
    name: 'Transport Services', 
    icon: 'Calendar', 
    queue: 0, 
    description: 'Transport and vehicle services',
    requirements: [
      'Vehicle Registration Certificate',
      'Insurance Document',
      'Valid Driving License',
      'Transport Permit Application'
    ],
    office: 'Room 7, Ground Floor'
  },
];

// Icon mapping
const iconMap: Record<string, any> = {
  Briefcase: Briefcase,
  Phone: Phone,
  MessageCircle: MessageCircle,
  Wrench: Wrench,
  BarChart2: BarChart2,
  Building2: Building2,
  Landmark: Landmark,
  TrendingUp: TrendingUp,
  FileText: FileText,
  Users: Users,
  Calendar: Calendar
};

export default function ServicesView({ currentLang }: ServicesViewProps) {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [serviceProfiles, setServiceProfiles] = useState<Record<string, any>>({});

  useEffect(() => {
    const loadServiceProfiles = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api_media.php`);
        const result = await response.json();
        if (result.success) {
          setServiceProfiles((result.government || []).reduce((profiles: Record<string, any>, profile: any) => {
            profiles[profile.asset_key] = profile;
            return profiles;
          }, {}));
        }
      } catch (error) {
        console.error('Error loading service profiles:', error);
      }
    };

    loadServiceProfiles();
  }, []);

  const getServiceImage = (key: string, fallback: string) => {
    const image = serviceProfiles[key]?.image;
    return image ? (image.startsWith('http') ? image : `${API_BASE_URL}/${image}`) : fallback;
  };

  const dict = {
    title: {
      en: 'Agaro Mesob Center Services',
      om: 'Tajaajila Mesob Center Agaro',
      am: 'የአጋሮ መሶብ ማእከል አገልግሎቶች'
    },
    subtitle: {
      en: 'Your One-Stop Government Service Center',
      om: 'Kessaa Tajaajila Mootummaa Tokkoo',
      am: 'አንድ ማቆሚያ የመንግስት አገልግሎት ማእከል'
    },
    description: {
      en: 'Access all government services in one place - Passport, Telecom, Utilities, and more. Experience efficient, transparent, and citizen-friendly services.',
      om: 'Tajaajila mootummaa hunda bakka tokkoo keessa argadhaa - Paaspoortii, Telecom, Utilities, fi kkf. Tajaajila qaamaa, ifa, fi hawaasa-feedhaa',
      am: 'ሁሉንም የመንግስት አገልግሎቶች በአንድ ቦታ ያግኙ - ፓስፖርት፣ ቴሌኮም፣ መገልገያዎች እና ሌሎችም። ቀልጣፋ፣ ግልጽ እና ለዜጎች ተስማሚ የሆኑ አገልግሎቶችን ይለማመዱ።'
    },
    queueManagement: {
      en: 'Queue Management',
      om: 'Bulchiinsa Tarkaanfaa',
      am: 'የወረፋ አስተዳደር'
    },
    whyChoose: {
      en: 'Why Agaro Mesob Center?',
      om: 'Maaliif Mesob Center Agaro?',
      am: 'ለምን አጋሮ መሶብ ማእከል?'
    },
    whyChooseDesc: {
      en: 'We are committed to providing the best government services with excellence',
      om: 'Tajaajila mootummaa caalaa gaarii ta\'e deggersaan kennuuf of qabna',
      am: 'ምርጥ የመንግስት አገልግሎቶችን በልቀት ለመስጠት ቁርጠኞች ነን'
    },
    aboutTitle: {
      en: 'About Agaro Mesob Center',
      om: 'Waa\'ee Mesob Center Agaro',
      am: 'ስለ አጋሮ መሶብ ማእከል'
    },
    aboutDesc1: {
      en: 'Agaro Mesob Center is a modern one-stop government service center dedicated to providing efficient, transparent, and citizen-friendly services.',
      om: 'Mesob Center Agaro bakka tajaajila mootummaa tokkoo ammayyaa ta\'e kan tajaajila qaamaa, ifa, fi hawaasa-feedhaa kennuuf of kenne',
      am: 'አጋሮ መሶብ ማእከል ቀልጣፋ፣ ግልጽ እና ለዜጎች ተስማሚ የሆኑ አገልግሎቶችን ለመስጠት የተዘጋጀ ዘመናዊ አንድ ማቆሚያ የመንግስት አገልግሎት ማእከል ነው።'
    },
    aboutDesc2: {
      en: 'Our mission is to simplify government service delivery by bringing multiple services under one roof, reducing wait times, and enhancing the citizen experience through technology.',
      om: 'Dhimma keenya tajaajila mootummaa salphisuuf tajaajila hedduu mana tokkoo keessa fiduun, yeroo eeguu hir\'isuun, fi muuxannoo hawaasaa teeknooloojiidhaan fooyyessuudha.',
      am: 'ተልዕኮአችን በርካታ አገልግሎቶችን በአንድ ጣሪያ ስር በማምጣት፣ የመጠበቂያ ጊዜን በመቀነስ እና የዜጎችን ልምድ በቴክኖሎጂ በማሳደግ የመንግስት አገልግሎት አሰጣጥን ማቃለል ነው።'
    },
    ourVision: {
      en: 'Our Vision',
      om: 'Mul\'ata Keenya',
      am: 'ራዕያችን'
    },
    ourMission: {
      en: 'Our Mission',
      om: 'Ergaa Keenya',
      am: 'ተልዕኮአችን'
    },
    visionText: {
      en: 'To be the leading government service center in Ethiopia',
      om: 'Itoophiyaatti bakka tajaajila mootummaa sadarkaa jalqabaa ta\'uuf',
      am: 'በኢትዮጵያ ውስጥ መሪ የመንግስት አገልግሎት ማእከል ለመሆን'
    },
    missionText: {
      en: 'To provide accessible, efficient, and quality government services',
      om: 'Tajaajila mootummaa argamu, qaamaa, fi qulqullina qabu kennuuf',
      am: 'ተደራሽ፣ ቀልጣፋ እና ጥራት ያላቸውን የመንግስት አገልግሎቶች ለመስጠት'
    },
    contactUs: {
      en: 'Get In Touch',
      om: 'Nu Qunnamaa',
      am: 'አግኙን'
    },
    contactDesc: {
      en: 'Have questions or need assistance? We\'re here to help!',
      om: 'Gaaffii qabduu yookaan gargaarsa barbaaddaa? Nu as turuuf!',
      am: 'ጥያቄዎች አሉዎት ወይም እርዳታ ይፈልጋሉ? እኛ ለመርዳት እዚህ ነን!'
    },
    address: {
      en: 'Address',
      om: 'Teessoo',
      am: 'አድራሻ'
    },
    phone: {
      en: 'Phone',
      om: 'Bilbila',
      am: 'ስልክ'
    },
    email: {
      en: 'Email',
      om: 'Imeelii',
      am: 'ኢሜይል'
    },
    workingHours: {
      en: 'Working Hours',
      om: 'Yeroo Hojii',
      am: 'የስራ ሰዓቶች'
    },
    followUs: {
      en: 'Follow Us',
      om: 'Nu Hordofaa',
      am: 'ተከተሉን'
    },
    quickLinks: {
      en: 'Quick Links',
      om: 'Kuusaa Dafaa',
      am: 'ፈጣን አገናኞች'
    },
    support: {
      en: 'Support',
      om: 'Gargaarsa',
      am: 'ድጋፍ'
    },
    home: {
      en: 'Home',
      om: 'Mana',
      am: 'መነሻ'
    },
    services: {
      en: 'Services',
      om: 'Tajaajila',
      am: 'አገልግሎቶች'
    },
    about: {
      en: 'About',
      om: 'Waa\'ee',
      am: 'ስለ'
    },
    contact: {
      en: 'Contact',
      om: 'Quunnamtii',
      am: 'እውቂያ'
    },
    queue: {
      en: 'Queue',
      om: 'Tarkaanfaa',
      am: 'ወረፋ'
    },
    currentQueue: {
      en: 'Current Queue:',
      om: 'Tarkaanfaa Ammaa:',
      am: 'የአሁኑ ወረፋ:'
    },
    empty: {
      en: 'Empty',
      om: 'Duwwaa',
      am: 'ባዶ'
    },
    low: {
      en: 'Low',
      om: 'Xiqqoo',
      am: 'ዝቅተኛ'
    },
    medium: {
      en: 'Medium',
      om: 'Giddu-galeessa',
      am: 'መካከለኛ'
    },
    high: {
      en: 'High',
      om: 'Olka\'aa',
      am: 'ከፍተኛ'
    },
    close: {
      en: 'Close',
      om: 'Cufi',
      am: 'ዝጋ'
    },
    ticket: {
      en: 'Ticket Number',
      om: 'Lakkoofsa Tikitii',
      am: 'የቲኬት ቁጥር'
    },
    office: {
      en: 'Office Location',
      om: 'Bakka Waajjiraa',
      am: 'የቢሮ ቦታ'
    },
    requirements: {
      en: 'Required Documents',
      om: 'Dokumentii Barbaadaman',
      am: 'የሚፈለጉ ሰነዶች'
    },
    floor: {
      en: 'Floor',
      om: 'Dira',
      am: 'ፎቅ'
    },
    room: {
      en: 'Room',
      om: 'Kutaa',
      am: 'ክፍል'
    },
    mayorTitle: {
      en: 'Administrator, Agaro Mesob Center',
      om: 'KANTIIBAA KABAJAA NAANNOO',
      am: 'የክብር ክልላዊ ከንቲባ'
    },
    mayorName: {
      en: 'Mr. Nejib Abasimel',
      om: 'Kabajamaan Nejib Abasimel',
      am: 'የክብር ጀማል አባሲመል'
    },
    mayorEmail: {
      en: 'mayor@agarocity.gov.et',
      om: 'mayor@agarocity.gov.et',
      am: 'mayor@agarocity.gov.et'
    },
    mayorAddress: {
      en: 'Admin Block, 1st Floor',
      om: 'Kutaa Bulchiinsaa, Dira 1ffaa',
      am: 'የአስተዳደር ህንፃ, 1ኛ ፎቅ'
    },
    mayorTerm: {
      en: 'Term: 2022 - present',
      om: 'Yeroo: 2022 - amma',
      am: 'የስልጣን ጊዜ: 2022 - አሁን'
    },
    municipalStrategy: {
      en: 'Administrator, Agaro Mesob Center',
      om: 'MISHOO MAGAALAA',
      am: 'የማዘጋጃ ቤት ስትራቴጂ'
    },
    executiveAddress: {
      en: 'Executive Address & Mandate',
      om: 'Haasa\'i Bulchiinsaa fi Aangoo',
      am: 'የስራ አስፈፃሚ ንግግር እና ተልዕኮ'
    },
    executiveDesc: {
      en: 'The Administrator provides leadership and coordination for the activities of Agaro Mesob Center, overseeing day-to-day operations, supporting organizational development, coordinating staff and services, and ensuring that the center effectively serves its intended community and institutional objectives.',
      om: 'Rimee Bulchiinsa Naannoo Oromiyaa jalatti, Kantiibaan guddina hawaasaa, misooma bu\'uraalee, fi furmaata e-governance dijitaalaa fayyadamuun Aggaaroo handhuura daldalaa bunaa fi daldalaa Oromiyaa lixaatti gochuuf hojjeta.',
      am: 'በኦሮሚያ ክልላዊ መንግሥት ማዕቀፍ ሥር፣ ከንቲባው የሲቪክ ልማትን፣ የመሠረተ ልማት መስፋፋትን እና የዲጂታል ኢ-መንግሥት መፍትሄዎችን በመምራት አጋሮን በደቡብ ምዕራብ ኢትዮጵያ ዋነኛ የኢንዱስትሪ ቡና እና የንግድ ማዕከል ለማድረግ ይሰራሉ።'
    },
    specialPriorities: {
      en: 'SPECIAL ADMINISTRATIVE STRATEGIC PRIORITIES',
      om: 'DURDURA SAAGANTAA BULCHIINSA ADDAA',
      am: 'ልዩ የአስተዳደር ስትራቴጂካዊ ቅድሚያ የሚሰጣቸው'
    },
    priority1: {
      en: 'Oversee the day-to-day administration, coordination, and effective operation of Agaro Mesob Center.',
      om: 'Sassabbiin oomisha bunaa olka\'aa babal\'isuu.',
      am: 'ከፍተኛ ምርት ያለውን የቡና ኤክስፖርት ሰንሰለት ማስፋት።'
    },
    priority2: {
      en: 'Coordinate center activities and services while supporting effective communication with community members and relevant stakeholders.',
      om: 'Damee deeggarsaa magaalaa gara 9 Kebeleelatti babal\'isuu.',
      am: 'የማዘጋጃ ቤት ድጋፍ ቢሮዎችን ወደ 9 ጠንካራ ቀበሌዎች ማውረድ።'
    },
    priority3: {
      en: 'Support strategic planning, resource management, partnerships, and initiatives that contribute to the sustainable development of the center.',
      om: 'Bilbila elektooroniikii 100% fi deebii hojii hawaasaa saffisaa argachuu.',
      am: '100% የኤሌክትሮኒክ ቢል አሰጣጥ እና ፈጣን የህዝብ ሥራ ምላሽ ማሳካት።'
    },
    leadershipTitle: {
      en: 'LEADERSHIP',
      om: 'HOJGANNA',
      am: 'አመራር'
    },
    active: {
      en: 'ACTIVE',
      om: 'AKTIIF',
      am: 'ንቁ'
    },
    verified: {
      en: 'Verified Administrator',
      om: 'Bulcha Mirkaneessame',
      am: 'የተረጋገጠ አስተዳዳሪ'
    }
  };

  // Generate a random ticket number
  const generateTicketNumber = () => {
    const prefix = 'AG';
    const year = new Date().getFullYear().toString().slice(-2);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}-${year}-${random}`;
  };

  const getQueueColor = (queue: number) => {
    if (queue === 0) return 'success';
    if (queue <= 2) return 'warning';
    if (queue <= 4) return 'danger';
    return 'danger';
  };

  const getQueueLabel = (queue: number) => {
    if (queue === 0) return dict.empty[currentLang];
    if (queue <= 2) return dict.low[currentLang];
    if (queue <= 4) return dict.medium[currentLang];
    return dict.high[currentLang];
  };

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName];
    return Icon ? <Icon className="w-6 h-6" /> : <Briefcase className="w-6 h-6" />;
  };

  const getRequirementIcon = (index: number) => {
    const icons = [
      <UserCheck className="h-4 w-4 text-brand-green-700" />,
      <FileCheck className="h-4 w-4 text-brand-green-700" />,
      <CreditCard className="h-4 w-4 text-brand-green-700" />,
      <Fingerprint className="h-4 w-4 text-brand-green-700" />,
      <BadgeCheck className="h-4 w-4 text-brand-green-700" />
    ];
    return icons[index % icons.length];
  };

  const openDetail = (service: any) => {
    const ticketNumber = generateTicketNumber();
    setSelectedService({ ...service, ticketNumber });
    setIsDetailOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    document.body.style.overflow = 'auto';
    setTimeout(() => setSelectedService(null), 300);
  };

  const getQueueBadgeClass = (queue: number) => {
    if (queue === 0) return 'bg-success bg-opacity-10 text-success';
    if (queue <= 2) return 'bg-warning bg-opacity-10 text-warning';
    if (queue <= 4) return 'bg-danger bg-opacity-10 text-danger';
    return 'bg-danger bg-opacity-10 text-danger';
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="position-relative text-white overflow-hidden" style={{ background: 'linear-gradient(135deg, #0e2f44, #1a5276, #2e86c1)', padding: '80px 0 120px' }}>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'radial-gradient(circle at 70% 30%, rgba(46, 134, 193, 0.2), transparent 70%)' }}></div>
        <div className="container position-relative z-1">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="d-inline-flex align-items-center gap-2 bg-white bg-opacity-10 px-3 py-2 rounded-pill mb-3" style={{ backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Crown className="w-4 h-4 text-warning" />
                <span className="small">Official Government Service Center</span>
              </div>
              <h1 className="display-3 fw-bold">
                <span className="text-warning">Agaro Mesob Center</span>
              </h1>
              <p className="lead opacity-90">{dict.subtitle[currentLang]}</p>
              <p className="opacity-75" style={{ maxWidth: '500px', lineHeight: '1.8' }}>{dict.description[currentLang]}</p>
            </div>
            <div className="col-lg-6 d-none d-lg-block position-relative">
              <div className="position-relative" style={{ minHeight: '300px' }}>
                <div className="position-absolute top-0 end-0 bg-white bg-opacity-10 p-3 rounded-3 d-flex align-items-center gap-2" style={{ backdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.15)', animation: 'floatCard 4s ease-in-out infinite' }}>
                  <Briefcase className="w-5 h-5 text-warning" />
                  <span>Passport</span>
                </div>
                <div className="position-absolute bottom-0 start-0 bg-white bg-opacity-10 p-3 rounded-3 d-flex align-items-center gap-2" style={{ backdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.15)', animation: 'floatCard 4s ease-in-out infinite 1s' }}>
                  <Phone className="w-5 h-5 text-warning" />
                  <span>Telecom</span>
                </div>
                <div className="position-absolute top-50 end-0 translate-middle-y bg-white bg-opacity-10 p-3 rounded-3 d-flex align-items-center gap-2" style={{ backdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.15)', animation: 'floatCard 4s ease-in-out infinite 2s' }}>
                  <MessageCircle className="w-5 h-5 text-warning" />
                  <span>Water</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="position-absolute bottom-0 start-0 w-100">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-100" style={{ height: '80px', fill: '#ffffff' }}>
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.49C55.17,102.06,133.63,92,203.86,83.6,251.63,78.27,306.54,62.23,321.39,56.44Z"/>
          </svg>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-5" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="d-inline-block px-3 py-1 rounded-pill small fw-bold text-uppercase" style={{ background: 'rgba(26, 82, 118, 0.1)', color: '#1a5276', letterSpacing: '1px' }}>
              {dict.queueManagement[currentLang]}
            </span>
            <h2 className="display-4 fw-bold" style={{ color: '#0e2f44' }}>{dict.title[currentLang]}</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>የአገልግሎት ወረፋ አስተዳደር / Queue Management System</p>
          </div>

          <div className="row g-3">
            {servicesData.map((service) => {
              return (
                <div key={service.id} className="col-md-3 col-sm-6">
                  <div 
                    className={`card h-100 text-center p-3 cursor-pointer border-2 transition-all ${selectedService?.id === service.id ? 'border-warning' : 'border-transparent'}`}
                    style={{ 
                      cursor: 'pointer', 
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 15px rgba(0,0,0,0.1)'
                    }}
                    onClick={() => openDetail(service)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 5px 30px rgba(0,0,0,0.15)';
                      e.currentTarget.style.borderColor = '#1a5276';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 15px rgba(0,0,0,0.1)';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  >
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-center mx-auto rounded-circle mb-3" style={{ width: '50px', height: '50px', background: 'rgba(26, 82, 118, 0.08)', transition: 'all 0.3s ease' }}>
                        {getIcon(service.icon)}
                      </div>
                      <h5 className="card-title fw-bold" style={{ fontSize: '0.85rem' }}>{service.name}</h5>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Detail Modal */}
      {isDetailOpen && selectedService && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 2000 }}>
          <div className="bg-white rounded-3 p-4 position-relative" style={{ maxWidth: '550px', width: '90%', maxHeight: '85vh', overflowY: 'auto', border: '2px solid #f39c12' }}>
            <button className="position-absolute top-0 end-0 bg-transparent border-0 fs-1 p-2" onClick={closeDetail} style={{ zIndex: 10 }}>
              <X />
            </button>
            
            {/* Service Icon and Name */}
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: '60px', height: '60px', background: 'rgba(26, 82, 118, 0.1)', flexShrink: 0 }}>
                {getIcon(selectedService.icon)}
              </div>
              <div>
                <h3 className="fw-bold m-0" style={{ color: '#0e2f44' }}>{selectedService.name}</h3>
                <span className="text-muted small">{selectedService.description}</span>
              </div>
            </div>
            
            {/* Ticket Number */}
            <div className="mt-3 p-3 bg-brand-green-50 rounded-3 border border-brand-green-200">
              <div className="d-flex align-items-center gap-2">
                <Ticket className="text-brand-green-700" size={20} />
                <span className="fw-bold text-brand-green-800">{dict.ticket[currentLang]}:</span>
                <span className="font-monospace fs-5 fw-bold text-brand-green-900">{selectedService.ticketNumber}</span>
              </div>
            </div>

            {/* Office Location */}
            <div className="mt-2 p-3 bg-brand-gold-50 rounded-3 border border-brand-gold-200">
              <div className="d-flex align-items-center gap-2">
                <Building className="text-brand-gold-700" size={20} />
                <span className="fw-bold text-brand-gold-800">{dict.office[currentLang]}:</span>
                <span className="fw-semibold text-brand-gold-900">{selectedService.office}</span>
              </div>
            </div>

            {/* Requirements */}
            <div className="mt-3 p-3 bg-blue-50 rounded-3 border border-blue-200">
              <div className="d-flex align-items-center gap-2 mb-2">
                <ClipboardCheck className="text-blue-700" size={20} />
                <span className="fw-bold text-blue-800">{dict.requirements[currentLang]}:</span>
              </div>
              <ul className="list-unstyled mb-0">
                {selectedService.requirements.map((req: string, index: number) => (
                  <li key={index} className="d-flex align-items-center gap-2 py-1 text-sm">
                    {getRequirementIcon(index)}
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <button className="btn btn-primary w-100 mt-3 py-2 fw-bold" onClick={closeDetail}>
              {dict.close[currentLang]}
            </button>
          </div>
        </div>
      )}

      {/* Why Choose Us */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <span className="d-inline-block px-3 py-1 rounded-pill small fw-bold text-uppercase" style={{ background: 'rgba(26, 82, 118, 0.1)', color: '#1a5276' }}>
              {dict.whyChoose[currentLang]}
            </span>
            <h2 className="display-4 fw-bold" style={{ color: '#0e2f44' }}>{dict.whyChoose[currentLang]}</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>{dict.whyChooseDesc[currentLang]}</p>
          </div>
          <div className="row g-4">
            {[
              { icon: Wrench, title: 'Fast & Efficient', desc: 'Quick service delivery with minimal waiting time' },
              { icon: ShieldCheck, title: 'Secure & Reliable', desc: 'Enterprise-grade security for your data' },
              { icon: Users, title: 'Citizen Focused', desc: 'Designed with citizens\' needs in mind' },
              { icon: Smartphone, title: 'Digital Solutions', desc: 'Modern technology for better service delivery' },
              { icon: Clock, title: '24/7 Access', desc: 'Access services anytime, anywhere' },
              { icon: Award, title: 'Quality Assured', desc: 'ISO certified service standards' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="col-md-4">
                  <div className="card h-100 text-center p-4 border-0 shadow-sm transition-all" style={{ transition: 'all 0.3s ease' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 5px 30px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 15px rgba(0,0,0,0.1)';
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-center mx-auto rounded-circle mb-3" style={{ width: '60px', height: '60px', background: 'rgba(26, 82, 118, 0.08)' }}>
                      <Icon className="w-6 h-6" style={{ color: '#1a5276' }} />
                    </div>
                    <h4 className="fw-bold">{item.title}</h4>
                    <p className="text-muted small">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-5" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="d-inline-block px-3 py-1 rounded-pill small fw-bold text-uppercase" style={{ background: 'rgba(26, 82, 118, 0.1)', color: '#1a5276' }}>
                {dict.about[currentLang]}
              </span>
              <h2 className="display-4 fw-bold mb-3" style={{ color: '#0e2f44' }}>{dict.aboutTitle[currentLang]}</h2>
              <p className="text-muted">{dict.aboutDesc1[currentLang]}</p>
              <p className="text-muted">{dict.aboutDesc2[currentLang]}</p>
              <ul className="list-unstyled">
                <li className="d-flex align-items-center gap-2 py-1"><CheckCircle className="text-success w-4 h-4" /> Fast and efficient service delivery</li>
                <li className="d-flex align-items-center gap-2 py-1"><CheckCircle className="text-success w-4 h-4" /> Professional and courteous staff</li>
                <li className="d-flex align-items-center gap-2 py-1"><CheckCircle className="text-success w-4 h-4" /> Modern queue management system</li>
                <li className="d-flex align-items-center gap-2 py-1"><CheckCircle className="text-success w-4 h-4" /> Digital record keeping</li>
                <li className="d-flex align-items-center gap-2 py-1"><CheckCircle className="text-success w-4 h-4" /> Real-time service tracking</li>
              </ul>
              <div className="row g-3 mt-3">
                <div className="col-sm-6">
                  <div className="d-flex gap-3 p-3 bg-white rounded-3 shadow-sm">
                    <Eye className="text-primary w-6 h-6 flex-shrink-0" />
                    <div>
                      <h6 className="fw-bold mb-0">{dict.ourVision[currentLang]}</h6>
                      <small className="text-muted">{dict.visionText[currentLang]}</small>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex gap-3 p-3 bg-white rounded-3 shadow-sm">
                    <span className="fs-1">🎯</span>
                    <div>
                      <h6 className="fw-bold mb-0">{dict.ourMission[currentLang]}</h6>
                      <small className="text-muted">{dict.missionText[currentLang]}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="position-relative">
                <div className="bg-primary bg-opacity-10 rounded-4 p-5 text-center" style={{ height: '400px', background: 'linear-gradient(135deg, #0e2f44, #1a5276)' }}>
                  <span className="display-1">🏛️</span>
                </div>
                <div className="position-absolute bottom-0 end-0 bg-primary text-white p-4 rounded-3 text-center" style={{ transform: 'translate(10%, 20%)' }}>
                  <span className="display-4 fw-bold text-warning d-block">2</span>
                  <span className="small opacity-75">Years of Excellence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mayor Section */}
      <section className="py-5" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="bg-white rounded-4 shadow-sm p-5">
                <div className="text-center mb-4">
                  <span className="d-inline-block px-3 py-1 rounded-pill small fw-bold text-uppercase" style={{ background: 'rgba(26, 82, 118, 0.1)', color: '#1a5276', letterSpacing: '1px' }}>
                    {dict.mayorTitle[currentLang]}
                  </span>
                </div>

                <div className="row align-items-center">
                  <div className="col-md-4 text-center">
                    <div className="rounded-circle overflow-hidden mx-auto" style={{ width: '180px', height: '180px', border: '4px solid #ca8a04' }}>
                      <img 
                        src={getServiceImage('mesob-center', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256')} 
                        alt={serviceProfiles['mesob-center']?.name || 'Mayor'} 
                        className="w-100 h-100 object-cover"
                      />
                    </div>
                    <h3 className="fw-bold mt-3" style={{ color: '#0e2f44' }}>{serviceProfiles['mesob-center']?.name || dict.mayorName[currentLang]}</h3>
                    <p className="text-muted small">{serviceProfiles['mesob-center']?.email || dict.mayorEmail[currentLang]}</p>
                    <div className="mt-2">
                      <p className="mb-1 text-sm"><MapPin className="d-inline me-1 text-brand-gold-500" size={14} /> {serviceProfiles['mesob-center']?.location || dict.mayorAddress[currentLang]}</p>
                      <p className="mb-0 text-sm"><Clock className="d-inline me-1 text-brand-gold-500" size={14} /> {dict.mayorTerm[currentLang]}</p>
                    </div>
                  </div>

                  <div className="col-md-8">
                    <div className="mb-4">
                      <span className="d-inline-block px-2 py-1 bg-brand-gold-100 text-brand-gold-800 rounded small fw-bold text-uppercase" style={{ fontSize: '10px' }}>
                        {dict.municipalStrategy[currentLang]}
                      </span>
                      <h4 className="fw-bold mt-2" style={{ color: '#0e2f44' }}>{dict.executiveAddress[currentLang]}</h4>
                      <p className="text-muted small">{dict.executiveDesc[currentLang]}</p>
                    </div>

                    <div>
                      <span className="d-block small fw-bold text-uppercase mb-2" style={{ color: '#0e2f44', letterSpacing: '1px' }}>
                        {dict.specialPriorities[currentLang]}
                      </span>
                      <div className="row g-3">
                        <div className="col-md-4">
                          <div className="border rounded-3 p-3 h-100" style={{ background: '#fafafa' }}>
                            <span className="d-block fw-bold text-brand-green-700" style={{ fontSize: '20px' }}>01</span>
                            <h6 className="fw-bold mt-1" style={{ fontSize: '13px' }}>Priority 01</h6>
                            <p className="text-muted small mb-0" style={{ fontSize: '12px' }}>{dict.priority1[currentLang]}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="border rounded-3 p-3 h-100" style={{ background: '#fafafa' }}>
                            <span className="d-block fw-bold text-brand-green-700" style={{ fontSize: '20px' }}>02</span>
                            <h6 className="fw-bold mt-1" style={{ fontSize: '13px' }}>Priority 02</h6>
                            <p className="text-muted small mb-0" style={{ fontSize: '12px' }}>{dict.priority2[currentLang]}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="border rounded-3 p-3 h-100" style={{ background: '#fafafa' }}>
                            <span className="d-block fw-bold text-brand-green-700" style={{ fontSize: '20px' }}>03</span>
                            <h6 className="fw-bold mt-1" style={{ fontSize: '13px' }}>Priority 03</h6>
                            <p className="text-muted small mb-0" style={{ fontSize: '12px' }}>{dict.priority3[currentLang]}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Simple Version */}
<section id="contact" className="py-5 bg-white">
  <div className="container">
    <div className="text-center">
      <span className="d-inline-block px-3 py-1 rounded-pill small fw-bold text-uppercase" style={{ 
        background: 'rgba(26, 82, 118, 0.1)', 
        color: '#1a5276',
        letterSpacing: '1px',
        fontSize: '10px'
      }}>
        GET IN TOUCH
      </span>
      <h2 className="display-4 fw-bold mt-2" style={{ color: '#0e2f44' }}>
        Get In Touch
      </h2>
      <p className="text-muted mx-auto" style={{ maxWidth: '600px', fontSize: '1.1rem' }}>
        Have questions or need assistance? We're here to help!
      </p>
    </div>
  </div>
</section>

      {/* Leadership Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <span className="d-inline-block px-3 py-1 rounded-pill small fw-bold text-uppercase" style={{ background: 'rgba(26, 82, 118, 0.1)', color: '#1a5276', letterSpacing: '1px' }}>
              {dict.leadershipTitle[currentLang]}
            </span>
          </div>

          <div className="row g-4">
            {/* Leadership Card 1 */}
            <div className="col-md-6">
              <div className="bg-white border rounded-4 p-4 shadow-sm hover-shadow transition-all h-100">
                <div className="d-flex gap-3">
                  <div className="rounded-circle overflow-hidden flex-shrink-0" style={{ width: '70px', height: '70px', border: '3px solid #ca8a04' }}>
                    <img 
                        src={getServiceImage('services-leader-1', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256')} 
                        alt={serviceProfiles['services-leader-1']?.name || 'Ato Kemal Jemal'} 
                      className="w-100 h-100 object-cover"
                    />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0" style={{ color: '#0e2f44' }}>{serviceProfiles['services-leader-1']?.name || 'Ato Kemal Jemal'}</h5>
                    <span className="badge bg-green-700 text-white fw-semibold px-2 py-1" style={{ fontSize: '10px' }}>{serviceProfiles['services-leader-1']?.task || 'MAYOR & ADMINISTRATIVE HEAD'}</span>
                    <p className="text-muted small mt-2 mb-0">Directs the strategic direction, leads the city council, and oversees all physical municipal renovations and governance programs.</p>
                    <div className="mt-2 d-flex align-items-center gap-2">
                      <span className="text-xs text-muted">Verified Administrator</span>
                      <span className="badge bg-success text-white" style={{ fontSize: '8px' }}>ACTIVE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Leadership Card 2 */}
            <div className="col-md-6">
              <div className="bg-white border rounded-4 p-4 shadow-sm hover-shadow transition-all h-100">
                <div className="d-flex gap-3">
                  <div className="rounded-circle overflow-hidden flex-shrink-0" style={{ width: '70px', height: '70px', border: '3px solid #ca8a04' }}>
                    <img 
                        src={getServiceImage('services-leader-2', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256')} 
                        alt={serviceProfiles['services-leader-2']?.name || 'Dr. Chaltu Gemeda'} 
                      className="w-100 h-100 object-cover"
                    />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0" style={{ color: '#0e2f44' }}>{serviceProfiles['services-leader-2']?.name || 'Dr. Chaltu Gemeda'}</h5>
                    <span className="badge bg-green-700 text-white fw-semibold px-2 py-1" style={{ fontSize: '10px' }}>{serviceProfiles['services-leader-2']?.task || 'DEPUTY MAYOR & SOCIAL LEAD'}</span>
                    <p className="text-muted small mt-2 mb-0">Coordinates community programs, healthcare clinics, educational standards, and environmental protection projects.</p>
                    <div className="mt-2 d-flex align-items-center gap-2">
                      <span className="text-xs text-muted">Verified Administrator</span>
                      <span className="badge bg-success text-white" style={{ fontSize: '8px' }}>ACTIVE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
{/* Contact Section - Moved below Leadership */}
<section id="contact" className="py-5 bg-white">
  <div className="container">
    <div className="row justify-content-center">
      <div className="col-lg-10">
        <div className="bg-white rounded-4 shadow-sm p-4" style={{ border: '1px solid #e9ecef' }}>
          <div className="row g-4">
            {[
              { icon: MapPin, title: dict.address[currentLang], details: ['Agaro Town, Oromia Region, Ethiopia', 'Near Agaro Main Square'] },
              { icon: Phone, title: dict.phone[currentLang], details: ['+251 123 456 789', '+251 987 654 321'] },
              { icon: Mail, title: dict.email[currentLang], details: ['info@agaromesob.gov.et', 'support@agaromesob.gov.et'] },
              { icon: Clock, title: dict.workingHours[currentLang], details: ['Monday - Friday: 8:00 AM - 5:00 PM', 'Saturday: 8:00 AM - 1:00 PM'] },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="col-md-6">
                  <div className="d-flex gap-3 py-3">
                    <div 
                      className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" 
                      style={{ width: '45px', height: '45px', background: 'rgba(26, 82, 118, 0.08)' }}
                    >
                      <Icon className="text-primary w-5 h-5" style={{ color: '#1a5276' }} />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1" style={{ color: '#1a5276', fontSize: '0.9rem' }}>
                        {item.title}
                      </h6>
                      {item.details.map((detail, i) => (
                        <p key={i} className="text-muted small mb-0" style={{ fontSize: '0.85rem' }}>
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Footer */}
      <footer className="bg-dark text-white pt-5" style={{ background: '#0e2f44' }}>
        <div className="container">
          <div className="row g-4 pb-4 border-bottom border-white border-opacity-10">
            <div className="col-lg-4">
              <div className="footer-brand">
                <span className="display-4">🏛️</span>
                <h3 className="fw-bold mt-2">Agaro Mesob Center</h3>
                <p className="text-white-50 small">Your trusted partner in government service delivery</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-4">
              <h5 className="fw-bold mb-3">{dict.quickLinks[currentLang]}</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#home" className="text-white-50 text-decoration-none d-flex align-items-center gap-2"><ChevronRight className="w-3 h-3" /> {dict.home[currentLang]}</a></li>
                <li className="mb-2"><a href="#services" className="text-white-50 text-decoration-none d-flex align-items-center gap-2"><ChevronRight className="w-3 h-3" /> {dict.services[currentLang]}</a></li>
                <li className="mb-2"><a href="#about" className="text-white-50 text-decoration-none d-flex align-items-center gap-2"><ChevronRight className="w-3 h-3" /> {dict.about[currentLang]}</a></li>
                <li className="mb-2"><a href="#contact" className="text-white-50 text-decoration-none d-flex align-items-center gap-2"><ChevronRight className="w-3 h-3" /> {dict.contact[currentLang]}</a></li>
              </ul>
            </div>
            <div className="col-lg-3 col-md-4">
              <h5 className="fw-bold mb-3">{dict.support[currentLang]}</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none d-flex align-items-center gap-2"><ChevronRight className="w-3 h-3" /> Help Center</a></li>
                <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none d-flex align-items-center gap-2"><ChevronRight className="w-3 h-3" /> FAQ</a></li>
                <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none d-flex align-items-center gap-2"><ChevronRight className="w-3 h-3" /> Privacy Policy</a></li>
                <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none d-flex align-items-center gap-2"><ChevronRight className="w-3 h-3" /> Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center py-3 small text-white-50">
            <p className="mb-0">&copy; 2026 Agaro Mesob Center. All rights reserved.</p>
            <div className="d-flex gap-3">
              <span>Version 2.0.0</span>
              <span>Powered by <span className="text-warning">Ethiopian Government</span></span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes floatCard {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .position-absolute .position-absolute {
          animation: floatCard 4s ease-in-out infinite;
        }
        .ps-7 {
          padding-left: 2.5rem;
        }
        .hover-shadow:hover {
          box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </div>
  );
}