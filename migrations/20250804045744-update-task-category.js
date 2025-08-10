"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.removeColumn("Tasks", "category");

    await queryInterface.addColumn("Tasks", "category", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Categories",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT", //prevent deleting category id any task has it
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Tasks", "category");

    await queryInterface.addColumn("Tasks", "category", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
