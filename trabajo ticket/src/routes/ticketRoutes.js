//fuerza a java scrip a no correr el codigo si hay algo que tire errores
'use strict';

//El primer const para poder acceder a todos los otros archivos
//El segundo de express router define las rutas de como llegar a dichos archivos
//El tercero exige exportar 5 funciones desde ticketcontroller para poder hacer uso de ellas y no tener que construirlas aca tambien
//el cuarto exige info de auth osea la token de acceso del usuario para poder acceder a crear tickets de su queja
const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, remove } = require('../controllers/ticketController');
const { verifyAccessToken } = require('../middlewares/auth');

//cada accion requiere un verficar antes de concretarse por lo cual primero se verifica que el usuario tenga la token luego se hace la accion
router.get('/', verifyAccessToken, getAll);
router.get('/:id', verifyAccessToken, getOne);
router.post('/', verifyAccessToken, create);
router.put('/:id', verifyAccessToken, update);
router.delete('/:id', verifyAccessToken, remove);

//import para hacer uso de el metodo router
module.exports = router;