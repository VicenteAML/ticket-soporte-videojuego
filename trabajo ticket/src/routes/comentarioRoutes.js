'use strict';
const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentarioController');
const { verifyAccessToken } = require('../middlewares/auth');
const { validarCrearComentario } = require('../validators/comentarioValidator');

router.get('/', verifyAccessToken, comentarioController.getAll);
router.get('/:id', verifyAccessToken, comentarioController.getOne);
router.post('/', verifyAccessToken, validarCrearComentario, comentarioController.create);
router.put('/:id', verifyAccessToken, comentarioController.update);
router.delete('/:id', verifyAccessToken, comentarioController.remove);

module.exports = router;
