//no se puede usar este archivo si hay algo que tire error
'use strict';
//ticket requiere archivos de model para poder trabajar
const { Ticket } = require('../models');

//Apartado 1: hace uso de getall para conseguir todos los tickets creados en la bd en caso de error se tira un mensaje de error
const getAll = async (req, res) => {
  try {
    const tickets = await Ticket.findAll();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los tickets' });
  }
};
//fin apartado 1

//Apartado 2:hace uso de getone para conseguir 1 solo ticket de la bd y lo busca en base a un requerimiento que es id
//en caso de que la id buscada sea diferente de ticket se enviara el mensaje ticket no encontrado si hay un error se tira otro mensaje diferente
const getOne = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket no encontrado' });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el ticket' });
  }
};
//fin apartado 2

//Apartado 3: crea un ticket con titulo descripcion categoria y el usuario al que corresponde si sucede un error se tira un mensaje
const create = async (req, res) => {
  try {
    const { titulo, descripcion, categoria } = req.body;
    const ticket = await Ticket.create({
      titulo,
      descripcion,
      categoria,
      usuarioId: req.usuario.id
    });
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el ticket' });
  }
};
//fin apartado 3

//Apartado 4: actualiza un ticket que esta dentro de la bd se busca un ticket por id si la id buscada es diferente de un ticket
// se tira un mensaje de ticket no encontrado en caso de error se tira otro mensaje de errro al actualizar ticket
const update = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket no encontrado' });
    await ticket.update(req.body);
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el ticket' });
  }
};
//fin apartado 4

//Apartado 5: deletea un ticket dentro de la bd se busca ticket por id si no hay id encontradas ticket no encontrado como mensaje en caso
//un error se tira un mensaje de que ha ocurrido un error
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
//fin apartado 5
//este apartado hace exports para poder hacer uso de 5 funciones en este archivo
module.exports = { getAll, getOne, create, update, remove };