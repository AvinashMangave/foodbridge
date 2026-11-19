import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed,
  ShieldCheck,
  Clock,
  MapPin,
  Phone,
  Image,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { donationAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';

const IMAGE_PRESETS = [
  {
    name: 'Cooked Buffet / Curry',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Banquet Meal Packets',
    url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Fresh Vegetables',
    url: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Artisan Bakery Bread',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Fresh Seasonal Fruits',
    url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Biryani & Rice Dishes',
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80'
  }
];

const AddDonationPage = () => {
  const { user, isAuthenticated, isDonor, demoLogin } = useAuth();
  const navigate = useNavigate();

  // Helper date defaults
  const now = new Date();
  const defaultPrep = new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString().slice(0, 16);
  const defaultExpiry = new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString().slice(0, 16);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Cooked Food',
    quantity: '',
    unit: 'kg',
    servingsEstimate: '',
    preparationTime: defaultPrep,
    expiryTime: defaultExpiry,
    description: '',
    imageUrl: IMAGE_PRESETS[0].url,
    pickupAddress: user?.address || '45 Culinary Boulevard, Downtown Metro',
    pickupWindow: 'Today within the next 4 hours',
    contactNumber: user?.phone || '+1 (555) 234-5678',
    specialInstructions: 'Packaged in clean food-grade containers. Keep refrigerated or insulated.',
    foodSafetyDeclared: false,
    city: 'Downtown'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleQuantityChange = (e) => {
    const val = e.target.value;
    const qty = Number(val);
    const est = formData.unit === 'kg' ? Math.round(qty * 2.5) : qty;
    setFormData(prev => ({
      ...prev,
      quantity: val,
      servingsEstimate: est || ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.foodSafetyDeclared) {
      setError('You must accept the Food Safety & Hygienic Handling Declaration.');
      return;
    }

    setLoading(true);
    try {
      const res = await donationAPI.create(formData);
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/donations');
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Error submitting food donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Step 1 of 6: Donation Posting
        </span>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl space-y-8">
        
        {/* Header */}
        <div className="space-y-2 border-b border-slate-100 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <UtensilsCrossed className="w-3.5 h-3.5" /> Surplus Food Registration
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Add New Food Donation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Share details of edible surplus food. Our AI engine will broadcast immediate notifications to nearby verified food banks and shelters.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Donation published successfully! Redirecting to available donations...</span>
          </div>
        )}

        {/* Demo Helper if unauthenticated */}
        {!isAuthenticated && (
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-xs font-bold text-amber-900">Sign In as Demo Donor</h4>
              <p className="text-[11px] text-amber-700">
                You can test posting a donation instantly using the pre-configured restaurant demo account.
              </p>
            </div>
            <button
              onClick={() => demoLogin('donor')}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shrink-0 shadow-sm flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Login as Chef Marco (Donor)</span>
            </button>
          </div>
        )}

        {/* The Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. Food Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-brand-700">
              1. Food Item Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Food Item Name / Title *
                </label>
                <input
                  type="text"
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. 20 kg Cooked Basmati Rice & Lentil Curry"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Food Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-white"
                >
                  <option value="Cooked Food">Cooked Food (Buffet / Banquet)</option>
                  <option value="Fruits & Vegetables">Fruits & Vegetables</option>
                  <option value="Bakery & Bread">Bakery & Bread</option>
                  <option value="Packaged Food">Packaged / Dry Groceries</option>
                  <option value="Dairy Products">Dairy Products</option>
                  <option value="Beverages">Beverages & Juices</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleQuantityChange}
                    placeholder="e.g. 20"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Unit
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-white"
                  >
                    <option value="kg">kg</option>
                    <option value="servings">servings</option>
                    <option value="packets">packets</option>
                    <option value="boxes">boxes</option>
                    <option value="liters">liters</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Food Description & Ingredients
                </label>
                <textarea
                  rows="3"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe food contents, packaging condition, allergy notes (e.g. Vegetarian, contains dairy)..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* 2. Timing & Safety */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-brand-700">
              2. Preparation & Expiry Windows
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Preparation Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  name="preparationTime"
                  value={formData.preparationTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  Best Before / Expiry Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  name="expiryTime"
                  value={formData.expiryTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>

          {/* 3. Photo Preset Selector */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700">
              Food Image (Choose a Preset or Provide Custom URL)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {IMAGE_PRESETS.map((p) => (
                <div
                  key={p.name}
                  onClick={() => setFormData(prev => ({ ...prev, imageUrl: p.url }))}
                  className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all p-1 ${
                    formData.imageUrl === p.url
                      ? 'border-brand-600 ring-2 ring-brand-200'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={p.url} alt={p.name} className="w-full h-16 object-cover rounded-xl" />
                  <span className="text-[10px] font-semibold text-slate-700 block truncate mt-1 text-center">
                    {p.name}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="Or paste custom image link (https://...)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* 4. Pickup Logistics */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-brand-700">
              3. Pickup & Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Pickup Address *
                </label>
                <input
                  type="text"
                  required
                  name="pickupAddress"
                  value={formData.pickupAddress}
                  onChange={handleChange}
                  placeholder="e.g. 45 Culinary Boulevard, Downtown Metro (Kitchen Back Entrance)"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Available Pickup Window *
                </label>
                <input
                  type="text"
                  required
                  name="pickupWindow"
                  value={formData.pickupWindow}
                  onChange={handleChange}
                  placeholder="e.g. Today 5:00 PM - 8:30 PM"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="+1 (555) 234-5678"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Special Handling / Packaging Instructions
                </label>
                <input
                  type="text"
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleChange}
                  placeholder="e.g. Insulated containers required; staff will assist loading."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>

          {/* 5. Food Safety Declaration */}
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="foodSafetyDeclared"
                name="foodSafetyDeclared"
                checked={formData.foodSafetyDeclared}
                onChange={handleChange}
                className="mt-1 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-emerald-300 cursor-pointer"
              />
              <label htmlFor="foodSafetyDeclared" className="text-xs text-emerald-950 font-medium cursor-pointer leading-relaxed">
                <strong>Food Safety & Hygiene Declaration:</strong> I hereby certify that the surplus food described above has been prepared, packaged, and stored under safe culinary and sanitary standards. It has not been served or contaminated, and complies with food conservation hygiene guidelines.
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-brand-600/30 flex items-center gap-2 transition-all transform active:scale-95 disabled:opacity-50"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>{loading ? 'Publishing...' : 'Publish Surplus Food Donation'}</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};

export default AddDonationPage;
