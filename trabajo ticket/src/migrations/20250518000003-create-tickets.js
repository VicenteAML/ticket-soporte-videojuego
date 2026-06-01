// Este apartado llamado use stric se encargara de exigirle a javascrip que este codigo NO se puede correr si hay algo mal con el
// cuando normalmente javascrip simplemente intenta correr, con esta pieza te avisa donde hay errores
'use strict';

//module export dicta que si algun otro archivo del proyecto necesita usar algo de esta carpeta solo usara lo que esta adentro
//de estos corchetes 
module.exports = {
//Apartado 1: este apartado se encarga de exigir que el programa espere a que este apartado termine de ejecutarse
//antes de continuar con la ejecucion del resto del codigo, tambien se encarga de interactuar con la bd y acceder
//a otros tipos de datos y tambien le permite crear datos adentro de la base de datos
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tickets', {
//fin apartado 1
//Apartado 2: estas son las columnas que seran ingresados a la base de datos cuando se haga uso de este archivo,  
//cada uno de estos datos sera guardado con sus respetivas exigencias ejemplo id nunca podra ser null
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      titulo: {
        allowNull: false,
        type: Sequelize.STRING
      },
      descripcion: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      categoria: {
        allowNull: false,
        type: Sequelize.STRING
      },
      estado: {
        allowNull: false,
        defaultValue: 'abierto',
        type: Sequelize.STRING
      },
      prioridad: {
        allowNull: false,
        defaultValue: 'media',
        type: Sequelize.STRING
      },
      usuarioId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Usuarios',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
//fin apartado 2
//apartado 3: encaso de que la tabla creada anteriormente es requerido que sea elimanada, se elimina con la funcion down
  async down(queryInterface) {
    await queryInterface.dropTable('Tickets');
  }
};
//fin apartado 3