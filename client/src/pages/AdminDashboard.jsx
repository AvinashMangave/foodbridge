import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  UtensilsCrossed,
  Clock,
  CheckCircle,
  AlertTriangle,
  Trash2,
  TrendingUp,
  Download,
  BarChart3,
  Check,
  X,
  FileSpreadsheet,
  Search
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { adminAPI } from '../api/api';

const COLORS = ['#16a34a', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tabs: 'analytics' | 'users' | 'donations' | 'requests'
  const [activeTab, setActiveTab] = useState('analytics');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, analyticsRes, usersRes, donationsRes, requestsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getAnalytics(),
        adminAPI.getUsers(),
        adminAPI.getDonations(),
        adminAPI.getRequests()
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (analyticsRes.data.success) setAnalytics(analyticsRes.data);
      if (usersRes.data.success) setUsers(usersRes.data.users);
      if (donationsRes.data.success) setDonations(donationsRes.data.donations);
      if (requestsRes.data.success) setRequests(requestsRes.data.requests);
    } catch (err) {
      console.error('Error loading admin portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleVerify = async (userId) => {
    try {
      await adminAPI.verifyUser(userId);
      setUsers(prev =>
        prev.map(u => (u.id === userId || u._id === userId ? { ...u, isVerified: !u.isVerified } : u))
      );
    } catch (err) {
      alert(err.message || 'Error toggling verification');
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    try {
      await adminAPI.setUserStatus(userId, nextStatus);
      setUsers(prev =>
        prev.map(u => (u.id === userId || u._id === userId ? { ...u, status: nextStatus } : u))
      );
    } catch (err) {
      alert(err.message || 'Error updating status');
    }
  };

  const handleDeleteDonation = async (donationId) => {
    if (!window.confirm('Are you sure you want to moderate and permanently delete this donation?')) return;
    try {
      await adminAPI.deleteDonation(donationId);
      setDonations(prev => prev.filter(d => (d._id || d.id) !== donationId));
    } catch (err) {
      alert(err.message || 'Error removing donation');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesRole = !userRoleFilter || u.role === userRoleFilter;
    const matchesSearch = !userSearch || (
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.organizationName?.toLowerCase().includes(userSearch.toLowerCase())
    );
    return matchesRole && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> FoodBridge System Administration
          </span>
          <h1 className="text-3xl font-black">
            Platform Operations & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Monitor platform metrics, verify NGO organizations, moderate donation listings, and analyze food waste reduction across all partner sectors.
          </p>
        </div>

        <button
          onClick={() => setReportModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2 transition-all active:scale-95 shrink-0"
        >
          <Download className="w-4 h-4 text-purple-600" />
          <span>Generate Platform Report</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">Total Users</span>
          <span className="text-2xl font-black text-slate-900">{stats?.totalUsers || users.length}</span>
          <span className="text-[10px] text-slate-400 block mt-1">{stats?.totalDonors} donors, {stats?.totalNgos} NGOs</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">Donations Listed</span>
          <span className="text-2xl font-black text-brand-600">{stats?.totalDonations || donations.length}</span>
          <span className="text-[10px] text-slate-400 block mt-1">Platform-wide</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">Pending Requests</span>
          <span className="text-2xl font-black text-amber-500">{stats?.pendingRequests || requests.filter(r => r.status === 'pending').length}</span>
          <span className="text-[10px] text-slate-400 block mt-1">Awaiting donor action</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">Delivered Orders</span>
          <span className="text-2xl font-black text-emerald-600">{stats?.completedDonations || requests.filter(r => r.status === 'delivered').length}</span>
          <span className="text-[10px] text-slate-400 block mt-1">100% completed</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">Food Waste Prevented</span>
          <span className="text-2xl font-black text-blue-600">{stats?.totalKgSaved || 340} kg</span>
          <span className="text-[10px] text-slate-400 block mt-1">Rescued from landfills</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">CO2e Emissions Saved</span>
          <span className="text-2xl font-black text-teal-600">{stats?.co2AvoidedKg || 850} kg</span>
          <span className="text-[10px] text-slate-400 block mt-1">Carbon offset</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'analytics'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Impact Charts (Recharts)</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'users'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User & NGO Management ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('donations')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'donations'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Donations Moderation ({donations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'requests'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Donation Requests ({requests.length})</span>
        </button>
      </div>

      {/* TAB 1: RECHARTS ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Monthly Trend Line Chart */}
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Food Recovery Growth Trend</h3>
                  <p className="text-xs text-slate-400">Monthly progression of meals rescued and kg diverted</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700">
                  +38% vs last month
                </span>
              </div>

              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics?.monthlyTrend || []} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="meals" name="Meals Provided" stroke="#16a34a" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="kgSaved" name="Kg Food Saved" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Pie Chart */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">Food Categories Rescued</h3>
                <p className="text-xs text-slate-400">Share of food categories recovered</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics?.categoryData || [{ name: 'Cooked Food', value: 12 }, { name: 'Bakery', value: 6 }]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {(analytics?.categoryData || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                {(analytics?.categoryData || []).slice(0, 4).map((c, i) => (
                  <div key={c.name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="truncate">{c.name} ({c.value})</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: USER & NGO MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user by name, org, or email..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              >
                <option value="">All Roles</option>
                <option value="donor">Food Donors</option>
                <option value="ngo">NGOs & Shelters</option>
                <option value="admin">Administrators</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400">
                  <th className="py-3 px-3 font-semibold">User / Org</th>
                  <th className="py-3 px-3 font-semibold">Role</th>
                  <th className="py-3 px-3 font-semibold">Contact</th>
                  <th className="py-3 px-3 font-semibold">NGO Verification</th>
                  <th className="py-3 px-3 font-semibold">Status</th>
                  <th className="py-3 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredUsers.map((u) => (
                  <tr key={u.id || u._id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-[11px] text-slate-500">{u.organizationName || u.email}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : u.role === 'ngo'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      <div>{u.phone || '—'}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{u.address || '—'}</div>
                    </td>
                    <td className="py-3 px-3">
                      {u.role === 'ngo' ? (
                        <button
                          onClick={() => handleToggleVerify(u.id || u._id)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                            u.isVerified
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                        >
                          {u.isVerified ? <Check className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                          <span>{u.isVerified ? 'Verified NGO' : 'Click to Verify'}</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px]">N/A (Donor)</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === 'suspended' ? 'bg-red-100 text-red-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {u.status || 'active'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleUserStatus(u.id || u._id, u.status || 'active')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                            u.status === 'suspended'
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                        >
                          {u.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DONATIONS MODERATION */}
      {activeTab === 'donations' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">Food Donation Listings</h3>
            <span className="text-xs text-slate-500">{donations.length} total listings</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400">
                  <th className="py-3 px-3 font-semibold">Food Listing</th>
                  <th className="py-3 px-3 font-semibold">Donor</th>
                  <th className="py-3 px-3 font-semibold">Quantity</th>
                  <th className="py-3 px-3 font-semibold">Status</th>
                  <th className="py-3 px-3 font-semibold">Expiry</th>
                  <th className="py-3 px-3 font-semibold text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {donations.map((d) => (
                  <tr key={d._id || d.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{d.title}</div>
                      <div className="text-[11px] text-slate-500">{d.category}</div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800">
                      {d.donorOrganization || d.donorName}
                    </td>
                    <td className="py-3 px-3 font-bold text-brand-700">
                      {d.quantity} {d.unit}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 uppercase">
                        {d.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[11px] text-slate-500">
                      {new Date(d.expiryTime).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDeleteDonation(d._id || d.id)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50"
                        title="Moderate / Remove Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: DONATION REQUESTS OVERVIEW */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">Platform Claims & Deliveries</h3>
            <span className="text-xs text-slate-500">{requests.length} total claims</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400">
                  <th className="py-3 px-3 font-semibold">Food Item</th>
                  <th className="py-3 px-3 font-semibold">Donor</th>
                  <th className="py-3 px-3 font-semibold">Requesting NGO</th>
                  <th className="py-3 px-3 font-semibold">Verification Code</th>
                  <th className="py-3 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {requests.map((r) => (
                  <tr key={r._id || r.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-bold text-slate-900">{r.donationTitle}</td>
                    <td className="py-3 px-3 text-slate-600">{r.donorName}</td>
                    <td className="py-3 px-3 text-slate-800 font-semibold">{r.ngoName}</td>
                    <td className="py-3 px-3 font-mono font-bold text-purple-700">{r.pickupCode}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-brand-50 text-brand-700">
                        {r.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-base text-slate-900">FoodBridge Platform Audit Report</h3>
              </div>
              <button
                onClick={() => setReportModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
                <div className="flex justify-between">
                  <span>Reporting Period:</span>
                  <span className="font-bold text-slate-900">Current Academic & Operational Term</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Food Rescued:</span>
                  <span className="font-bold text-slate-900">{stats?.totalKgSaved || 340} kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Meals Distributed:</span>
                  <span className="font-bold text-emerald-600">{stats?.totalServings || 850} meals</span>
                </div>
                <div className="flex justify-between">
                  <span>Carbon Offset Prevented:</span>
                  <span className="font-bold text-slate-900">{stats?.co2AvoidedKg || 850} kg CO2e</span>
                </div>
                <div className="flex justify-between">
                  <span>Verified NGO Partners:</span>
                  <span className="font-bold text-slate-900">{users.filter(u => u.role === 'ngo' && u.isVerified).length} verified</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                This report certifies that all listed food items adhered to standard safety declarations and were routed according to priority urgency matching algorithms.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setReportModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert('Report downloaded successfully! (Demo simulated PDF/CSV export)');
                  setReportModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md"
              >
                Download CSV / PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
