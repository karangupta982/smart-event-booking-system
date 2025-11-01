import React from 'react';
import { Calendar, Users, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <div className="pt-16">
        
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
                Discover Amazing Events
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto">
                Book tickets to the hottest concerts, festivals, and events in your city
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate('/events')}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                >
                  Explore Events
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className="bg-white hover:bg-gray-100 text-purple-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>

        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 text-center transform hover:scale-105 transition-all">
              <Calendar className="h-12 w-12 text-purple-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Easy Booking</h3>
              <p className="text-gray-300">Book your favorite events in just a few clicks</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 text-center transform hover:scale-105 transition-all">
              <Users className="h-12 w-12 text-purple-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Real-time Updates</h3>
              <p className="text-gray-300">Live seat availability and instant confirmations</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 text-center transform hover:scale-105 transition-all">
              <Ticket className="h-12 w-12 text-purple-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Secure Tickets</h3>
              <p className="text-gray-300">Get your tickets delivered instantly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
