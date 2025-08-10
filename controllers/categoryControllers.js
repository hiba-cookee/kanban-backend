const { Op } = require("sequelize");
const { Category } = require("../models");

exports.createCategory = async (req, res, next) => {
  try {
    const { category } = req.body;
    const lastCategory = await Category.findOne({
      order: [["sortOrder", "DESC"]],
    });
    const newSortOrder = lastCategory ? lastCategory.sortOrder + 1 : 1;
    await Category.create({
      category,
      sortOrder: newSortOrder,
    });
    res.status(201).json({ message: "Category Add!" });
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { updatedCategory } = req.body;
    await Category.update(
      {
        category: updatedCategory,
      },
      {
        where: { id },
      }
    ); 
    res.status(200).json({ message: "Category Updated!" });
  } catch (error) {
    next(error);
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      order: [["sortOrder", "ASC"]],
    });
    res.status(200).json({ message: "Categories Retrieved!", categories });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    const deletedSortOrder = category.sortOrder;
    if (!category) throw new Error("Category not found!");
    await category.destroy();
    await Category.decrement("sortOrder", {
      by: 1,
      where: {
        sortOrder: {
          [Op.gt]: deletedSortOrder,
        },
      },
    });
    res.status(200).json({ message: "Category Deleted!", category });
  } catch (error) {
    next(error);
  }
};
