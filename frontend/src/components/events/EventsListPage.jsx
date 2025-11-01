import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import axios from '../../config/axios';
import { toast } from 'react-toastify';
import EventCard from '../common/EventCard';

const url = import.meta.env.VITE_REACT_APP_API_URL;

const EventsListPage = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${url}/events`);
        
        const mappedEvents = response.data.map(event => ({
          id: event.id,
          title: event.title,
          description: event.description,
          date: event.date,
          location: event.location,
          totalSeats: event.total_seats,
          availableSeats: event.available_seats,
          price: parseFloat(event.price),
          imageUrl: event.img
        }));
        setEvents(mappedEvents);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !locationFilter || event.location === locationFilter;
    return matchesSearch && matchesLocation;
  });

  const locations = [...new Set(events.map(e => e.location))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Upcoming Events</h1>
        
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              >
                <option value="">All Locations</option>
                {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>
          </div>
        </div>

       
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No events found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsListPage;
