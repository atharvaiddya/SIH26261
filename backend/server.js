'use strict';
const express = require('express');
const cors    = require('cors');
const path    = require('path');
require('dotenv').config();

const { initDB } = require('./db');

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/applications', require('./routes/applications'));
app.use('/api/documents',    require('./routes/documents'));
app.use('/api/anomalies',    require('./routes/anomalies'));
app.use('/api/compliance',   require('./routes/compliance'));
app.use('/api/audit',        require('./routes/audit'));
app.use('/api/dashboard',    require('./routes/dashboard'));

app.get('/', (req, res) => {
  res.json({
    status:  'ok',
    service: 'AICTE Setu Backend',
    version: '1.0.0',
    uptime:  process.uptime().toFixed(1) + 's',
  });
});

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

app.use((err, req, res, _next) => {
  console.error('[UNHANDLED]', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n✅  AICTE Setu Backend — http://localhost:${PORT}`);
      console.log(`    Frontend origin: http://localhost:5173`);
      console.log(`    DB: ${process.env.DB_NAME || 'aicte_setu'} @ ${process.env.DB_HOST || 'localhost'}\n`);
    });
  })
  .catch(err => {
    console.warn(`\n⚠️  DB init failed (${err.message})`);
    console.warn(`    Starting WITHOUT database — API will return 500 on DB routes.\n`);
    app.listen(PORT, () => {
      console.log(`⚠️  AICTE Setu Backend (no DB) — http://localhost:${PORT}`);
    });
  });
