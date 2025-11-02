require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const eventsRouter = require('./routes/event');
const bookingsRouter = require('./routes/booking');
const { eventBookingSocket } = require('./socket');
const authRouter = require('./routes/auth');
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// mount API
app.use('/api/events', eventsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/auth', authRouter);


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Server error' });
});

// start server + socket.io
const PORT = process.env.PORT || 5000;
const io = new Server(server, {
  cors: {
    origin: ['https://smart-event-booking-system-eta.vercel.app','http://localhost:5173'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});
eventBookingSocket(io);
app.set('io', io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
