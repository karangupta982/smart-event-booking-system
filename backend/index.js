require('dotenv').config();
const cors = require('cors');
const express = require('express');
const db = require('./configuration/database');  // import your MySQL connection
const app = express();

app.use(express.json());
app.use(cors());

// app.get('/events', async (req, res) => {
//   try {
//     const [rows] = await db.query('SELECT * FROM events');
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

app.get('/', (req,res) => res.send('API running'));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server on ${PORT}`);
});










