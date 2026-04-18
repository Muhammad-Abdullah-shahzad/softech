import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import WorkerDashboard from './pages/WorkerDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Worker Dashboard */}
        <Route path="/dashboard/worker" element={<WorkerDashboard />} />

        {/* Fallbacks */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<div className="flex items-center justify-center min-h-screen text-xl font-bold">404 - FairGig Service Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
