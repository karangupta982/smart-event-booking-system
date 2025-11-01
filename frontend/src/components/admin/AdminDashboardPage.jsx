import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import { toast } from 'react-toastify';


const url = import.meta.env.VITE_REACT_APP_API_URL;

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      setLoading(true);
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

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`${url}/events/${id}`);
        toast.success('Event deleted successfully!');
        fetchEvents();
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete event');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={() => navigate('/admin/create')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center transition-all"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Event
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-600">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-600">No events found. Create your first event!</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Title</th>
                    <th className="px-6 py-4 text-left">Date</th>
                    <th className="px-6 py-4 text-left">Location</th>
                    <th className="px-6 py-4 text-left">Seats</th>
                    <th className="px-6 py-4 text-left">Price</th>
                    <th className="px-6 py-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {events.map(event => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-semibold text-gray-900">{event.title}</td>
                      <td className="px-6 py-4 text-gray-600">{new Date(event.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-gray-600">{event.location}</td>
                      <td className="px-6 py-4 text-gray-600">{event.availableSeats} / {event.totalSeats}</td>
                      <td className="px-6 py-4 text-gray-600">${event.price}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/admin/edit/${event.id}`, { state: { event } })}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-all"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
