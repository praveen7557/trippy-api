const express = require('express');
const authRoutes = require('./auth.route');


const router = express.Router();

/**
 * GET /api/v1
 */
router.get('/', (req, res) => res.send('OK'));
router.use('/auth', authRoutes);

module.exports = router;
