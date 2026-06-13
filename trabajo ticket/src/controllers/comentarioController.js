'use strict';
const { Comentario } = require('../models');

const getAll = async (req, res) => {
  try {
    const where = {};
    if (req.query.ticketId) where.ticketId = req.query.ticketId;
    const comentarios = await Comentario.findAll({ where });
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los comentarios' });
  }
};

const getOne = async (req, res) => {
  try {
    const comentario = await Comentario.findByPk(req.params.id);
    if (!comentario) return res.status(404).json({ message: 'Comentario no encontrado' });
    res.json(comentario);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el comentario' });
  }
};

const create = async (req, res) => {
  try {
    const { contenido, ticketId } = req.body;
    const comentario = await Comentario.create({
      contenido, ticketId,
      usuarioId: req.usuario.id
    });
    res.status(201).json(comentario);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el comentario' });
  }
};

const update = async (req, res) => {
  try {
    const comentario = await Comentario.findByPk(req.params.id);
    if (!comentario) return res.status(404).json({ message: 'Comentario no encontrado' });
    await comentario.update(req.body);
    res.json(comentario);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el comentario' });
  }
};

const remove = async (req, res) => {
  try {
    const comentario = await Comentario.findByPk(req.params.id);
    if (!comentario) return res.status(404).json({ message: 'Comentario no encontrado' });
    await comentario.destroy();
    res.json({ message: 'Comentario eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el comentario' });
  }
};

module.exports = { getAll, getOne, create, update, remove };
