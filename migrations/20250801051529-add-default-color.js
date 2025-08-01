'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn("Tasks","color", {
      allowNull: false,
      type: Sequelize.STRING,
      defaultValue:"#FFFFFF"
    } );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn("Tasks","color", {
      allowNull: null,
      type: Sequelize.STRING,
      defaultValue:null
    } );
  }
};
