"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
     await queryInterface.addColumn("Categories", "sortOrder", {
      allowNull: false,
      type: Sequelize.INTEGER,
      autoIncrement: true,
      unique:true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Categories", "sortOrder");
  },
};
