//unicamente ejecutable cuando no hay errores
'use strict';

//import de sequelize donde estamos sacando solo la informacion de la clase model de la libreria sequelize
//para que este archivo haga uso de la clase model asi herede y haga uso de todo lo que hace la clase model
const { Model } = require('sequelize');

//un export de tipos de datos y sequelize y comentario pertenece a ticket id y usuario id por que si se busca info de estos
//llegaran en pares y extends model para que comentario pueda hacer uso de todos las funciones de model y module exports
//exporta los tipos de datos como string integers etc
module.exports = (sequelize, DataTypes) => {
  class Comentario extends Model {
    static associate(models) {
      Comentario.belongsTo(models.Ticket, { foreignKey: 'ticketId' });
      Comentario.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
    }
  }

  //comentario es un objeto de la base de datos con las siguientes columnas osea como se guarda comentario
  Comentario.init({
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ticketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Comentario',
    tableName: 'comentarios',
  });

  return Comentario;
};