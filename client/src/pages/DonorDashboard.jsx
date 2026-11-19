import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed,
  PlusCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Trash2,
  ThumbsUp,
  XCircle,
  PackageCheck,
  TrendingUp,
  Building,
  Bell,
  ArrowRight
} from 'lucide-react';
import { donationAPI, requestAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import UrgencyBadge from '../components/UrgencyBadge';

const DonorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'donations'
  const [statusMessage, setStatusMessage] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [donationsRes, requestsRes] = await Promise.all([
        donationAPI.getMyDonations(),
        requestAPI.getForDonor()
      ]);

      if (donationsRes.data.success) {
        setDonations(donationsRes.data.donations || []);
      }
      if (requestsRes.data.success) {
        setRequests(requestsRes.data.requests || []);
      }
    } catch (err) {
      console.error('Error loading donor dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (requestId, status, note = '') => {
    setActionLoading(true);
    try {
      const res = await requestAPI.updateStatus(requestId, { status, note });
      if (res.data.success) {
        setStatusMessage(res.data.message);
        setTimeout(() => setStatusMessage(''), 4000);
        await loadData();
      }
    } catch (err) {
      alert(err.message || 'Error updating request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteDonation = async (id) => {
    if (!window.confirm('Are you sure you want to delete this donation listing?')) return;
    try {
      await donationAPI.delete(id);
      await loadData();
    } catch (err) {
      alert(err.message || 'Error deleting donation');
    }
  };

  // KPIs
  const totalKg = donations.reduce((acc, d) => acc + (d.quantity || 0), 0);
  const totalMeals = donations.reduce((acc, d) => acc + (d.servingsEstimate || Math.round((d.quantity || 0) * 2.5)), 0);
  const pendingRequestsCount = requests.filter(r => r.status === 'pending').length;
  const completedCount = requests.filter(r => r.status === 'delivered').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-800 to-emerald-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-200 text-xs font-bold border border-white/10">
            <Building className="w-3.5 h-3.5" />
            <span>{user?.organizationName || 'Donor Kitchen Hub'}</span>
          </div>
          <h1 className="text-3xl font-black">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Manage your surplus food donations, review incoming NGO collection requests, and track real-time delivery status to make zero-waste hunger relief possible.
          </p>
        </div>

        <Link
          to="/add-donation"
          className="px-6 py-3.5 rounded-2xl bg-white text-brand-800 hover:bg-slate-100 font-bold text-sm shadow-xl flex items-center gap-2 transition-all transform active:scale-95 shrink-0"
        >
          <PlusCircle className="w-5 h-5 text-brand-600" />
          <span>Add New Food Donation</span>
        </Link>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <h4 className="text-2xl sm:text-3xl font-black text-slate-900">{totalKg} kg</h4>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Donated ({totalMeals} meals)</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h4 className="text-2xl sm:text-3xl font-black text-slate-900">{pendingRequestsCount}</h4>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending NGO Requests</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <PackageCheck className="w-5 h-5" />
          </div>
          <h4 className="text-2xl sm:text-3xl font-black text-slate-900">{donations.filter(d => d.status === 'available').length}</h4>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Available Listings</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <h4 className="text-2xl sm:text-3xl font-black text-slate-900">{completedCount}</h4>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Deliveries</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-3 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'requests'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>Incoming Requests</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600">
            {requests.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('donations')}
          className={`pb-3 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'donations'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>My Food Listings</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600">
            {donations.length}
          </span>
        </button>
      </div>

      {/* TAB 1: INCOMING REQUESTS */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-3">
              <Clock className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Incoming Requests Yet</h3>
              <p className="text-xs text-slate-500">
                When nearby NGOs or volunteer shelters request your food, their claims will appear here for your one-click approval.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
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
                          ? 'bg-purple-100 text-purple-800'
                          : req.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {req.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(req.createdAt).toLocaleString()}
                      </span>
                      <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-lg">
                        Code: {req.pickupCode}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {req.donationTitle}
                    </h3>
                    
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong>Requested by:</strong> {req.ngoName} • <strong>Servings:</strong> {req.servingsNeeded} meals
                    </p>
                    
                    <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      "{req.purposeNote}"
                    </p>

                    <div className="text-xs text-slate-500 flex items-center gap-4">
                      <span>ETA: <strong>{req.pickupEstimatedTime}</strong></span>
                      <span>Phone: <strong>{req.ngoPhone || '+1 (555) 912-3456'}</strong></span>
                    </div>
                  </div>

                  {/* Donor Actions */}
                  <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto shrink-0">
                    {req.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          disabled={actionLoading}
                          onClick={() => handleUpdateStatus(req._id || req.id, 'approved', 'Chef Marco confirmed availability')}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          disabled={actionLoading}
                          onClick={() => handleUpdateStatus(req._id || req.id, 'rejected', 'Surplus depleted')}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {req.status === 'approved' && (
                      <button
                        disabled={actionLoading}
                        onClick={() => handleUpdateStatus(req._id || req.id, 'ready_for_pickup', 'Food packaged in hot carriers at kitchen bay')}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <PackageCheck className="w-3.5 h-3.5" />
                        <span>Mark Ready for Pickup</span>
                      </button>
                    )}

                    <Link
                      to={`/tracking/${req._id || req.id}`}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Track Journey</span>
                    </Link>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY FOOD LISTINGS */}
      {activeTab === 'donations' && (
        <div className="space-y-4">
          {donations.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-4">
              <UtensilsCrossed className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Food Donations Listed Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Got excess meals, bread, or raw produce? Create a new donation post to connect with local shelters instantly.
              </p>
              <Link
                to="/add-donation"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Food Donation Now</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donations.map((d) => (
                <div
                  key={d._id || d.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm flex flex-col justify-between"
                >
                  <div className="relative h-44 w-full bg-slate-100">
                    <img
                      src={d.imageUrl}
                      alt={d.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md text-slate-800 shadow-xs">
                        {d.category}
                      </span>
                      <UrgencyBadge expiryTime={d.expiryTime} />
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="capitalize font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                          {d.status.replace('_', ' ')}
                        </span>
                        <span>{d.quantity} {d.unit}</span>
                      </div>
                      <h4 className="font-bold text-base text-slate-900 line-clamp-1">{d.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{d.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400">
                        {new Date(d.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => handleDeleteDonation(d._id || d.id)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default DonorDashboard;
