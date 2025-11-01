import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from '../../config/axios';
import { toast } from 'react-toastify';


const url = import.meta.env.VITE_REACT_APP_API_URL;


const AdminEditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [event, setEvent] = useState(location.state?.event || null);
  const [loading, setLoading] = useState(!event);


  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!event && id) {
      const fetchEvent = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${url}/events`);
          const foundEvent = response.data.find(e => e.id === parseInt(id));
          if (foundEvent) {
            setEvent({
              id: foundEvent.id,
              title: foundEvent.title,
              description: foundEvent.description,
              date: foundEvent.date,
              location: foundEvent.location,
              totalSeats: foundEvent.total_seats,
              availableSeats: foundEvent.available_seats,
              price: parseFloat(foundEvent.price),
              imageUrl: foundEvent.img
            });
          }
        } catch (error) {
          console.error(error);
          toast.error('Failed to load event');
        } finally {
          setLoading(false);
        }
      };
      fetchEvent();
    }
  }, [id, event]);

  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    date: formatDateForInput(event?.date),
    location: event?.location || '',
    totalSeats: event?.totalSeats || event?.total_seats || '',
    price: event?.price || '',
    imageUrl: event?.imageUrl || event?.img || ''
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: formatDateForInput(event.date),
        location: event.location || '',
        totalSeats: event.totalSeats || event.total_seats || '',
        price: event.price || '',
        imageUrl: event.imageUrl || event.img || ''
      });
    }
  }, [event]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location: formData.location,
        total_seats: parseInt(formData.totalSeats),
        available_seats: parseInt(formData.totalSeats), 
        price: parseFloat(formData.price),
        img: formData.imageUrl || ''
      };
      
      await axios.put(`${url}/events/${id}`, eventData);
      toast.success('Event updated successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Event update failed!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 pt-16 flex items-center justify-center">
        <p className="text-gray-600">Loading event...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Event not found</p>
          <button onClick={() => navigate('/admin/dashboard')} className="text-purple-600 hover:text-purple-700">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button onClick={() => navigate('/admin/dashboard')} className="mb-6 text-purple-600 hover:text-purple-700 flex items-center cursor-pointer">
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Event</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                rows="4"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Seats</label>
                <input
                  type="number"
                  value={formData.totalSeats}
                  onChange={(e) => setFormData({...formData, totalSeats: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-lg text-lg font-semibold transition-all"
            >
              Update Event
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminEditEventPage;
