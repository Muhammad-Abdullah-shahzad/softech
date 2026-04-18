import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import WorkerDashboard from './pages/WorkerDashboard';

// Worker Sub-pages
import DashboardOverview from './pages/Worker/DashboardOverview';
import Earnings from './pages/Worker/Earnings';
import Verification from './pages/Worker/Verification';
import Analytics from './pages/Worker/Analytics';
import IncomeCertificate from './pages/Worker/IncomeCertificate';
import Grievances from './pages/Worker/Grievances';
import Community from './pages/Worker/Community';
import Notifications from './pages/Worker/Notifications';
import Profile from './pages/Worker/Profile';
import Anomalies from './pages/Worker/Anomalies';

import AdminDashboard from './pages/AdminDashboard';
import AnalystDashboard from './pages/AnalystDashboard';
import SupportDashboard from './pages/SupportDashboard';

// Verifier Sub-pages
import VerifierDashboard from './pages/VerifierDashboard';
import VerificationQueue from './pages/Verifier/VerificationQueue';
import ReviewDetail from './pages/Verifier/ReviewDetail';
import FlaggedRecords from './pages/Verifier/FlaggedRecords';
import VerificationHistory from './pages/Verifier/VerificationHistory';
import VerifierAnalytics from './pages/Verifier/VerifierAnalytics';

// Advocate Sub-pages
import AdvocateDashboard from './pages/AdvocateDashboard';
import AdvocateOverview from './pages/Advocate/AdvocateOverview';
import AdvocateCommunity from './pages/Advocate/AdvocateCommunity';

function App() {

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Worker Dashboard with Nested Routes */}
        <Route path="/dashboard/worker" element={<WorkerDashboard />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<DashboardOverview />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="upload" element={<Verification />} />
          <Route path="anomalies" element={<Anomalies />} /> 
          <Route path="analytics" element={<Analytics />} />
          <Route path="certificate" element={<IncomeCertificate />} />
          <Route path="grievances" element={<Grievances />} />
          <Route path="community" element={<Community />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Admin Dashboard */}
        <Route path="/dashboard/admin" element={<AdminDashboard />} />

        {/* Analyst Dashboard */}
        <Route path="/dashboard/analyst" element={<AnalystDashboard />} />

        {/* Support Dashboard */}
        <Route path="/dashboard/support" element={<SupportDashboard />} />

        {/* Advocate Dashboard with Nested Routes */}
        <Route path="/dashboard/advocate" element={<AdvocateDashboard />}>
          <Route index element={<Navigate to="analytics" replace />} />
          <Route path="analytics" element={<AdvocateOverview />} />
          <Route path="community" element={<AdvocateCommunity />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        
        {/* Verifier Dashboard with Nested Routes */}
        <Route path="/dashboard/verifier" element={<VerifierDashboard />}>
            <Route index element={<Navigate to="queue" replace />} />
            <Route path="queue" element={<VerificationQueue />} />
            <Route path="review/:id" element={<ReviewDetail />} />
            <Route path="flagged" element={<FlaggedRecords />} />
            <Route path="history" element={<VerificationHistory />} />
            <Route path="analytics" element={<VerifierAnalytics />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
        </Route>

        {/* Fallbacks */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<div className="flex items-center justify-center min-h-screen text-xl font-bold text-slate-900 bg-slate-50">404 - FairGig Service Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
