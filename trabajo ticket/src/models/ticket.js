//Obliga a javascript a mostrar los errores si es que hay uno durante la ejecucion
'use strict';
//Indica que este archivo requiere del apartado modelo de sequelize y esto donde se encuentra? en node_modules
const { Model } = require('sequelize');

//Apartado 1: similar lo que esta arriba pero mas especifico, puede usar sequelize para poder hacer uso de DataTypes
//como lo podrian ser strings integers booleans etc y class ticket extend model indica que ticket podra hacer y acceder a todo
//lo que puede model y por concecuencia sequelize node_modules y finalmente ticketbelongsto significa que el ticket le pertenece
//al usuario osea que le estamos asignando una conexion a estas dos clases a ticket y usuario
module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    static associate(models) {
      Ticket.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
    }
  }
//fin apartado 1
//Apartado 2: ticketinit dice cuales son los tipos de datos que se les asigna a los campos del modelo si es un string int etc
  Ticket.init({
    titulo: DataTypes.STRING,
    descripcion: DataTypes.TEXT,
    categoria: DataTypes.STRING,
    estado: {
      type: DataTypes.STRING,
      defaultValue: 'abierto'
    },
    prioridad: {
      type: DataTypes.STRING,
      defaultValue: 'media'
    },
    usuarioId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Ticket',
  });
//fin apartado 2
//Return ticket devuelve todos los datos de esta clase
  return Ticket;
};