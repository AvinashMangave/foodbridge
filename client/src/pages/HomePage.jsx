import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed,
  HeartHandshake,
  Users,
  Award,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Calculator,
  Smile,
  Truck,
  Leaf
} from 'lucide-react';
import { donationAPI } from '../api/api';
import FoodCard from '../components/FoodCard';
import FoodDetailModal from '../components/FoodDetailModal';
import RequestModal from '../components/RequestModal';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isDonor, isNgo, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [featuredDonations, setFeaturedDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  // Impact Calculator State
  const [calcKg, setCalcKg] = useState(25);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await donationAPI.getFeatured();
        if (res.data.success) {
          setFeaturedDonations(res.data.donations || []);
        }
      } catch (err) {
        console.error('Error loading featured donations:', err);
      }
    };
    fetchFeatured();
  }, []);

  const handleViewDetails = (donation) => {
    setSelectedDonation(donation);
    setDetailModalOpen(true);
  };

  const handleRequestClick = (donation) => {
    setSelectedDonation(donation);
    setRequestModalOpen(true);
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-cream-50 to-white pt-12 pb-24 border-b border-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(#16a34a_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>AI-Powered Surplus Food Redistribution</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Don't Waste Food, <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-emerald-500">
                  Donate It!
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Every day, thousands of restaurants, hotels, and supermarkets have safe, delicious surplus food. FoodBridge connects donors with local NGOs, food banks, and shelters in minutes — saving food and nourishing lives.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to={isAuthenticated && isDonor ? "/add-donation" : "/auth?tab=register&role=donor"}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-base bg-brand-600 hover:bg-brand-700 text-white shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
                >
                  <UtensilsCrossed className="w-5 h-5" />
                  <span>Donate Surplus Food</span>
                </Link>

                <Link
                  to="/donations"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-base bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 shadow-sm flex items-center justify-center gap-2 transition-all"
                >
                  <HeartHandshake className="w-5 h-5 text-brand-600" />
                  <span>Find Available Food</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Certified Food Safety</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Instant Match & Notifications</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>Live 6-Step GPS Tracking</span>
                </div>
              </div>

            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-2 bg-gradient-to-tr from-brand-500 to-amber-300 rounded-3xl blur-xl opacity-30 transform -rotate-1" />
                
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80"
                    alt="Volunteers sharing fresh meals"
                    className="w-full h-80 sm:h-96 object-cover"
                  />
                  <div className="p-6 bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                        Live Food Recovery
                      </span>
                      <span className="text-xs text-slate-400 font-medium">Just now</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">
                      Golden Spoon Restaurant shared 20 kg warm meals
                    </h3>
                    <p className="text-xs text-slate-500">
                      Claimed by Robin Hood Army for 50 shelter children. Zero waste achieved.
                    </p>
                  </div>
                </div>

                {/* Floating Micro Badge */}
                <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl p-3.5 shadow-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    🍲
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">3,450+ Meals</span>
                    <span className="text-[10px] text-slate-400">Rescued this week</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. LIVE STATISTICS COUNTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-700/60">
            
            <div className="space-y-2 pt-4 lg:pt-0">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-white">4,820+</h3>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Kg Food Donated</p>
            </div>

            <div className="space-y-2 pt-4 lg:pt-0">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-white">12,050+</h3>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">People Fed</p>
            </div>

            <div className="space-y-2 pt-4 lg:pt-0">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-white">48+</h3>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active NGOs & Shelters</p>
            </div>

            <div className="space-y-2 pt-4 lg:pt-0">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-white">12.1 Tons</h3>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">CO2 Emissions Prevented</p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
            Seamless 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            How FoodBridge Works
          </h2>
          <p className="text-sm text-slate-500">
            Our smart platform automates discovery, matching, verification, and real-time pickup tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 relative group">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center text-xl font-black mb-6 group-hover:scale-110 transition-transform">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Donor Uploads Surplus Food</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Restaurants, caterers, or grocery stores fill in the food type, quantity, preparation time, and best-before window with a food safety checklist.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-brand-600">
              <span>Instant AI Broadcast</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 relative group">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-black mb-6 group-hover:scale-110 transition-transform">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Nearby NGO Requests Food</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Verified local NGOs receive proximity notifications, inspect food specifications, and submit a pickup request with beneficiary details.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-amber-600">
              <span>Smart Distance Matching</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 relative group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-black mb-6 group-hover:scale-110 transition-transform">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Collected & Handed to Needy</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Volunteers collect the packaged food using a secure handover code. Real-time updates confirm when meals are distributed to beneficiaries.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <span>Verified Impact Logged</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </section>

      {/* 4. FEATURED AVAILABLE DONATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Urgent & Fresh Listings
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Featured Surplus Donations
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Real-time donations waiting for immediate pickup by charities and volunteers.
            </p>
          </div>

          <Link
            to="/donations"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-4 py-2.5 rounded-xl transition-colors self-start sm:self-auto"
          >
            <span>Browse All Available Food</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {featuredDonations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 p-8">
            <UtensilsCrossed className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No surplus donations currently waiting</h3>
            <p className="text-xs text-slate-400 mt-1">Be the first to donate fresh surplus food today!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDonations.map((donation) => (
              <FoodCard
                key={donation._id || donation.id}
                donation={donation}
                onViewDetails={handleViewDetails}
                onRequest={handleRequestClick}
              />
            ))}
          </div>
        )}
      </section>

      {/* 5. INTERACTIVE FOOD WASTE IMPACT CALCULATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-brand-900 via-brand-800 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold">
                <Calculator className="w-3.5 h-3.5 text-brand-400" />
                <span>Interactive Calculator</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black leading-tight">
                Calculate Your Food Waste Reduction Impact
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Move the slider to see how much positive change your kitchen or banquet can generate by donating excess meals instead of tossing them.
              </p>

              {/* Slider Input */}
              <div className="pt-4 space-y-2">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span>Surplus Food Quantity</span>
                  <span className="text-xl text-brand-400">{calcKg} kg</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  value={calcKg}
                  onChange={(e) => setCalcKg(Number(e.target.value))}
                  className="w-full h-3 bg-brand-950 rounded-lg appearance-none cursor-pointer accent-brand-400"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>5 kg (Small Cafe)</span>
                  <span>100 kg (Banquet)</span>
                  <span>200 kg (Mega Event)</span>
                </div>
              </div>
            </div>

            {/* Calculated Results Cards */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-center">
                <Users className="w-7 h-7 text-amber-400 mx-auto mb-2" />
                <span className="text-2xl font-black text-white">{Math.round(calcKg * 2.5)}</span>
                <p className="text-[11px] text-slate-300 mt-1 uppercase font-semibold">Meals Served</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-center">
                <Leaf className="w-7 h-7 text-emerald-400 mx-auto mb-2" />
                <span className="text-2xl font-black text-white">{Math.round(calcKg * 2.5)} kg</span>
                <p className="text-[11px] text-slate-300 mt-1 uppercase font-semibold">CO2e Avoided</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-center">
                <Smile className="w-7 h-7 text-brand-400 mx-auto mb-2" />
                <span className="text-2xl font-black text-white">{Math.round(calcKg * 3.8)} L</span>
                <p className="text-[11px] text-slate-300 mt-1 uppercase font-semibold">Water Preserved</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. BENEFITS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
            Shared Prosperity
          </span>
          <h2 className="text-3xl font-black text-slate-900">
            Benefits of Food Donation
          </h2>
          <p className="text-sm text-slate-500">
            A win-win ecosystem for businesses, charitable organizations, and our planet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* For Donors */}
          <div className="bg-gradient-to-br from-white to-brand-50/40 p-8 rounded-3xl border border-brand-100 shadow-sm space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold">
              👨‍🍳
            </div>
            <h3 className="text-xl font-bold text-slate-900">For Restaurants, Hotels & Caterers</h3>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <span><strong>Tax & CSR Recognition:</strong> Receive digital tax-deductible receipts and verifiable CSR sustainability metrics.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <span><strong>Eliminate Disposal Costs:</strong> Save on commercial waste collection and dumpster fees by direct pickup handover.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <span><strong>Zero Liability Protection:</strong> Covered by standard Good Samaritan food donation safety declarations.</span>
              </li>
            </ul>
          </div>

          {/* For NGOs & Shelters */}
          <div className="bg-gradient-to-br from-white to-blue-50/40 p-8 rounded-3xl border border-blue-100 shadow-sm space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
              🤝
            </div>
            <h3 className="text-xl font-bold text-slate-900">For NGOs, Shelters & Volunteers</h3>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Predictable Fresh Supply:</strong> Access daily fresh cooked meals, bakery goods, and fruits with zero sourcing cost.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Proximity Notifications:</strong> Get real-time alerts when surplus food is posted within your transport radius.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Transparent Logistics:</strong> Integrated 6-step progress tracker and OTP verification ensure seamless coordination.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            Real Stories
          </span>
          <h2 className="text-3xl font-black text-slate-900">
            Voices from Our Community
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400 text-sm">
              {'★'.repeat(5)}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "We used to throw away 25-30 kg of perfectly good banquet food every weekend. With FoodBridge, volunteer drivers arrive within 40 minutes and 80 hungry children get a hot dinner."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=120&q=80"
                alt="Chef Marco"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Chef Marco Silva</h4>
                <p className="text-[11px] text-slate-500">Golden Spoon Restaurant</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400 text-sm">
              {'★'.repeat(5)}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "The location matching and 6-step progress tracker revolutionized our collection runs. We can claim 50 meal boxes with one tap and coordinate pickup without endless phone calls."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=120&q=80"
                alt="Robin Hood Volunteer"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Aarav Patel</h4>
                <p className="text-[11px] text-slate-500">Lead Coordinator, Robin Hood Army</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400 text-sm">
              {'★'.repeat(5)}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "Our artisan bakery donates 30 loaves of surplus sourdough and baguettes daily. Knowing that shelter residents enjoy fresh bread each morning brings our team immense joy."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
                alt="Sophie Laurent"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Sophie Laurent</h4>
                <p className="text-[11px] text-slate-500">Owner, Sunrise Artisan Bakery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-brand-600 to-emerald-600 p-8 sm:p-12 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-black">Ready to Make an Impact?</h3>
            <p className="text-xs sm:text-sm text-brand-100">
              Join hundreds of restaurants, supermarkets, and shelters turning food surplus into community strength.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/auth?tab=register"
              className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-white text-brand-700 hover:bg-slate-100 shadow-md transition-all active:scale-95"
            >
              Get Started Free
            </Link>
            <Link
              to="/about"
              className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-brand-700/60 hover:bg-brand-700 text-white border border-brand-400/40 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Modals */}
      <FoodDetailModal
        donation={selectedDonation}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onRequest={handleRequestClick}
      />

      <RequestModal
        donation={selectedDonation}
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        onSuccess={() => {
          // Success callback
        }}
      />

    </div>
  );
};

export default HomePage;
