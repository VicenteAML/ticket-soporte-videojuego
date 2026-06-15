const express = require('express');
const config = require('../config');
const authRoutes = require('./authRoutes');
const passwordRoutes = require('./passwordRoutes');
const ticketRoutes = require('./ticketRoutes')
const comentarioRoutes = require('./comentarioRoutes')

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: `Bienvenido a ${config.app.name}`,
    version: config.app.version,
    docs: '/docs (ver carpeta docs/ en el repositorio)',
  });
});

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.use('/auth', authRoutes);
router.use('/password', passwordRoutes);
router.use('/tickets', ticketRoutes);
router.use('/comentarios', comentarioRoutes);

module.exports = router;
