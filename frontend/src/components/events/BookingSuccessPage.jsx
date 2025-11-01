import React from 'react';
import { Check, Download } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';


const url = import.meta.env.VITE_REACT_APP_API_URL;

const BookingSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state;

  const downloadTicket = () => {
    if (!bookingData) return;
    
    const bookingId = Math.random().toString(36).substr(2, 9).toUpperCase();
    
   
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
   
    doc.setFillColor(124, 58, 237);
    doc.rect(0, 0, 210, 45, 'F');
    
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('EventHub Ticket', 105, 20, { align: 'center' });
    
    
    doc.setFontSize(18);
    doc.setTextColor(31, 41, 55);
    doc.text(bookingData?.event?.title || 'Event', 105, 38, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.setFont('helvetica', 'normal');
    doc.text(`Booking ID: #${bookingId}`, 105, 45, { align: 'center' });
    
    // Ticket "card" area
    doc.setFillColor(255, 255, 255); 
    doc.rect(15, 55, 180, 160, 'F');
    
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(12);
    doc.text('Event Details:', 25, 70);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(11);
    
    
    let yStart = 83;
    doc.text('Date:', 25, yStart);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55);
    const eventDate = new Date(bookingData?.event?.date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    doc.text(eventDate, 185, yStart, { align: 'right' });
    
    yStart += 10;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('Location:', 25, yStart);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55);
    doc.text(bookingData?.event?.location || 'TBA', 185, yStart, { align: 'right' });
    
    yStart += 10;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('Tickets:', 25, yStart);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55);
    doc.text(`${bookingData?.quantity} Ticket(s)`, 185, yStart, { align: 'right' });
    
    yStart += 10;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('Price per Ticket:', 25, yStart);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55);
    doc.text(`$${bookingData?.event?.price}`, 185, yStart, { align: 'right' });
    
    
    yStart += 8;
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(25, yStart, 185, yStart);
    
    yStart += 12;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55);
    doc.text('Total Amount:', 25, yStart);
    doc.setTextColor(124, 58, 237);
    doc.setFontSize(18);
    doc.text(`$${bookingData?.total}`, 185, yStart, { align: 'right' });
    
    
    yStart += 20;
    doc.setDrawColor(229, 231, 235);
    doc.setFillColor(249, 250, 251);
    doc.rect(85, yStart, 40, 40, 'FD');
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text('Scan this code at the venue entrance', 105, yStart + 50, { align: 'center' });
    
    
    yStart += 60;
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for booking with EventHub!', 105, yStart, { align: 'center' });
    doc.text('For support, contact: support@eventhub.com', 105, yStart + 5, { align: 'center' });
    doc.setFontSize(8);
    doc.text('© 2025 EventHub. All rights reserved.', 105, yStart + 12, { align: 'center' });
    
    doc.save(`EventHub_Ticket_${bookingId}.pdf`);
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No booking data found</p>
          <button onClick={() => navigate('/events')} className="text-purple-600 hover:text-purple-700">
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-16 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-8">Your tickets have been successfully booked</p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Event:</span>
                <span className="font-semibold">{bookingData?.event?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-semibold">{new Date(bookingData?.event?.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tickets:</span>
                <span className="font-semibold">{bookingData?.quantity}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-900 font-bold">Total:</span>
                <span className="text-2xl font-bold text-purple-600">${bookingData?.total}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/events')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all"
            >
              Browse More Events
            </button>
            <button
              onClick={downloadTicket}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-semibold transition-all flex items-center justify-center"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
