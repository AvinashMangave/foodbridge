import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  UtensilsCrossed,
  Bell,
  User,
  LogOut,
  PlusCircle,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Check,
  ExternalLink,
  HeartHandshake
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, demoLogin, isDonor, isNgo, isAdmin } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const notifRef = useRef(null);
  const demoRef = useRef(null);
  const userRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifDropdownOpen(false);
      }
      if (demoRef.current && !demoRef.current.contains(e.target)) {
        setDemoMenuOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDemoSignIn = async (role) => {
    try {
      await demoLogin(role);
      setDemoMenuOpen(false);
      if (role === 'donor') navigate('/donor-dashboard');
      else if (role === 'ngo') navigate('/ngo-dashboard');
      else if (role === 'admin') navigate('/admin');
    } catch (err) {
      console.error(err);
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Available Food', path: '/donations' },
    { label: 'About & Impact', path: '/about' }
  ];

  const getDashboardPath = () => {
    if (isDonor) return '/donor-dashboard';
    if (isNgo) return '/ngo-dashboard';
    if (isAdmin) return '/admin';
    return '/';
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-semibold">Admin</span>;
      case 'ngo':
        return <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-semibold">NGO / Shelter</span>;
      default:
        return <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-semibold">Food Donor</span>;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                  FOOD<span className="text-brand-600">BRIDGE</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-brand-100 text-brand-800">
                  Smart AI
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block tracking-wide">
                Save Food. Share Hope. Feed Lives.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {isAuthenticated && (
              <Link
                to={getDashboardPath()}
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  location.pathname.includes('dashboard') || location.pathname.includes('admin')
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-700 hover:text-brand-600 hover:bg-slate-50'
                }`}
              >
                <span>Dashboard</span>
              </Link>
            )}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Demo Switcher (Instant College Demo Helper) */}
            <div className="relative" ref={demoRef}>
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
                title="Quick demo access for evaluator"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Demo Accounts</span>
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
                  <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Switch Demo Persona
                  </div>
                  <button
                    onClick={() => handleDemoSignIn('donor')}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-800">Chef Marco (Restaurant)</div>
                      <div className="text-[11px] text-slate-500">Food Donor Portal</div>
                    </div>
                    {isDonor && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>
                  <button
                    onClick={() => handleDemoSignIn('ngo')}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-800">Robin Hood Army (NGO)</div>
                      <div className="text-[11px] text-slate-500">Receiver / Volunteer Portal</div>
                    </div>
                    {isNgo && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>
                  <button
                    onClick={() => handleDemoSignIn('admin')}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-800">Supervisor (Admin)</div>
                      <div className="text-[11px] text-slate-500">Platform Moderation & KPIs</div>
                    </div>
                    {isAdmin && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            {isAuthenticated && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 text-xs font-semibold bg-brand-100 text-brand-700 rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs font-medium text-brand-600 hover:text-brand-700"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-500">
                          No notifications yet. You're all caught up!
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n._id || n.id}
                            onClick={() => {
                              markAsRead(n._id || n.id);
                              if (n.link) {
                                navigate(n.link);
                                setNotifDropdownOpen(false);
                              }
                            }}
                            className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                              !n.isRead ? 'bg-brand-50/50' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                              {!n.isRead && <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-1" />}
                            </div>
                            <p className="text-xs text-slate-600 mt-1 line-clamp-2">{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1.5 block">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Donor CTA */}
            {(!isAuthenticated || isDonor) && (
              <Link
                to={isAuthenticated ? "/add-donation" : "/auth?tab=register&role=donor"}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-md shadow-brand-600/25 hover:from-brand-700 hover:to-brand-600 transition-all transform active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Donate Food</span>
              </Link>
            )}

            {/* User Profile / Auth Links */}
            {isAuthenticated ? (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-9 h-9 rounded-xl object-cover ring-2 ring-brand-500/30"
                  />
                  <div className="hidden lg:block text-left text-xs">
                    <p className="font-bold text-slate-900 line-clamp-1">{user.name}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{user.role}</p>
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <div className="mt-1">{getRoleBadge(user.role)}</div>
                    </div>
                    <Link
                      to={getDashboardPath()}
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full text-left px-3 py-2 mt-1 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Dashboard
                    </Link>
                    {isDonor && (
                      <Link
                        to="/add-donation"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-2"
                      >
                        <PlusCircle className="w-4 h-4 text-brand-600" />
                        Add Food Donation
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full text-left px-3 py-2 mt-1 rounded-xl hover:bg-red-50 text-xs font-semibold text-red-600 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth?tab=login"
                  className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?tab=register"
                  className="px-3.5 py-2 text-sm font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Join Us
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slate-800" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-600"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-base font-semibold text-brand-700 bg-brand-50"
              >
                Dashboard ({user.role.toUpperCase()})
              </Link>
            )}
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/add-donation"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl font-bold text-sm bg-brand-600 text-white shadow-sm"
            >
              + Donate Food
            </Link>
            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/auth?tab=login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700"
                >
                  Log In
                </Link>
                <Link
                  to="/auth?tab=register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold"
                >
                  Register
                </Link>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                  navigate('/');
                }}
                className="w-full text-center py-2 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
