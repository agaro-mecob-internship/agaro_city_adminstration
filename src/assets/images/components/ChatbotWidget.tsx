import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, HelpCircle, Check, Coffee } from 'lucide-react';
import { Language } from '../../../types';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

interface ChatbotWidgetProps {
  currentLang: Language;
}

const CHAT_DICTIONARY: Record<string, Record<Language, string>> = {
  chatTitle: {
    en: 'Agaro City Helpdesk',
    om: 'Deeggarsa Magaalaa Aggaaroo',
    am: 'የአጋሮ ከተማ ረዳት'
  },
  chatStatus: {
    en: 'Online • Agent Assistant',
    om: 'Hojirra • Deeggartuun',
    am: 'በመስመር ላይ • ረዳት'
  },
  chatPlaceholder: {
    en: 'Ask a question about city services...',
    om: 'Waa\'ee tajaajila magaalaa gaafadhaa...',
    am: 'ስለ ከተማ አገልግሎቶች ጥያቄ ይጠይቁ...'
  },
  welcomeMsg: {
    en: "Akkam! Welcome to the Agaro City official helper. How can I assist you with municipal licensing, residency, land services, or coffee festival queries today?",
    om: "Akkam! Baga nagaan dhuftan. Tajaajiloota magaalaa kan akka hayyama daldalaa, waraqaa eenyummaa, lafa ykn festival bunaa dhimmoota irratti akkamitti isin gargaaruu danda'a?",
    am: "ሰላም! ወደ አጋሮ ከተማ ይፋዊ ረዳት በደህና መጡ። ዛሬ በንግድ ፈቃድ፣ በነዋሪነት ወረቀት፣ በመሬት አገልግሎት ወይም በቡና ፌስቲቫል ጉዳዮች ላይ እንዴት ልረዳዎ እችላለሁ?"
  }
};

const DYNAMIC_RESPONSES: Record<string, Record<Language, string>> = {
  license: {
    en: "To apply for a Business License, click on 'Services' -> 'Business License'. You will need to fill in your trade name, select your sector (e.g., Agricultural Trade, Local Shop, Massager), and upload your Ethiopian ID.",
    om: "Hayyama daldalaa argachuuf, 'Tajaajiloota' -> 'Hayyama Daldalaa' cuqaasaa. Maqaa daldalaa, damee dalagaa (fkn. Bun-oomisha, daldala xiqqaa) fi ragaa eenyummaa keessan galchuun iyyadhaa.",
    am: "የንግድ ፈቃድ ለማውጣት 'አገልግሎቶች' -> 'የንግድ ፈቃድ' የሚለውን ይጫኑ። የንግድ ስምዎን ያስገቡ፣ የሥራ ዘርፍዎን ይምረጡ (ምሳሌ፡ የግብርና ንግድ፣ ሱቅ) እና የኢትዮጵያ መታወቂያዎን ያያይዙ።"
  },
  residency: {
    en: "For Resident Certificates, you must select your local Kebele (01 to 05), provide details of your current housing, and submit. The Kebele administration typically approves this within 24-48 business hours.",
    om: "Waraqaa eenyummaa deeggaruuf, Kebele keessan (01 hanga 05) filadhaa, ragaa jireenya keessanii fi lakkoofsa mana dhiyeessun iyyanno keessan galchaa. Kebeleen yeroodhaan ni mirkaneessa.",
    am: "የነዋሪነት ማረጋገጫ ለመጠየቅ የነዋሪነት ቀበሌዎን (ከ 01 እስከ 05) መምረጥ፣ የአሁኑን የመኖሪያ ቤት መረጃ መስጠት እና ማመልከት አለብዎት። የቀበሌው አስተዳደር በጥቂት ቀናት ውስጥ ያጸድቀዋል።"
  },
  coffee: {
    en: "Agaro is blessed with world-renowned organic coffees. Our Specialty Coffee Festival will take place in October 2026 at the Central Municipal Square. Local washing stations and cooperatives will showcase jasmine-profile washed coffees.",
    om: "Aggaaroon bunoota bebbeekamo uumamaadhaan eebbifamteetti. Festival Bunaa keenya Onkoloolessa 2026 keessa iddoo waltajjii magaalichaatti ni kabajama.",
    am: "አጋሮ በዓለም የታወቁ የተፈጥሮ ኦርጋኒክ ቡናዎች ባለቤት ናት። የእኛ የልዩ ቡና ፌስቲቫል በጥቅምት ወር 2026 በማዕከላዊ የከተማው አደባባይ ይካሄዳል። የአገር ውስጥ የአዝመራ ማህበራት ምርጦቹን ያቀርባሉ።"
  },
  fees: {
    en: "You can pay municipal utilities and trade taxes directly online through our Pay Municipal Fees portal. It supports CBE Birr, Telebirr, and direct banking references. Your payment receipt generates instantly.",
    om: "Kaffaltii tajaajila magaalaa fi taxii daldalaa kallattiidhaan kaffaltii 'Pay Municipal Fees' jedhuun kaffaluu dandeessu. Telebirr, CBE Birr fi baankota ni deeggara.",
    am: "የከተማ አገልግሎት ክፍያዎችን እና የንግድ ግብርን በቀጥታ በመስመር ላይ 'የማዘጋጃ ቤት ክፍያዎችን ይክፈሉ' በሚለው ፖርታል መክፈል ይችላሉ። ቴሌብርን፣ ሲቢኢ ብርን እና ሌሎች የባንክ አገልግሎቶችን ይደግፋል።"
  },
  default: {
    en: "Thank you for reaching out to Agaro Service Desk! For in-depth services, navigate to the master menus above or book an appointment directly with the Mayor's Office or public officials under 'Services'.",
    om: "Waajjira tajaajila Aggaaroo quunnamuuf galatoomaa! Oddeeffannoo dabalataaf miniyuu tajaajila olii cuqaasaa ykn kantiibaa haasofsiisuf qorannoo qabadhaa.",
    am: "የአጋሮ ከተማ አገልግሎት መስጫ ዲፓርትመንትን ስላነጋገሩ እናመሰግናለን! ለተጨማሪ ዝርዝር መረጃ ከላይ የሚገኙትን አገልግሎቶች ይጎብኙ ወይም በቀጥታ ከከንቲባው ቢሮ ጋር ቀጠሮ ይያዙ።"
  }
};

export default function ChatbotWidget({ currentLang }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial welcome message
    setMessages([
      {
        id: 'msg-welcome',
        sender: 'bot',
        text: CHAT_DICTIONARY.welcomeMsg[currentLang],
        timestamp: new Date()
      }
    ]);
  }, [currentLang]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typing]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setTyping(true);

    // Analyze text and formulate response
    const query = text.toLowerCase();
    let responseText = DYNAMIC_RESPONSES.default[currentLang];

    if (query.includes('license') || query.includes('hayyama') || query.includes('ፈቃድ') || query.includes('business')) {
      responseText = DYNAMIC_RESPONSES.license[currentLang];
    } else if (query.includes('resident') || query.includes('residency') || query.includes('kebele') || query.includes('eenyummaa') || query.includes('ነዋሪነት') || query.includes('መታወቂያ')) {
      responseText = DYNAMIC_RESPONSES.residency[currentLang];
    } else if (query.includes('coffee') || query.includes('buna') || query.includes('buuna') || query.includes('ቡና')) {
      responseText = DYNAMIC_RESPONSES.coffee[currentLang];
    } else if (query.includes('fee') || query.includes('tax') || query.includes('pay') || query.includes('kaffal') || query.includes('ክፍያ') || query.includes('ብር') || query.includes('telebirr')) {
      responseText = DYNAMIC_RESPONSES.fees[currentLang];
    }

    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-bot-${Date.now()}`,
          sender: 'bot',
          text: responseText,
          timestamp: new Date()
        }
      ]);
    }, 1000);
  };

  const quickQuestions: { text: Record<Language, string>; search: string }[] = [
    {
      text: {
        en: 'How to apply for Trade License?',
        om: 'Hayyama daldalaa akkamitti iyyanna?',
        am: 'የንግድ ፈቃድ እንዴት ማመልከት እችላለሁ?'
      },
      search: 'license'
    },
    {
      text: {
        en: 'Where is the Coffee Festival?',
        om: 'Festival Bunaa eessatti kabajama?',
        am: 'የቡና ፌስቲቫል የት ነው የሚካሄደው?'
      },
      search: 'coffee'
    },
    {
      text: {
        en: 'How to pay municipal taxes?',
        om: 'Taxii akkamitti kaffalla?',
        am: 'የከተማ ታክስ ክፍያ እንዴት ነው?'
      },
      search: 'fees'
    }
  ];

  return (
    <div id="chatbot-container" className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Circle Toggle Button */}
      {!isOpen && (
        <button
          id="btn-bot-toggle-open"
          onClick={() => setIsOpen(true)}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-green-700 text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:outline-none cursor-pointer overflow-hidden"
          title="Open Agaro City Helpdesk"
          style={{ borderRadius: '50%' }}
        >
          <div className="relative flex items-center justify-center">
            <MessageSquare className="h-7 w-7" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-gold-500 opacity-75"></span>
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-brand-gold-500"></span>
            </span>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          id="bot-chat-window"
          className="flex h-[500px] w-96 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 sm:w-[410px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-brand-green-700 px-4 py-3.5 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green-800">
                <Bot className="h-5 w-5 text-brand-gold-500 animate-bounce" />
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold tracking-tight">
                  {CHAT_DICTIONARY.chatTitle[currentLang]}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-brand-green-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400"></span>
                  {CHAT_DICTIONARY.chatStatus[currentLang]}
                </div>
              </div>
            </div>
            <button
              id="btn-bot-toggle-close"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 text-brand-green-100 hover:bg-brand-green-800 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto bg-slate-50 p-4 space-y-3.5">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex w-full ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm shadow-xs ${
                    m.sender === 'user'
                      ? 'bg-brand-green-700 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-line">{m.text}</p>
                  <span
                    className={`block text-[10px] mt-1 text-right ${
                      m.sender === 'user' ? 'text-brand-green-100' : 'text-slate-400'
                    }`}
                  >
                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="max-w-[75%] rounded-2xl bg-white px-4 py-3 text-slate-800 border border-slate-100 rounded-bl-none shadow-xs flex items-center gap-1.5">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          <div className="bg-white border-t border-slate-100 px-4 py-2 flex flex-wrap gap-1.5">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q.text[currentLang])}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 hover:bg-brand-green-50 hover:border-brand-green-600/30 hover:text-brand-green-700 transition-all cursor-pointer text-left"
              >
                <HelpCircle className="h-3 w-3 shrink-0" />
                {q.text[currentLang]}
              </button>
            ))}
          </div>

          {/* Form Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputValue);
            }}
            className="flex items-center gap-2 border-t border-slate-200 bg-white p-3"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={CHAT_DICTIONARY.chatPlaceholder[currentLang]}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-green-600 focus:bg-white focus:ring-1 focus:ring-brand-green-600 focus:outline-none"
            />
            <button
              id="btn-bot-send"
              type="submit"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-green-700 text-white shadow-sm hover:bg-brand-green-800 transition-colors cursor-pointer"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}