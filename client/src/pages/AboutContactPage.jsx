import React, { useState } from 'react';
import {
  Heart,
  Globe,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { contactAPI } from '../api/api';

const FAQS = [
  {
    q: 'How does FoodBridge verify food safety?',
    a: 'Every food donor must confirm a strict Food Safety & Hygiene Declaration specifying preparation time, storage conditions, and expiry threshold. Donations are monitored with real-time countdown alerts and inspection checkpoints.'
  },
  {
    q: 'Can individuals donate or only restaurants?',
    a: 'Both! While commercial restaurants, wedding banquet halls, supermarkets, and bakeries are primary volume donors, individual households and community organizers can also list clean surplus food.'
  },
  {
    q: 'How does location-based matching work?',
    a: 'When surplus food is posted, our OpenStreetMap geospatial engine calculates proximity to certified NGOs and shelters, notifying those within a 15-25 km radius first to ensure swift collection before quality degrades.'
  },
  {
    q: 'Is FoodBridge free for non-profit charities?',
    a: 'Yes, 100% free! FoodBridge is dedicated to eradicating hunger through open technology and food rescue cooperation.'
  }
];

const AboutContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await contactAPI.submit(formData);
      if (res.data.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      setError(err.message || 'Error submitting message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* 1. ABOUT US SECTION */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
            About FoodBridge
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Bridging Surplus Food to Hungry Hearts
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Globally, one-third of all food produced is wasted while over 800 million people go to bed hungry. FoodBridge solves this distribution tragedy through smart technology, connecting surplus food with nearby shelters before it spoils.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              🌱
            </div>
            <h3 className="text-lg font-bold text-slate-900">Environmental Sustainability</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Decomposing food in landfills produces methane, a potent greenhouse gas. For every 10 kg of food rescued, 25 kg of carbon emissions are averted.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              🤝
            </div>
            <h3 className="text-lg font-bold text-slate-900">Zero Hunger (UN SDG 2)</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We empower local orphanages, senior care homes, and street feeding organizations with guaranteed fresh, safe, and dignified nourishment daily.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              ⚡
            </div>
            <h3 className="text-lg font-bold text-slate-900">Real-Time Logistics Engine</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Using proximity-based alerts, expiry countdowns, and 6-step progress verification, food transfers happen seamlessly in under 60 minutes.
            </p>
          </div>
        </div>
      </section>

      {/* 2. FAQS */}
      <section className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200/60 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500">Everything you need to know about donating and collecting surplus food.</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. CONTACT US FORM */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Contact Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
            Get In Touch
          </span>
          <h2 className="text-3xl font-black text-slate-900">
            Have Questions or Want to Partner with Us?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Whether you are a hotel chain interested in city-wide surplus donations, an NGO needing bulk volunteer coordination, or an evaluator reviewing this project — we'd love to hear from you.
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3 text-xs text-slate-700">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Email Us</span>
                <span>support@foodbridge.org</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-700">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Call Helpline</span>
                <span>+1 (800) 555-FOOD (24/7)</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-700">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Headquarters</span>
                <span>100 Sustainability Way, Green District</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-xl space-y-6">
          <h3 className="text-xl font-bold text-slate-900">Send Us a Direct Message</h3>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Message submitted successfully! Our support team will respond shortly.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="sarah@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Subject *
              </label>
              <input
                type="text"
                required
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Partnership inquiry for hotel chain"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Message *
              </label>
              <textarea
                rows="4"
                required
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your inquiry or feedback here..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-600/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Submitting...' : 'Submit Message'}</span>
            </button>
          </form>
        </div>

      </section>

    </div>
  );
};

export default AboutContactPage;
