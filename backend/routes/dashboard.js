'use strict';
const express  = require('express');
const router   = express.Router();
const { pool } = require('../db');

// GET /api/dashboard/stats
router.get('/stats', async (req, res) => {
  try {
    const [[appStats]] = await pool.query(`
      SELECT
        COUNT(*) AS totalApplications,
        SUM(status IN ('Pending Scrutiny','Under Review')) AS pendingScrutiny,
        SUM(status IN ('Action Required','Escalated')) AS actionRequired,
        SUM(status IN ('Approved','Returned for Correction')) AS completed
      FROM applications
    `);

    const [[docStats]] = await pool.query(`
      SELECT
        COUNT(*) AS totalDocuments,
        SUM(status = 'Flagged') AS flaggedDocuments,
        SUM(status = 'Verified') AS verifiedDocuments,
        SUM(status = 'Under Inspection') AS pendingDocuments
      FROM documents
    `);

    const [[anomalyStats]] = await pool.query(`
      SELECT
        COUNT(*) AS totalAnomalies,
        SUM(resolution_status = 'Unresolved') AS unresolvedAnomalies,
        SUM(severity = 'High') AS highSeverity
      FROM anomalies
    `);

    res.json({
      totalApplications:  parseInt(appStats.totalApplications)  || 0,
      pendingScrutiny:    parseInt(appStats.pendingScrutiny)     || 0,
      actionRequired:     parseInt(appStats.actionRequired)      || 0,
      completed:          parseInt(appStats.completed)           || 0,
      totalDocuments:     parseInt(docStats.totalDocuments)      || 0,
      flaggedDocuments:   parseInt(docStats.flaggedDocuments)    || 0,
      verifiedDocuments:  parseInt(docStats.verifiedDocuments)   || 0,
      pendingDocuments:   parseInt(docStats.pendingDocuments)    || 0,
      totalAnomalies:     parseInt(anomalyStats.totalAnomalies)  || 0,
      unresolvedAnomalies:parseInt(anomalyStats.unresolvedAnomalies) || 0,
      highSeverityAnomalies: parseInt(anomalyStats.highSeverity) || 0,
    });
  } catch (err) {
    console.error('[dashboard GET /stats]', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
