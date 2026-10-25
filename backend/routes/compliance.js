'use strict';
const express  = require('express');
const router   = express.Router();
const { pool } = require('../db');

function mapRule(row) {
  return {
    id:                  row.id,
    code:                row.code,
    name:                row.name,
    category:            row.category,
    aphChapter:          row.aph_chapter,
    version:             row.version,
    description:         row.description,
    prescribedThreshold: row.prescribed_threshold,
    isActive:            Boolean(row.is_active),
    severityIfViolated:  row.severity_if_violated,
    lastUpdated:         row.last_updated instanceof Date
                           ? row.last_updated.toISOString().slice(0,10)
                           : row.last_updated,
  };
}

// GET /api/compliance/rules
router.get('/rules', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM compliance_rules ORDER BY code');
    res.json(rows.map(mapRule));
  } catch (err) {
    console.error('[compliance GET /rules]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/compliance/rules/:id/toggle
router.put('/rules/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      'UPDATE compliance_rules SET is_active = NOT is_active WHERE id = ?',
      [id]
    );
    const [[row]] = await pool.query('SELECT * FROM compliance_rules WHERE id = ?', [id]);
    res.json(mapRule(row));
  } catch (err) {
    console.error('[compliance PUT /rules/:id/toggle]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/compliance/rules/:id
router.get('/rules/:id', async (req, res) => {
  try {
    const [[row]] = await pool.query('SELECT * FROM compliance_rules WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ error: 'Rule not found' });
    res.json(mapRule(row));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
