import React, { useState } from 'react';
import { Ticket, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 backdrop-blur-md bg-opacity-90 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center cursor-pointer">
            <Ticket className="h-8 w-8 text-purple-300" />
            <span className="ml-2 text-2xl font-bold text-white">EventHub</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`${location.pathname === '/' ? 'text-white' : 'text-gray-200 hover:text-white'} transition-colors`}>
              Home
            </Link>
            <Link to="/events" className={`${location.pathname === '/events' ? 'text-white' : 'text-gray-200 hover:text-white'} transition-colors`}>
              Events
            </Link>
            {user ? (
              <>
                {user.role === 'Admin' && (
                  <Link to="/admin/dashboard" className={`${location.pathname === '/admin/dashboard' ? 'text-white' : 'text-gray-200 hover:text-white'} transition-colors`}>
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center space-x-4">
                  <span className="text-gray-200">{user.name}</span>
                  <button onClick={handleLogout} className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all cursor-pointer">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={`${location.pathname === '/login' ? 'text-white' : 'text-gray-200 hover:text-white'} transition-colors`}>
                  Login
                </Link>
                <Link to="/signup" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-all cursor-pointer">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      
      {mobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-br from-purple-900 to-indigo-900 border-t border-purple-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block w-full text-left px-3 py-2 text-white hover:bg-purple-800 rounded">
              Home
            </Link>
            <Link to="/events" onClick={() => setMobileMenuOpen(false)} className="block w-full text-left px-3 py-2 text-white hover:bg-purple-800 rounded">
              Events
            </Link>
            {user ? (
              <>
                {user.role === 'Admin' && (
                  <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block w-full text-left px-3 py-2 text-white hover:bg-purple-800 rounded">
                    Dashboard
                  </Link>
                )}
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-white hover:bg-red-600 rounded">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full text-left px-3 py-2 text-white hover:bg-purple-800 rounded">
                  Login
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block w-full text-left px-3 py-2 text-white hover:bg-purple-800 rounded">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
