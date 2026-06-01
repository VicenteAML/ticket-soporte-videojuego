//no ejecutable si hay errores
'use strict';

//Todo este codigo es parecido al de tickets asi que lo dejare resumido, solo se puede usar lo que esta adentro de los corchetes de
//module exports, up es para crear objetos con las columnas que estan acadentro y down para deshacerlos y async es para 
//hacer esperar al programa hasta que este archivo se termine de ejecutar
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comentarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      contenido: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      ticketId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'tickets',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      usuarioId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('comentarios');
  },
};