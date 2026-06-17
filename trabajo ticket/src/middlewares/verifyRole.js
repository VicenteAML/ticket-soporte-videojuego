'use strict';

/**
 * verifyRole(...roles)
 * Uso: router.put('/:id', verifyAccessToken, verifyRole('admin','superadmin'), controller.update)
 */
const verifyRole = (...roles) => (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ message: 'No autenticado' });
  }
  if (!roles.includes(req.usuario.rol)) {
    return res.status(403).json({ message: 'Acceso no permitido: se requiere rol ' + roles.join(' o ') });
  }
  next();
};

module.exports = verifyRole;
