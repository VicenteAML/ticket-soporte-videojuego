'use strict';
const { Ticket } = require('../models');

const ESTADOS_PERMITIDOS = ['abierto', 'en_proceso', 'cerrado'];
const PRIORIDADES_PERMITIDAS = ['baja', 'media', 'alta'];

const getAll = async (req, res) => {
  try {
    const where = {};
    if (req.query.estado) where.estado = req.query.estado;
    if (req.query.prioridad) where.prioridad = req.query.prioridad;
    const tickets = await Ticket.findAll({ where });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los tickets' });
  }
};

const getOne = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket no encontrado' });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el ticket' });
  }
};

const create = async (req, res) => {
  try {
    const { titulo, descripcion, categoria, prioridad } = req.body;
    if (prioridad && !PRIORIDADES_PERMITIDAS.includes(prioridad)) {
      return res.status(422).json({ message: 'Prioridad invalida. Valores permitidos: ' + PRIORIDADES_PERMITIDAS.join(', ') });
    }
    const ticket = await Ticket.create({
      titulo, descripcion, categoria,
      prioridad: prioridad || 'media',
      usuarioId: req.usuario.id
    });
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el ticket' });
  }
};

const update = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket no encontrado' });
    if (req.body.estado && !ESTADOS_PERMITIDOS.includes(req.body.estado)) {
      return res.status(422).json({ message: 'Estado invalido. Valores permitidos: ' + ESTADOS_PERMITIDOS.join(', ') });
    }
    if (req.body.prioridad && !PRIORIDADES_PERMITIDAS.includes(req.body.prioridad)) {
      return res.status(422).json({ message: 'Prioridad invalida. Valores permitidos: ' + PRIORIDADES_PERMITIDAS.join(', ') });
    }
    if (req.body.tiempo_resolucion) {
      const estadoFinal = req.body.estado || ticket.estado;
      if (estadoFinal !== 'cerrado') {
        return res.status(422).json({ message: 'Solo tickets cerrados pueden registrar tiempo de resolucion' });
      }
    }
    await ticket.update(req.body);
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el ticket' });
  }
};

const remove = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket no encontrado' });
    await ticket.destroy();
    res.json({ message: 'Ticket eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el ticket' });
  }
};

const metricas = async (req, res) => {
  try {
    const tickets = await Ticket.findAll();
    const porPrioridad = { baja: 0, media: 0, alta: 0 };
    let abiertosTotales = 0;
    tickets.forEach(t => {
      if (t.estado === 'abierto' || t.estado === 'en_proceso') {
        abiertosTotales++;
        if (porPrioridad[t.prioridad] !== undefined) {
          porPrioridad[t.prioridad]++;
        }
      }
    });
    res.json({ totalTickets: tickets.length, abiertosTotales, abiertosPorPrioridad: porPrioridad });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener metricas' });
  }
};

module.exports = { getAll, getOne, create, update, remove, metricas };
