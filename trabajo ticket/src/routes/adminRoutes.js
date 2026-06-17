'use strict';
const express = require('express');
const router  = express.Router();
const adminController = require('../controllers/adminController');
const { verifyAccessToken } = require('../middlewares/auth');
const verifyRole = require('../middlewares/verifyRole');

// Solo superadmin puede usar estas rutas
router.get('/usuarios',        verifyAccessToken, verifyRole('superadmin'), adminController.listarUsuarios);
router.put('/usuarios/:id/rol', verifyAccessToken, verifyRole('superadmin'), adminController.asignarRol);

module.exports = router;
