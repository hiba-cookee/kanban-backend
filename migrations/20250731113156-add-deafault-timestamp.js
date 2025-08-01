"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Tasks", "createdAt", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });
    await queryInterface.changeColumn("Tasks", "updatedAt", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });
     await queryInterface.changeColumn("Users", "createdAt", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
     });
     await queryInterface.changeColumn("Users", "updatedAt", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn("Tasks", "createdAt", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: null,
    });
    await queryInterface.changeColumn("Tasks", "updatedAt", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: null,
    });
    await queryInterface.changeColumn("Users", "createdAt", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: null,
    });
    await queryInterface.changeColumn("Users", "updatedAt", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: null,
    });
  },
};
