const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

const allowedOrigins = [
  'http://localhost:5175',
  'http://localhost:5173',
  'http://127.0.0.1:5175',
  'https://animalresc.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
const rescueRoutes = require('./routes/rescues');
const authRoutes = require('./routes/auth');
const adoptionRoutes = require('./routes/adoptions');
const paymentRoutes = require('./routes/payment');

app.use('/api/rescues', rescueRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/adoptions', adoptionRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/', (req, res) => {
  res.send('Animal Rescue Network API is running');
});

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/animal_rescue';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
