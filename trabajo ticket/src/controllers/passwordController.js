'use strict';
const crypto = require('crypto');
const { Usuario } = require('../models');

/* POST /password/forgot — genera token y lo muestra en terminal */
const forgot = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || email.trim() === '') {
      return res.status(400).json({ message: 'El email es obligatorio' });
    }

    const usuario = await Usuario.findOne({ where: { email: email.trim().toLowerCase() } });
    if (!usuario) {
      // Por seguridad, no revelar si el email existe o no
      return res.json({ message: 'Si el email existe, se genero un token. Revisa la terminal del servidor.' });
    }

    // Generar token de 6 caracteres (facil de copiar)
    const resetToken = crypto.randomBytes(3).toString('hex').toUpperCase();
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    await usuario.update({ resetToken, resetTokenExpiry });

    // Mostrar en terminal (ya que es proyecto de practica)
    console.log('');
    console.log('==========================================');
    console.log('  TOKEN DE RESTABLECIMIENTO DE CONTRASENA');
    console.log('==========================================');
    console.log('  Email:  ' + usuario.email);
    console.log('  Token:  ' + resetToken);
    console.log('  Expira: ' + resetTokenExpiry.toLocaleString());
    console.log('==========================================');
    console.log('');

    res.json({ message: 'Si el email existe, se genero un token. Revisa la terminal del servidor.' });
  } catch (error) {
    console.error('FORGOT ERROR:', error);
    res.status(500).json({ message: 'Error al procesar solicitud' });
  }
};

/* POST /password/reset — verifica token y cambia contrasena */
const reset = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({ message: 'Email, token y nueva contrasena son obligatorios' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'La contrasena debe tener al menos 6 caracteres' });
    }

    const usuario = await Usuario.scope('withPassword').findOne({
      where: { email: email.trim().toLowerCase() }
    });

    if (!usuario) {
      return res.status(400).json({ message: 'Token invalido o expirado' });
    }

    // Verificar token
    if (!usuario.resetToken || usuario.resetToken !== token.trim().toUpperCase()) {
      return res.status(400).json({ message: 'Token invalido o expirado' });
    }

    // Verificar expiracion
    if (!usuario.resetTokenExpiry || new Date() > new Date(usuario.resetTokenExpiry)) {
      return res.status(400).json({ message: 'Token invalido o expirado' });
    }

    // Cambiar contrasena y limpiar token
    const passwordHash = await Usuario.hashPassword(newPassword);
    await usuario.update({
      passwordHash,
      resetToken: null,
      resetTokenExpiry: null,
    });

    console.log('Contrasena restablecida para: ' + usuario.email);

    res.json({ message: 'Contrasena restablecida exitosamente' });
  } catch (error) {
    console.error('RESET ERROR:', error);
    res.status(500).json({ message: 'Error al restablecer contrasena' });
  }
};

module.exports = { forgot, reset };
