"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Task.belongsTo(models.User, {
        foreignKey: "userId",
        as: "created_by",
      });
      Task.belongsTo(models.Category, {
        foreignKey: "category",
        as: "categoryName",
      });
    }
  }
  Task.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.STRING,
      category: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tag: DataTypes.STRING,
      color: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: "#FFFFFF",
      },
      sortOrder: {
        allowNull: false,
        // unique: false,
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Task",
    }
  );
  return Task;
};
