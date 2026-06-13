'use strict';

const validarCrearComentario = (req, res, next) => {
  const { contenido, ticketId } = req.body;
  const errores = [];
  if (!contenido || contenido.trim() === '') errores.push('El contenido es obligatorio');
  if (!ticketId) errores.push('El ticketId es obligatorio');
  if (errores.length > 0) {
    return res.status(400).json({ message: 'Datos invalidos', errores });
  }
  next();
};

module.exports = { validarCrearComentario };
