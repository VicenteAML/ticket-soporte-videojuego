'use strict';
const express = require('express');
const router  = express.Router();
const passwordController = require('../controllers/passwordController');

// No requieren autenticacion (el usuario no tiene sesion)
router.post('/forgot', passwordController.forgot);
router.post('/reset',  passwordController.reset);

module.exports = router;
