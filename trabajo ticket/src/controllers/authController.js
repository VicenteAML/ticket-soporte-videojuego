'use strict';
const tokenService = require('../services/tokenService');
const { Usuario, RefreshToken } = require('../models');

const SUPERADMIN_EMAIL = (process.env.SUPERADMIN_EMAIL || '').trim().toLowerCase();

/* Si el email coincide con SUPERADMIN_EMAIL en .env, fuerza rol superadmin */
function resolveRol(usuario) {
  if (SUPERADMIN_EMAIL && usuario.email.toLowerCase() === SUPERADMIN_EMAIL) return 'superadmin';
  return usuario.rol || 'usuario';
}

/* ───── register ───── */
const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || nombre.trim() === '')  return res.status(400).json({ message: 'El nombre es obligatorio' });
    if (!email  || email.trim()  === '')  return res.status(400).json({ message: 'El email es obligatorio' });
    if (!password || password.length < 6) return res.status(400).json({ message: 'La contrasena debe tener al menos 6 caracteres' });

    const existente = await Usuario.findOne({ where: { email } });
    if (existente) return res.status(409).json({ message: 'El email ya esta registrado' });

    const passwordHash = await Usuario.hashPassword(password);
    const usuario = await Usuario.create({ nombre, email, passwordHash, rol: 'usuario' });
    res.status(201).json({ message: 'Usuario registrado exitosamente', data: usuario.toSafeJSON() });
  } catch (error) {
    console.error('REGISTER ERROR:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

/* ───── login ───── */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email    || email.trim()    === '') return res.status(400).json({ message: 'El email es obligatorio' });
    if (!password || password.trim() === '') return res.status(400).json({ message: 'La contrasena es obligatoria' });

    const usuario = await Usuario.scope('withPassword').findOne({ where: { email } });
    if (!usuario) return res.status(401).json({ message: 'Credenciales incorrectas' });

    const valida = await usuario.validatePassword(password);
    if (!valida)  return res.status(401).json({ message: 'Credenciales incorrectas' });

    /* Resuelve el rol real (superadmin via .env, o el rol guardado en DB) */
    const rol = resolveRol(usuario);

    /* Si es superadmin y la DB aun no lo tiene, actualizarlo */
    if (rol !== usuario.rol) {
      await usuario.update({ rol });
    }

    /* Firma el access token usando tokenService (secreto correcto) */
    const accessToken = tokenService.signAccessToken({
      id:     usuario.id,
      email:  usuario.email,
      nombre: usuario.nombre,
      rol,
    });

    /* Genera refresh token opaco y lo guarda hasheado */
    const refreshToken = tokenService.generateOpaqueRefreshToken();
    await RefreshToken.create({
      usuarioId: usuario.id,
      tokenHash: tokenService.hashToken(refreshToken),
      expiresAt: tokenService.getRefreshExpiresAt(),
      userAgent: req.headers['user-agent'] || null,
      ip:        req.ip || null,
    });

    res.json({
      message: 'Login exitoso',
      data: { accessToken, refreshToken, rol, nombre: usuario.nombre },
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    res.status(500).json({ message: 'Error al iniciar sesion' });
  }
};

/* ───── refresh ───── */
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: 'Token requerido' });

    const tokenRecord = await RefreshToken.findOne({
      where: { tokenHash: tokenService.hashToken(refreshToken) },
    });
    if (!tokenRecord || !tokenRecord.isActive()) {
      return res.status(401).json({ message: 'Token invalido o expirado' });
    }

    const usuario = await Usuario.findByPk(tokenRecord.usuarioId);
    if (!usuario) return res.status(401).json({ message: 'Usuario no encontrado' });

    const rol = resolveRol(usuario);
    const newAccessToken = tokenService.signAccessToken({
      id:     usuario.id,
      email:  usuario.email,
      nombre: usuario.nombre,
      rol,
    });
    const newRefreshToken = tokenService.generateOpaqueRefreshToken();

    await tokenRecord.update({ revokedAt: new Date() });
    await RefreshToken.create({
      usuarioId: usuario.id,
      tokenHash: tokenService.hashToken(newRefreshToken),
      expiresAt: tokenService.getRefreshExpiresAt(),
      userAgent: req.headers['user-agent'] || null,
      ip:        req.ip || null,
    });

    res.json({ data: { accessToken: newAccessToken, refreshToken: newRefreshToken, rol } });
  } catch (error) {
    res.status(401).json({ message: 'Token expirado o invalido' });
  }
};

/* ───── logout ───── */
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      const tokenRecord = await RefreshToken.findOne({
        where: { tokenHash: tokenService.hashToken(refreshToken) },
      });
      if (tokenRecord) await tokenRecord.update({ revokedAt: new Date() });
    }
    res.json({ message: 'Sesion cerrada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al cerrar sesion' });
  }
};

/* ───── me ───── */
const me = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ data: usuario.toSafeJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
};

/* ───── updateMe ───── */
const updateMe = async (req, res) => {
  try {
    const usuario = await Usuario.scope('withPassword').findByPk(req.usuario.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    const { nombre, password } = req.body;
    if (nombre)   usuario.nombre = nombre;
    if (password) usuario.passwordHash = await Usuario.hashPassword(password);

    await usuario.save();
    res.json({ message: 'Perfil actualizado', data: usuario.toSafeJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar perfil' });
  }
};

/* ───── listSesiones ───── */
const listSesiones = async (req, res) => {
  try {
    const sesiones = await RefreshToken.findAll({ where: { usuarioId: req.usuario.id } });
    res.json({ data: sesiones.map((s) => s.toSessionJSON()) });
  } catch (error) {
    res.status(500).json({ message: 'Error al listar sesiones' });
  }
};

/* ───── revokeSesion ───── */
const revokeSesion = async (req, res) => {
  try {
    const sesion = await RefreshToken.findOne({
      where: { id: req.params.id, usuarioId: req.usuario.id },
    });
    if (!sesion) return res.status(404).json({ message: 'Sesion no encontrada' });
    await sesion.update({ revokedAt: new Date() });
    res.json({ message: 'Sesion revocada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al revocar sesion' });
  }
};

/* ───── revokeAllSesiones ───── */
const revokeAllSesiones = async (req, res) => {
  try {
    await RefreshToken.update(
      { revokedAt: new Date() },
      { where: { usuarioId: req.usuario.id, revokedAt: null } }
    );
    res.json({ message: 'Todas las sesiones revocadas' });
  } catch (error) {
    res.status(500).json({ message: 'Error al revocar sesiones' });
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  me,
  updateMe,
  listSesiones,
  revokeSesion,
  revokeAllSesiones,
};
