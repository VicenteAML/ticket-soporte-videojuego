'use strict';
const express = require('express');
const router  = express.Router();
const ticketController = require('../controllers/ticketController');
const { verifyAccessToken } = require('../middlewares/auth');
const verifyRole = require('../middlewares/verifyRole');
const { validarCrearTicket } = require('../validators/ticketValidator');

// Metricas — solo admin/superadmin
router.get('/metricas', verifyAccessToken, verifyRole('admin', 'superadmin'), ticketController.metricas);

// Lectura — todos los roles autenticados
router.get('/',    verifyAccessToken, ticketController.getAll);
router.get('/:id', verifyAccessToken, ticketController.getOne);

// Crear — todos los roles autenticados
router.post('/', verifyAccessToken, validarCrearTicket, ticketController.create);

// Modificar / Eliminar — solo admin/superadmin
router.put('/:id',    verifyAccessToken, verifyRole('admin', 'superadmin'), ticketController.update);
router.delete('/:id', verifyAccessToken, verifyRole('admin', 'superadmin'), ticketController.remove);

module.exports = router;
