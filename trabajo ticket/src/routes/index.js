'use strict';
const express  = require('express');
const router   = express.Router();

const authRoutes      = require('./authRoutes');
const ticketRoutes    = require('./ticketRoutes');
const comentarioRoutes = require('./comentarioRoutes');
const passwordRoutes  = require('./passwordRoutes');
const adminRoutes     = require('./adminRoutes');

router.use('/auth',       authRoutes);
router.use('/tickets',    ticketRoutes);
router.use('/comentarios', comentarioRoutes);
router.use('/password',   passwordRoutes);
router.use('/admin',      adminRoutes);

router.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));

module.exports = router;
