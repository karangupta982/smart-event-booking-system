import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Ticket } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from '../../config/axios';
import { toast } from 'react-toastify';

const url = import.meta.env.VITE_REACT_APP_API_URL;

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [event, setEvent] = useState(location.state?.event || null);
  const [loading, setLoading] = useState(!event);
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', contact: '' });

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

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      const response = await axios.post(`${url}/bookings`, { 
        event_id: event.id, 
        name: formData.name, 
        email: formData.email, 
        mobile: formData.contact, 
        quantity: quantity 
      });
      console.log(response);
      navigate('/booking-success', { 
        state: { event, quantity, total: event.price * quantity } 
      });
      toast.success('Booking successful!');
    } catch (error) {
      console.log(error);
      toast.error('Booking failed!');
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
          <button onClick={() => navigate('/events')} className="text-purple-600 hover:text-purple-700">
            ← Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button onClick={() => navigate('/events')} className="mb-6 text-purple-600 hover:text-purple-700 flex items-center cursor-pointer">
          ← Back to Events
        </button>
        
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="h-64 bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Ticket className="h-32 w-32 text-white opacity-50" />
          </div>
          
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
            <p className="text-gray-600 mb-6">Experience an unforgettable event filled with excitement and entertainment.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center">
                <Calendar className="h-6 w-6 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold">{new Date(event.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="h-6 w-6 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold">{event.location}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="h-6 w-6 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Available Seats</p>
                  <p className="font-semibold">{event.availableSeats} / {event.totalSeats}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Ticket className="h-6 w-6 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Price per ticket</p>
                  <p className="font-semibold text-2xl text-purple-600">${event.price}</p>
                </div>
              </div>
            </div>

           
            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold mb-6">Book Your Tickets</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact</label>
                  <input
                    type="tel"
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your contact number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max={event.availableSeats}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="text-2xl font-bold text-purple-600">${event.price * quantity}</span>
                  </div>
                </div>
                <button
                  onClick={handleBooking}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 cursor-pointer"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
