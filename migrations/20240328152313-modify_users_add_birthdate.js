'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'birthdate', {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('users', 'birthdate'),
    ]);
  }
};
