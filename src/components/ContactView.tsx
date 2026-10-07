import React, { useState } from 'react';
import { Mail, Phone, MapPin, Share2, MessageSquare, Clock, Send, ShieldCheck, Landmark } from 'lucide-react';
import { Language } from '../types';

const API_BASE_URL = 'http://localhost/agaro/php_export';

interface ContactViewProps {
  currentLang: Language;
}

export default function ContactView({ currentLang }: ContactViewProps) {
  const [formInputs, setFormInputs] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const loc = {
    title: {
      en: 'Contact Agaro Administration',
      om: 'Nu Quunnamaa - Bulchiinsa',
      am: 'አጋሮ አስተዳደርን ያግኙ'
    },
    subtitle: {
      en: 'We are here to serve you. Reach us via email, phone, or drop by our main office in Agaro City Hall.',
      om: 'Isin tajaajiluun kabaja keenya. Waajjira kantiibaa ykn bilbilaan nu quunnamaa.',
      am: 'እርስዎን ለማገልገል ዝግጁ ነን። በኢሜል፣ በስልክ ያግኙን ወይም በአጋሮ ማዘጋጃ ቤት ዋና መስሪያ ቤታችን በአካል ይጎብኙን።'
    },
    headerForm: {
      en: 'Send an Inquiry',
      om: 'Iyyannoo ykn Message Ergaa',
      am: 'ጥያቄዎን ይላኩ'
    },
    nameLabel: {
      en: 'Your Full Name',
      om: 'Maqaa Guutuu',
      am: 'ሙሉ ስምዎ'
    },
    phoneLabel: {
      en: 'Phone Number',
      om: 'Lakkoofsa Bilbilaa',
      am: 'ስልክ ቁጥር'
    },
    subjectLabel: {
      en: 'Inquiry Subject',
      om: 'Mata-duree Ergichaa',
      am: 'የጉዳዩ ርዕስ'
    },
    msgLabel: {
      en: 'Detailed Message',
      om: 'Guutummaa Dhimma keessanii',
      am: 'ዝርዝር መልእክት'
    },
    submitBtn: {
      en: 'Submit Message',
      om: 'Ergaa Ergaa',
      am: 'መልእክት ላክ'
    },
    successMsg: {
      en: 'Thank you! Your message has been safely logged. Our media relations desk will reach out if needed.',
      om: 'Galatoomaa! Ergaan keessan sirriitti galmeeffameera. Kutaan quunnamtii keenya quunnamtii isiniif taasisa.',
      am: 'እናመሰግናለን! መልእክትዎ በተሳካ ሁኔታ ተመዝግቧል። የሕዝብ ግንኙነት ክፍላችን እንደ አስፈላጊነቱ ያገኝዎታል።'
    },
    officeHours: {
      en: 'Office Hours',
      om: 'Saa\'atota Hojii',
      am: 'የሥራ ሰዓታት'
    },
    monFri: {
      en: 'Monday - Friday (8:30 AM - 5:30 PM)',
      om: 'Wiixata - Jimaata (Saa\'atii 2:30 - 11:30)',
      am: 'ከሰኞ እስከ አርብ (ከጠዋቱ 2:30 እስከ 11:30 ሰዓት)'
    },
    submitError: {
      en: 'We could not send your message. Please try again.',
      om: 'Ergaa keessan erguu hin dandeenye. Maaloo irra deebi\'aa yaalaa.',
      am: 'መልእክትዎን መላክ አልተቻለም። እባክዎ እንደገና ይሞክሩ።'
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInputs.name || !formInputs.message) return;
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch(`${API_BASE_URL}/submit_feedback.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formInputs)
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Unable to submit feedback');
      }

      setSubmitted(true);
      setFormInputs({ name: '', phone: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact feedback:', error);
      setSubmitError(loc.submitError[currentLang]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const KEBELE_CONTACTS = [
    { name: 'Kebele 01 Office', head: 'Ato Temam Abamecha', phone: '+251 47 555 0101' },
    { name: 'Kebele 02 Office', head: 'W/ro Genet Desta', phone: '+251 47 555 0102' },
    { name: 'Kebele 03 Office', head: 'Ato Kedir Haji', phone: '+251 47 555 0103' },
    { name: 'Kebele 04 Office', head: 'Ato Fitsum Hailu', phone: '+251 47 555 0104' },
    { name: 'Kebele 05 Office', head: 'W/ro Chaltu Tolera', phone: '+251 47 555 0105' }
  ];

  return (
    <section id="contact-section" className="space-y-12 py-6 font-sans">
      {/* Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="font-display text-3.5xl font-bold text-slate-800 tracking-tight leading-tight md:text-4xl">
          {loc.title[currentLang]}
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          {loc.subtitle[currentLang]}
        </p>
        <div className="h-1 w-20 bg-brand-gold-500 mx-auto rounded-full"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
        {/* Contacts details column (Left) */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-150 p-6 md:p-8 shadow-xs space-y-6">
            <h2 className="font-display text-xl font-bold text-slate-800 flex items-center gap-2">
              <Landmark className="h-5.5 w-5.5 text-brand-green-700" />
              Agaro City Hall
            </h2>

            <div className="space-y-4">
              <div className="flex gap-3.5 items-start">
                <MapPin className="h-5 w-5 text-brand-gold-500 shrink-0 mt-0.5" />
                <div className="text-sm text-slate-650 leading-relaxed">
                  <p className="font-semibold text-slate-800">Main Administrative Headquarters</p>
                  <p>City Hall Road, Kebele 01, Agaro, Ethiopia (Jimma Zone, Oromia)</p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <Phone className="h-5 w-5 text-brand-gold-500 shrink-0 mt-0.5" />
                <div className="text-sm text-slate-650">
                  <p className="font-semibold text-slate-800">General Hotline</p>
                  <p className="font-mono hover:text-brand-green-700"><a href="tel:+251475555555">+251 47 555 5555</a></p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <Mail className="h-5 w-5 text-brand-gold-500 shrink-0 mt-0.5" />
                <div className="text-sm text-slate-650">
                  <p className="font-semibold text-slate-800">Email Address</p>
                  <p className="font-mono hover:text-brand-green-700 underline"><a href="mailto:info@agarocity.gov.et">info@agarocity.gov.et</a></p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start2 border-t border-slate-100 pt-4 flex gap-3.5 items-start">
                <Clock className="h-5 w-5 text-brand-gold-500 shrink-0 mt-0.5" />
                <div className="text-sm text-slate-650">
                  <p className="font-semibold text-slate-850">{loc.officeHours[currentLang]}</p>
                  <p className="text-xs">{loc.monFri[currentLang]}</p>
                  <p className="text-[11px] text-slate-400 font-medium">Closed for lunch: 12:30 PM - 1:30 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Kebele Contact Offices */}
          <div className="bg-white rounded-3xl border border-slate-150 p-6 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-slate-800 text-sm.5">
              Kebele Administrative Offices
            </h3>
            <div className="divide-y divide-slate-100">
              {KEBELE_CONTACTS.map((keb, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 text-xs.5">
                  <div>
                    <span className="font-semibold text-slate-700 block">{keb.name}</span>
                    <span className="text-slate-400 font-medium">{keb.head}</span>
                  </div>
                  <a href={`tel:${keb.phone.replace(/[\s\+]/g, '')}`} className="font-mono text-brand-green-700 hover:underline">{keb.phone}</a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form column (Right) */}
        <div className="bg-white rounded-3xl border border-[#e2e8f0] p-6 md:p-8 shadow-sm">
          <h2 className="font-display text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-brand-green-700" />
            {loc.headerForm[currentLang]}
          </h2>

          {submitted ? (
            <div className="rounded-2xl bg-brand-green-50/50 p-6 border border-brand-green-100 text-center space-y-3">
              <div className="h-11 w-11 rounded-full bg-brand-green-600 text-white flex items-center justify-center mx-auto text-lg">
                <ShieldCheck className="h-5.5 w-5.5" />
              </div>
              <h3 className="font-display font-bold text-brand-green-850 text-sm.5">Message Logged</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {loc.successMsg[currentLang]}
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-555">{loc.nameLabel[currentLang]}</label>
                  <input
                    type="text"
                    required
                    value={formInputs.name}
                    onChange={(e) => setFormInputs({ ...formInputs, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-850 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-555">{loc.phoneLabel[currentLang]}</label>
                  <input
                    type="text"
                    value={formInputs.phone}
                    onChange={(e) => setFormInputs({ ...formInputs, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-850 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-555">Email Address</label>
                <input
                  type="email"
                  value={formInputs.email}
                  onChange={(e) => setFormInputs({ ...formInputs, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-850 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-555">{loc.subjectLabel[currentLang]}</label>
                <input
                  type="text"
                  value={formInputs.subject}
                  onChange={(e) => setFormInputs({ ...formInputs, subject: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-850 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-555">{loc.msgLabel[currentLang]}</label>
                <textarea
                  required
                  rows={4}
                  value={formInputs.message}
                  onChange={(e) => setFormInputs({ ...formInputs, message: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-850 focus:border-brand-green-600 focus:bg-white focus:outline-none-textarea"
                />
              </div>

              <button
                id="btn-contact-submit"
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-green-700 text-white font-semibold py-2.5 px-4 text-sm shadow-xs hover:bg-brand-green-800 transition-colors cursor-pointer"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? 'Sending...' : loc.submitBtn[currentLang]}
              </button>
              {submitError && (
                <p role="alert" className="text-sm text-red-600 text-center">{submitError}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
