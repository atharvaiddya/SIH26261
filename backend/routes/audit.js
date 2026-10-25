'use strict';
const express  = require('express');
const router   = express.Router();
const { pool } = require('../db');

function mapLog(row) {
  return {
    id:            row.id,
    timestamp:     row.timestamp,
    officerName:   row.officer_name,
    officerRole:   row.officer_role,
    applicationId: row.application_id,
    action:        row.action,
    details:       row.details,
    ipAddress:     row.ip_address,
    hashSignature: row.hash_signature,
  };
}

// GET /api/audit
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM audit_logs ORDER BY id DESC');
    res.json(rows.map(mapLog));
  } catch (err) {
    console.error('[audit GET /]', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
