'use strict';
const express  = require('express');
const router   = express.Router();
const { pool } = require('../db');

function mapAnomaly(row) {
  return {
    id:               row.id,
    applicationId:    row.application_id,
    institutionName:  row.institution_name,
    title:            row.title,
    description:      row.description,
    severity:         row.severity,
    evidence:         row.evidence,
    clause:           row.clause,
    detectedAt:       row.detected_at,
    resolutionStatus: row.resolution_status,
    actionTaken:      row.action_taken || undefined,
  };
}

// GET /api/anomalies
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM anomalies ORDER BY detected_at DESC');
    res.json(rows.map(mapAnomaly));
  } catch (err) {
    console.error('[anomalies GET /]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/anomalies/:id
router.get('/:id', async (req, res) => {
  try {
    const [[row]] = await pool.query('SELECT * FROM anomalies WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ error: 'Anomaly not found' });
    res.json(mapAnomaly(row));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/anomalies/:id/resolve
router.post('/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, actionTaken } = req.body;
    await pool.query(
      'UPDATE anomalies SET resolution_status = ?, action_taken = ? WHERE id = ?',
      [status, actionTaken || null, id]
    );
    const [[row]] = await pool.query('SELECT * FROM anomalies WHERE id = ?', [id]);
    res.json(mapAnomaly(row));
  } catch (err) {
    console.error('[anomalies POST /:id/resolve]', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
