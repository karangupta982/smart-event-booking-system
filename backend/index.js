// require('dotenv').config();
// const cors = require('cors');
// const express = require('express');
// const db = require('./configuration/database');  // import your MySQL connection
// const app = express();

// app.use(express.json());
// app.use(cors());

// // app.get('/events', async (req, res) => {
// //   try {
// //     const [rows] = await db.query('SELECT * FROM events');
// //     res.json(rows);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// app.get('/', (req,res) => res.send('API running'));
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server on ${PORT}`);
// });










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

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Server error' });
});

// start server + socket.io
const PORT = process.env.PORT || 5000;
const io = new Server(server, {
  cors: {
    origin: '*', // set to frontend URL in production
    methods: ['GET', 'POST']
  }
});
eventBookingSocket(io);
app.set('io', io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
