'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('usuarios');
    if (!tableInfo.resetToken) {
      await queryInterface.addColumn('usuarios', 'resetToken', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (!tableInfo.resetTokenExpiry) {
      await queryInterface.addColumn('usuarios', 'resetTokenExpiry', {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('usuarios', 'resetToken');
    await queryInterface.removeColumn('usuarios', 'resetTokenExpiry');
  },
};
