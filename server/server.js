import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './db/database.js';
import { seedDb } from './mockData.js';

// Route Imports
import authRoutes from './routes/auth.js';
import animalRoutes from './routes/animals.js';
import adoptionRoutes from './routes/adoptions.js';
import externalRoutes from './routes/external.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// Base Check Route
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'online',
    message: 'PatiHaven API sunucusu sorunsuz çalışıyor.',
    timestamp: new Date().toISOString()
  });
});

// Route Registrations
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/animals', animalRoutes);
app.use('/api/v1/adoptions', adoptionRoutes);
app.use('/api/v1/external', externalRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Beklenmeyen bir sunucu hatası oluştu.' });
});

// Initialize DB and Start Server
const startServer = async () => {
  try {
    await initDb();
    await seedDb();
    
    app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`🐾 PatiHaven Sunucusu Başlatıldı!`);
      console.log(`🌐 PORT: ${PORT}`);
      console.log(`🔗 Sağlık Kontrolü: http://localhost:${PORT}/api/v1/health`);
      console.log(`=========================================`);
    });
  } catch (error) {
    console.error('Sunucu başlatılamadı:', error);
    process.exit(1);
  }
};

startServer();
