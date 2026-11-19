import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Heart, Mail, Phone, MapPin, Globe, ShieldCheck, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-lg">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                FOOD<span className="text-brand-400">BRIDGE</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              FoodBridge is an intelligent, real-time food recovery platform connecting restaurants, hotels, supermarkets, and event hosts with verified NGOs and food shelters to end hunger and eliminate edible waste.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> UN SDG 2: Zero Hunger
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <Globe className="w-4 h-4" /> SDG 12: Sustainable Cities
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/donations" className="hover:text-brand-400 transition-colors">
                  Available Food
                </Link>
              </li>
              <li>
                <Link to="/add-donation" className="hover:text-brand-400 transition-colors">
                  Donate Surplus Food
                </Link>
              </li>
              <li>
                <Link to="/auth?tab=register&role=ngo" className="hover:text-brand-400 transition-colors">
                  Register as NGO / Shelter
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-400 transition-colors">
                  Impact & Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Food Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Cooked Banquet Food</li>
              <li>Bakery & Artisanal Bread</li>
              <li>Fresh Fruits & Veggies</li>
              <li>Packaged & Canned Goods</li>
              <li>Dairy & Beverages</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Get in Touch</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5 text-slate-400">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <span>support@foodbridge.org</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-400">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <span>+1 (800) 555-FOOD</span>
              </li>
              <li className="flex items-start gap-2.5 text-slate-400">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>100 Sustainability Way, Green District</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} FoodBridge Platform. All rights reserved. Built for College Project Demonstration.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline mx-0.5" />
            <span>for Zero Food Waste & Sustainable Communities</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
