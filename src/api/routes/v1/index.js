const express = require('express');
const authRoutes = require('./auth.route');
const tripRoutes = require('./trip.route');
const { isAuthorized } = require("../../middlewares/auth/auth.middleware")


const router = express.Router();

/**
 * GET /api/v1
 */
router.get('/', (req, res) => res.send('OK'));
router.use('/auth', authRoutes);
router.use('/trip', isAuthorized(), tripRoutes);

module.exports = router;
