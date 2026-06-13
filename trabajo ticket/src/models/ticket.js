'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    static associate(models) {
      Ticket.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
      Ticket.hasMany(models.Comentario, { foreignKey: 'ticketId' });
    }
  }
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
    tiempo_resolucion: DataTypes.INTEGER,
    usuarioId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Ticket',
    tableName: 'tickets'
  });
  return Ticket;
};
