import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import DonationsPage from './pages/DonationsPage';
import DonorDashboard from './pages/DonorDashboard';
import NgoDashboard from './pages/NgoDashboard';
import AddDonationPage from './pages/AddDonationPage';
import TrackingPage from './pages/TrackingPage';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';
import AboutContactPage from './pages/AboutContactPage';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-cream-50 text-slate-800">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/donations" element={<DonationsPage />} />
                <Route path="/donor-dashboard" element={<DonorDashboard />} />
                <Route path="/ngo-dashboard" element={<NgoDashboard />} />
                <Route path="/add-donation" element={<AddDonationPage />} />
                <Route path="/tracking/:id" element={<TrackingPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/about" element={<AboutContactPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
