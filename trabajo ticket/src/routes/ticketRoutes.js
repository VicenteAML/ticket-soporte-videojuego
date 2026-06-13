'use strict';
const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { verifyAccessToken } = require('../middlewares/auth');
const { validarCrearTicket } = require('../validators/ticketValidator');

router.get('/metricas', verifyAccessToken, ticketController.metricas);
router.get('/', verifyAccessToken, ticketController.getAll);
router.get('/:id', verifyAccessToken, ticketController.getOne);
router.post('/', verifyAccessToken, validarCrearTicket, ticketController.create);
router.put('/:id', verifyAccessToken, ticketController.update);
router.delete('/:id', verifyAccessToken, ticketController.remove);

module.exports = router;
