'use strict';
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { Usuario } = require('../models');

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000);
    await usuario.update({ resetToken, resetTokenExpiry });
    res.json({ message: 'Token generado. En produccion se enviaria por correo.', resetToken });
  } catch (error) {
    res.status(500).json({ message: 'Error al procesar la solicitud' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    const usuario = await Usuario.findOne({ where: { resetToken } });
    if (!usuario || !usuario.resetTokenExpiry || new Date(usuario.resetTokenExpiry) < new Date()) {
      return res.status(400).json({ message: 'Token invalido o expirado' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await usuario.update({ password: hashedPassword, resetToken: null, resetTokenExpiry: null });
    res.json({ message: 'Contrasena actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al restablecer la contrasena' });
  }
};

module.exports = { forgotPassword, resetPassword };
