'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'resetToken', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('usuarios', 'resetTokenExpiry', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('usuarios', 'resetToken');
    await queryInterface.removeColumn('usuarios', 'resetTokenExpiry');
  }
};
