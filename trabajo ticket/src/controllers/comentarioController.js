//solo se puede ejecutar si no hay errores
'use strict';

const { Comentario } = require('../models');


//todo esto son las funciones que puede hacer adentro de la bd para conseguir la informacion que requiera el usuario
const getAll = async (req, res) => {
  try {
    const comentarios = await Comentario.findAll();
    res.json({ success: true, data: comentarios });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOne = async (req, res) => {
  try {
    const comentario = await Comentario.findByPk(req.params.id);
    if (!comentario) return res.status(404).json({ success: false, message: 'Comentario no encontrado' });
    res.json({ success: true, data: comentario });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { contenido, ticketId } = req.body;
    const usuarioId = req.user.id;
    const comentario = await Comentario.create({ contenido, ticketId, usuarioId });
    res.status(201).json({ success: true, data: comentario });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const comentario = await Comentario.findByPk(req.params.id);
    if (!comentario) return res.status(404).json({ success: false, message: 'Comentario no encontrado' });
    await comentario.update(req.body);
    res.json({ success: true, data: comentario });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const comentario = await Comentario.findByPk(req.params.id);
    if (!comentario) return res.status(404).json({ success: false, message: 'Comentario no encontrado' });
    await comentario.destroy();
    res.json({ success: true, message: 'Comentario eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getOne, create, update, remove };