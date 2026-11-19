import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  HeartHandshake,
  ShieldCheck,
  Building,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, demoLogin, isAuthenticated, user } = useAuth();

  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  const initialRole = searchParams.get('role') === 'ngo' ? 'ngo' : 'donor';

  const [tab, setTab] = useState(initialTab);
  const [role, setRole] = useState(initialRole);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    organizationName: '',
    focusArea: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already authenticated, redirect to appropriate dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'donor') navigate('/donor-dashboard');
      else if (user.role === 'ngo') navigate('/ngo-dashboard');
      else if (user.role === 'admin') navigate('/admin');
      else navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedUser = await login(formData.email, formData.password);
      if (loggedUser.role === 'donor') navigate('/donor-dashboard');
      else if (loggedUser.role === 'ngo') navigate('/ngo-dashboard');
      else if (loggedUser.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const regUser = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
        phone: formData.phone,
        address: formData.address,
        organizationName: formData.organizationName,
        focusArea: formData.focusArea
      });

      if (regUser.role === 'donor') navigate('/donor-dashboard');
      else if (regUser.role === 'ngo') navigate('/ngo-dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async (demoRole) => {
    setError('');
    setLoading(true);
    try {
      const demoUser = await demoLogin(demoRole);
      if (demoUser.role === 'donor') navigate('/donor-dashboard');
      else if (demoUser.role === 'ngo') navigate('/ngo-dashboard');
      else if (demoUser.role === 'admin') navigate('/admin');
    } catch (err) {
      setError(err.message || 'Demo sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-md">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-slate-900">
            FOOD<span className="text-brand-600">BRIDGE</span>
          </span>
        </Link>
        <p className="text-xs text-slate-500 font-medium">
          Save Food. Share Hope. Feed Lives.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl space-y-6">
        
        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl">
          <button
            onClick={() => { setTab('login'); setError(''); }}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
              tab === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('register'); setError(''); }}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
              tab === 'register'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Demo Persona Shortcuts (One Click Login for Presentation) */}
        <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              1-Click Demo Accounts (Fast Presentation):
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoSignIn('donor')}
              className="py-1.5 px-2 bg-white hover:bg-amber-100 text-amber-900 text-[11px] font-bold rounded-xl border border-amber-200 transition-colors truncate"
            >
              👨‍🍳 Donor (Restaurant)
            </button>
            <button
              type="button"
              onClick={() => handleDemoSignIn('ngo')}
              className="py-1.5 px-2 bg-white hover:bg-amber-100 text-amber-900 text-[11px] font-bold rounded-xl border border-amber-200 transition-colors truncate"
            >
              🤝 NGO (Robin Hood)
            </button>
            <button
              type="button"
              onClick={() => handleDemoSignIn('admin')}
              className="py-1.5 px-2 bg-white hover:bg-amber-100 text-amber-900 text-[11px] font-bold rounded-xl border border-amber-200 transition-colors truncate"
            >
              🛡️ Admin Supervisor
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {tab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@organization.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-600/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to FoodBridge'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            
            {/* User Type Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                I want to register as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setRole('donor')}
                  className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                    role === 'donor'
                      ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-100'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <UtensilsCrossed className="w-5 h-5 text-brand-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Food Donor</h4>
                    <p className="text-[10px] text-slate-500">Restaurant / Hotel / Individual</p>
                  </div>
                </div>

                <div
                  onClick={() => setRole('ngo')}
                  className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                    role === 'ngo'
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-100'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <HeartHandshake className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">NGO / Receiver</h4>
                    <p className="text-[10px] text-slate-500">Charity / Food Bank / Shelter</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name / Contact Person *
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Chef John Doe"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
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
                  placeholder="john@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {role === 'ngo' ? 'Organization / Shelter Name *' : 'Business / Restaurant Name'}
                </label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  placeholder={role === 'ngo' ? 'e.g. Hope Orphanage Foundation' : 'e.g. Grand Bistro'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Physical Pickup / Operation Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street, City, Postal Code"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default AuthPage;
