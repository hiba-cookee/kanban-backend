'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn("Tasks", "sortOrder", {
      allowNull: false,
      type: Sequelize.INTEGER,
      unique:false
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.changeColumn("Tasks", "sortOrder", {
      allowNull: false,
      type: Sequelize.INTEGER,
      unique:true
    });
  }
};
