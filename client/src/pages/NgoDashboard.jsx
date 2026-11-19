import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HeartHandshake,
  ShieldCheck,
  Clock,
  Sparkles,
  MapPin,
  Utensils,
  Truck,
  CheckCircle,
  Eye,
  AlertCircle,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { donationAPI, requestAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import UrgencyBadge from '../components/UrgencyBadge';
import FoodDetailModal from '../components/FoodDetailModal';
import RequestModal from '../components/RequestModal';

const NgoDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active_requests'); // 'active_requests' | 'recommended' | 'history'

  const [selectedDonation, setSelectedDonation] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [recRes, reqRes] = await Promise.all([
        donationAPI.getMatching(),
        requestAPI.getForNgo()
      ]);

      if (recRes.data.success) {
        setRecommendations(recRes.data.recommendations || []);
      }
      if (reqRes.data.success) {
        setMyRequests(reqRes.data.requests || []);
      }
    } catch (err) {
      console.error('Error loading NGO dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleViewDetails = (donation) => {
    setSelectedDonation(donation);
    setDetailModalOpen(true);
  };

  const handleRequestClick = (donation) => {
    setSelectedDonation(donation);
    setRequestModalOpen(true);
  };

  // KPIs
  const activeRequests = myRequests.filter(r => ['pending', 'approved', 'ready_for_pickup', 'picked_up'].includes(r.status));
  const completedRequests = myRequests.filter(r => r.status === 'delivered');
  const totalBeneficiariesFed = completedRequests.reduce((acc, r) => acc + (r.servingsNeeded || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-bold border border-white/10 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
              {user?.isVerified ? 'Verified NGO Partner' : 'Verification In Progress'}
            </span>
            <span className="text-xs text-slate-400">
              {user?.organizationName || 'Community Feeding Program'}
            </span>
          </div>

          <h1 className="text-3xl font-black">
            Welcome, {user?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            View AI-recommended surplus food donations nearby, submit one-click food requests for your beneficiaries, and track live volunteer pickups.
          </p>
        </div>

        <Link
          to="/donations"
          className="px-6 py-3.5 rounded-2xl bg-white text-blue-900 hover:bg-slate-100 font-bold text-sm shadow-xl flex items-center gap-2 transition-all transform active:scale-95 shrink-0"
        >
          <Utensils className="w-4 h-4 text-blue-600" />
          <span>Browse Available Food</span>
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h4 className="text-2xl sm:text-3xl font-black text-slate-900">{activeRequests.length}</h4>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Pickups In Progress</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <h4 className="text-2xl sm:text-3xl font-black text-slate-900">{completedRequests.length}</h4>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Successful Deliveries</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h4 className="text-2xl sm:text-3xl font-black text-slate-900">{totalBeneficiariesFed}</h4>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total People Fed</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="text-2xl sm:text-3xl font-black text-slate-900">{recommendations.length}</h4>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nearby Recommendations</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-3 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('active_requests')}
          className={`pb-3 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'active_requests'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>My Requested Food & Active Deliveries</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600">
            {activeRequests.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('recommended')}
          className={`pb-3 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'recommended'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>Smart Matches Nearby</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-brand-100 text-brand-700">
            {recommendations.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'history'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>Delivery History</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600">
            {completedRequests.length}
          </span>
        </button>
      </div>

      {/* TAB 1: ACTIVE REQUESTS & DELIVERIES */}
      {activeTab === 'active_requests' && (
        <div className="space-y-4">
          {activeRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-4">
              <Clock className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Active Food Requests</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Check out the Smart Matches tab or browse available food to claim surplus food for your shelter.
              </p>
              <button
                onClick={() => setActiveTab('recommended')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
              >
                View Recommended Food
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeRequests.map((req) => (
                <div
                  key={req._id || req.id}
                  className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                        req.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : req.status === 'approved'
                          ? 'bg-blue-100 text-blue-800'
                          : req.status === 'ready_for_pickup'
                          ? 'bg-purple-100 text-purple-800 animate-pulse'
                          : req.status === 'picked_up'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {req.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(req.createdAt).toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-lg border border-brand-200">
                        Handover Code: {req.pickupCode}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {req.donationTitle}
                    </h3>

                    <p className="text-xs text-slate-600">
                      <strong>Donor:</strong> {req.donorName} • <strong>Target Servings:</strong> {req.servingsNeeded} meals
                    </p>

                    <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-xl">
                      "{req.purposeNote}"
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto shrink-0">
                    <Link
                      to={`/tracking/${req._id || req.id}`}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Track & Update 6-Step Status</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SMART MATCHES NEARBY */}
      {activeTab === 'recommended' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 text-xs text-brand-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600 shrink-0" />
              <span>
                <strong>Smart AI Matching:</strong> Donations ranked by proximity to your shelter and urgency to prevent food waste.
              </span>
            </div>
            <Link to="/donations" className="font-bold underline text-brand-700">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((d) => (
              <div
                key={d._id || d.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="relative h-44 w-full bg-slate-100">
                  <img src={d.imageUrl} alt={d.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-800 shadow-xs">
                      {d.category}
                    </span>
                    <UrgencyBadge expiryTime={d.expiryTime} />
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-bold text-white">
                    📍 {d.distanceKm || 3} km away ({d.location?.city || 'Downtown'})
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-base text-slate-900 line-clamp-1">{d.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{d.description}</p>
                    <div className="mt-3 text-xs text-slate-600 space-y-1">
                      <div><strong>Quantity:</strong> {d.quantity} {d.unit} (~{d.servingsEstimate} meals)</div>
                      <div><strong>Donor:</strong> {d.donorOrganization || d.donorName}</div>
                      <div><strong>Window:</strong> {d.pickupWindow}</div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleViewDetails(d)}
                      className="py-2 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleRequestClick(d)}
                      className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-sm"
                    >
                      <span>Claim Food</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DELIVERY HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {completedRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-3">
              <CheckCircle className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Completed Deliveries Yet</h3>
              <p className="text-xs text-slate-500">
                Once requested surplus food is collected and confirmed distributed, completed impact records will be archived here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedRequests.map((req) => (
                <div
                  key={req._id || req.id}
                  className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">{req.donationTitle}</h4>
                    <p className="text-slate-500">
                      Donor: {req.donorName} • Beneficiaries: <strong>{req.servingsNeeded} meals served</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      Delivered
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
          loadData();
        }}
      />

    </div>
  );
};

export default NgoDashboard;
