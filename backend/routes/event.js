const express = require('express');
const router = express.Router();
const pool = require('../configuration/database');
const { auth, authorizeRoles } = require("../middleware/auth");


router.get('/', async (req, res) => {
  try {
    const { search, location, date } = req.query;
    let sql = 'SELECT * FROM events WHERE 1=1';
    const params = [];
    
    if (search) {
      sql += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (location) {
      sql += ' AND location = ?';
      params.push(location);
    }
    if (date) {
      sql += ' AND DATE(date) = ?';
      params.push(date);
    }
    sql += ' ORDER BY date ASC';
    
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});


router.post('/', auth, authorizeRoles(['Admin']), async (req, res) => {
  try {
    const { title, description, location, date, total_seats, price, img } = req.body;
    
    if (!title || !date || !location || !total_seats || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const available_seats = total_seats || 0;
    const [result] = await pool.query(
      'INSERT INTO events (title, description, location, date, total_seats, available_seats, price, img) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, location, date, total_seats, available_seats, price, img || '']
    );
    
    const [row] = await pool.query('SELECT * FROM events WHERE id = ?', [result.insertId]);
    res.status(201).json(row[0]);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});


router.put('/:id', auth, authorizeRoles(['Admin']), async (req, res) => {
  try {
    const id = req.params.id;
    const fields = ['title', 'description', 'location', 'date', 'total_seats', 'available_seats', 'price', 'img'];
    const updates = [];
    const params = [];
    
    for (const f of fields) {
      if (req.body[f] !== undefined) {
        updates.push(`${f} = ?`);
        params.push(req.body[f]);
      }
    }
    
    if (!updates.length) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    params.push(id);
    await pool.query(`UPDATE events SET ${updates.join(', ')} WHERE id = ?`, params);
    
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
    if (!rows.length) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});


router.delete('/:id', auth, authorizeRoles(['Admin']), async (req, res) => {
  try {
    const id = req.params.id;
    
   
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
    if (!rows.length) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    await pool.query('DELETE FROM events WHERE id = ?', [id]);
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

module.exports = router;
