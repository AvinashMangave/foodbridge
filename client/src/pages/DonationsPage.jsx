import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  LayoutGrid,
  Map as MapIcon,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  UtensilsCrossed
} from 'lucide-react';
import { donationAPI } from '../api/api';
import FoodCard from '../components/FoodCard';
import FoodDetailModal from '../components/FoodDetailModal';
import RequestModal from '../components/RequestModal';
import DonationMap from '../components/DonationMap';

const CATEGORIES = [
  'All',
  'Cooked Food',
  'Fruits & Vegetables',
  'Bakery & Bread',
  'Packaged Food',
  'Dairy Products',
  'Beverages'
];

const DonationsPage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [urgencyFilter, setUrgencyFilter] = useState(false);
  const [cityFilter, setCityFilter] = useState('');

  // Modals
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (urgencyFilter) params.urgency = 'soon';
      if (cityFilter) params.city = cityFilter;

      const res = await donationAPI.getAll(params);
      if (res.data.success) {
        setDonations(res.data.donations || []);
      }
    } catch (err) {
      console.error('Error fetching donations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [category, urgencyFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDonations();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setUrgencyFilter(false);
    setCityFilter('');
    setTimeout(fetchDonations, 0);
  };

  const handleViewDetails = (donation) => {
    setSelectedDonation(donation);
    setDetailModalOpen(true);
  };

  const handleRequest = (donation) => {
    setSelectedDonation(donation);
    setRequestModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-brand-800 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-emerald-200 border border-white/10 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Real-Time Food Rescue Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">
            Available Surplus Food Donations
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Browse inspected and safe food donations ready for immediate collection by certified charities, NGO volunteers, and food banks.
          </p>
        </div>

        {/* View Mode Toggle Switch */}
        <div className="mt-6 sm:mt-0 relative z-10 sm:absolute sm:top-10 sm:right-10 flex items-center bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'grid'
                ? 'bg-brand-500 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Grid Cards</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'map'
                ? 'bg-brand-500 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>OpenStreetMap</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
        
        {/* Search input + urgency button */}
        <div className="flex flex-col md:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by food item, cuisine, donor, or area..."
              className="w-full pl-11 pr-24 py-3 text-xs sm:text-sm rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Search
            </button>
          </form>

          {/* Expiring Soon Quick Filter */}
          <button
            onClick={() => setUrgencyFilter(!urgencyFilter)}
            className={`px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              urgencyFilter
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 ring-2 ring-amber-300'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Expiring Soon (&lt; 4 hrs)</span>
          </button>

          {/* Reset Filters */}
          {(search || category !== 'All' || urgencyFilter) && (
            <button
              onClick={handleResetFilters}
              className="px-4 py-3 rounded-2xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
            Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                category === cat
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30 font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs font-bold text-slate-500">Scanning for nearby food surplus...</p>
        </div>
      ) : donations.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-4">
          <UtensilsCrossed className="w-16 h-16 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Food Donations Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords, clearing urgency filters, or selecting "All" categories.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'map' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-semibold">Interactive OpenStreetMap: Click any marker to view food specifications & claim</span>
            <span>{donations.length} surplus locations</span>
          </div>
          <DonationMap
            donations={donations}
            onSelectDonation={(d) => {
              setSelectedDonation(d);
              setDetailModalOpen(true);
            }}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-semibold">Showing {donations.length} available donations</span>
            <span>Sorted by newest</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {donations.map((donation) => (
              <FoodCard
                key={donation._id || donation.id}
                donation={donation}
                onViewDetails={handleViewDetails}
                onRequest={handleRequest}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <FoodDetailModal
        donation={selectedDonation}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onRequest={handleRequest}
      />

      <RequestModal
        donation={selectedDonation}
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        onSuccess={() => {
          fetchDonations();
        }}
      />

    </div>
  );
};

export default DonationsPage;
