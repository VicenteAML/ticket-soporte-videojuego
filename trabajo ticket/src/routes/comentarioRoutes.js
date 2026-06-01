'use strict';

const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, remove } = require('../controllers/comentarioController');
const { verifyAccessToken } = require('../middlewares/auth');
//verifica que el usuario tiene la token para poder hacer cualquiera de estas acciones
router.get('/', verifyAccessToken, getAll);
router.get('/:id', verifyAccessToken, getOne);
router.post('/', verifyAccessToken, create);
router.put('/:id', verifyAccessToken, update);
router.delete('/:id', verifyAccessToken, remove);

module.exports = router;