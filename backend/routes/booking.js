const express = require('express');
const router = express.Router();
const pool = require('../configuration/database');

const { auth, authorizeRoles } = require("../middleware/auth");

// We will get io object from index.js via req.app.get('io')
function getIO(req) {
  return req.app.get('io');
}


router.post('/', auth, authorizeRoles(['Admin', 'User']), async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { event_id, name, email, contact, mobile, quantity } = req.body;
    
    const contactNumber = contact || mobile || '';
    const qty = Number(quantity || 0);
    
    if (!event_id || !name || !email || !qty || qty <= 0 ) {
      conn.release();
      return res.status(400).json({ error: 'Missing or invalid fields' });
    }

    await conn.beginTransaction();

    const [eventRows] = await conn.query('SELECT * FROM events WHERE id = ? FOR UPDATE', [event_id]);
    if (!eventRows.length) {
      await conn.rollback();
      return res.status(404).json({ error: 'Event not found' });
    }
    if(qty>eventRows[0].available_seats || qty>eventRows[0].total_seats) {
      await conn.rollback();
      return res.status(400).json({ error: 'Not enough seats available' });
    }


    const total_amount = Number(eventRows[0].price || 0) * qty;

  
    const [insertResult] = await conn.query(
      'INSERT INTO bookings (event_id, name, email, contact, quantity, total_amount, booking_date, status) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)',
      [event_id, name, email, contactNumber, qty, total_amount, 'confirmed']
    );

  
    const newAvailable = eventRows[0].available_seats - qty;
    await conn.query('UPDATE events SET available_seats = ? WHERE id = ?', [newAvailable, event_id]);

    await conn.commit();

   
    const [bookingRows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [insertResult.insertId]);

    const io = getIO(req);
    if (io) {
      io.to(`event_${event_id}`).emit('seat_update', { event_id: Number(event_id), available_seats: newAvailable });
      // also broadcast a general update channel
      io.emit('seat_update_global', { event_id: Number(event_id), available_seats: newAvailable });
    }

    res.status(201).json({ booking: bookingRows[0] });
  } catch (err) {
    await conn.rollback();
    console.error('Error creating booking:', err);
    res.status(500).json({ error: 'Failed to create booking', message: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;
