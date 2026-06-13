'use strict';

const validarCrearTicket = (req, res, next) => {
  const { titulo, descripcion, categoria } = req.body;
  const errores = [];
  if (!titulo || titulo.trim() === '') errores.push('El titulo es obligatorio');
  if (!descripcion || descripcion.trim() === '') errores.push('La descripcion es obligatoria');
  if (!categoria || categoria.trim() === '') errores.push('La categoria es obligatoria');
  if (errores.length > 0) {
    return res.status(400).json({ message: 'Datos invalidos', errores });
  }
  next();
};

module.exports = { validarCrearTicket };
