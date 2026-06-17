'use strict';
const { Usuario } = require('../models');

/* GET /admin/usuarios — listar todos los usuarios */
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'nombre', 'email', 'rol', 'createdAt']
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

/* PUT /admin/usuarios/:id/rol — asignar rol (solo superadmin) */
const asignarRol = async (req, res) => {
  try {
    const { rol } = req.body;
    if (!['admin', 'usuario'].includes(rol)) {
      return res.status(422).json({ message: 'Rol invalido. Valores permitidos: admin, usuario' });
    }
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    await usuario.update({ rol });
    res.json({ message: 'Rol actualizado correctamente', usuario: usuario.toSafeJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar rol' });
  }
};

module.exports = { listarUsuarios, asignarRol };
