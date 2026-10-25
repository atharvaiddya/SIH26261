'use strict';
const crypto = require('crypto');
const fs     = require('fs');

/**
 * Compute SHA-256 hash of a file on disk.
 * @param {string} filePath
 * @returns {Promise<string>} hex digest
 */
async function hashFile(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('error', reject);
    stream.on('data', chunk => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

/**
 * Compute SHA-256 hash of an in-memory Buffer.
 * @param {Buffer} buffer
 * @returns {string} hex digest
 */
function hashBuffer(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * Constant-time comparison of two hex hash strings.
 * @param {string} h1
 * @param {string} h2
 * @returns {boolean}
 */
function compareHashes(h1, h2) {
  if (!h1 || !h2 || h1.length !== h2.length) return false;
  return crypto.timingSafeEqual(Buffer.from(h1, 'hex'), Buffer.from(h2, 'hex'));
}

/**
 * Generate a random SHA-256 hex string (for audit log signatures).
 * @returns {string}
 */
function randomSignature() {
  return crypto.randomBytes(32).digest('hex');
}

module.exports = { hashFile, hashBuffer, compareHashes, randomSignature };
