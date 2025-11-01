import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './config/axios'; 
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LandingPage from './components/pages/LandingPage';
import EventsListPage from './components/events/EventsListPage';
import EventDetailsPage from './components/events/EventDetailsPage';
import BookingSuccessPage from './components/events/BookingSuccessPage';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import AdminDashboardPage from './components/admin/AdminDashboardPage';
import AdminCreateEventPage from './components/admin/AdminCreateEventPage';
import AdminEditEventPage from './components/admin/AdminEditEventPage';
import ProtectedRoute from './components/common/ProtectedRoute';


export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/events" element={<EventsListPage />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />
            <Route path="/booking-success" element={<BookingSuccessPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute requiredRole="Admin">
                  <AdminDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/create" 
              element={
                <ProtectedRoute requiredRole="Admin">
                  <AdminCreateEventPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/edit/:id" 
              element={
                <ProtectedRoute requiredRole="Admin">
                  <AdminEditEventPage />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </div>
      </SocketProvider>
    </AuthProvider>
  );
}
