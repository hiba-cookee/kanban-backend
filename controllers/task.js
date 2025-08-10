const { fn, col, Op } = require("sequelize");
const { Task } = require("../models");
const { User } = require("../models");
const { Category } = require("../models");
const { sequelize } = require("../models");

exports.createTask = async (req, res, next) => {
  try {
    const { title, description = null, category, tag = null, color } = req.body;
    const lastSortOrder = await Task.findOne({
      where: {
        category,
      },
      order: [["sortOrder", "DESC"]],
    });
    const newSortOrder = lastSortOrder ? lastSortOrder.sortOrder + 1 : 1;
    const task = await Task.create({
      userId: req.userId,
      title,
      description,
      category,
      tag,
      color,
      sortOrder: newSortOrder,
    });
    // const [task] = await sequelize.query(
    //   `INSERT INTO "Tasks" ("userId","title", "description", "category", "tag", "color") VALUES (:userId,:title,:description,:category,:tag,:color) RETURNING*`,
    //   {
    //     replacements: {
    //       userId: req.userId,
    //       title,
    //       description,
    //       category,
    //       tag,
    //       color,
    //     },
    //     type: sequelize.QueryTypes.INSERT,
    //   }
    // );
    res.status(201).json({ message: "Task created", task });
  } catch (err) {
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description = null,
      category,
      tag = null,
      color,
      newSortOrder,
    } = req.body;
    const task = await Task.findByPk(id);
    if (!task) {
      throw new Error("Task Not Found");
    }
    let lastSortOrder;
    if (category !== task.category) {
      lastSortOrder = await Task.findOne({
        where: {
          category: task.category,
        },
        order: [["sortOrder", "DESC"]],
      });
      console.log(lastSortOrder);
      // newSortOrder = lastSortOrder ? lastSortOrder.sortOrder + 1 : 1;
    }
    lastSortOrder = await Task.findOne({
      where: {
        category
      },
      order: [['sortOrder','DESC']]
    })
    await Task.decrement("sortOrder", {
      by: 1,
      where: {
        sortOrder: {
          [Op.gt]: task.sortOrder,
          [Op.lte]: lastSortOrder.sortOrder,
        },
        category: task.category,
      },
    });
    await Task.increment("sortOrder", {
      by: 1,
      where: {
        sortOrder: {
          [Op.gte]: newSortOrder,
          [Op.lte]:lastSortOrder.sortOrder
        },
        category,
      },
    });
    await Task.update(
      {
        title,
        description,
        category,
        tag,
        color,
        sortOrder: newSortOrder,
      },
      {
        where: { id },
      }
    );

    // const [task] = await sequelize.query(`SELECT * FROM "Tasks" WHERE "id"=?`, {
    //   replacements: [id],
    //   type: sequelize.QueryTypes.SELECT,
    // });
    // if (!task) throw new Error("Task Not Found!");
    // const [updateTask] = await sequelize.query(
    //   `UPDATE "Tasks"
    //    SET "title" = :title,
    //        "description" = :description,
    //        "category" = :category,
    //        "tag" = :tag,
    //        "color" = :color,
    //        "updatedAt" = CURRENT_TIMESTAMP
    //    WHERE "id" = :id RETURNING*`,
    //   {
    //     replacements: {
    //       id,
    //       title,
    //       description,
    //       category,
    //       tag,
    //       color,
    //     },
    //     type: sequelize.QueryTypes.UPDATE,
    //   }
    // );
    res.status(200).json({ message: "Task Updated" });
  } catch (error) {
    next(error);
  }
};

exports.getTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    let task = null;
    if (id) {
      task = await Task.findByPk(id);
      // const [result] = await sequelize.query(
      //   `SELECT * FROM "Tasks" WHERE "id"=?`,
      //   {
      //     replacements: [id],
      //     type: sequelize.QueryTypes.SELECT,
      //   }
      // );
      // task = result;
      if (!task || task.userId != req.userId)
        throw new Error("Task Not Found!");
    } else {
      task = await Task.findAll({
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: Category,
            as: "categoryName",
            attributes: ["category"],
          },
        ],
        order: [["sortOrder", "ASC"]],
      });

      // const allTask = await sequelize.query(
      //   `SELECT * FROM "Tasks" WHERE "userId"=?`,
      //   {
      //     replacements: [req.userId],
      //     type: sequelize.QueryTypes.SELECT,
      //   }
      // );
    }
    res.status(200).json({ message: "Tasks Retrieved Successfully", task });
  } catch (error) {
    next(error);
  }
};

exports.getAllTasks = async (req, res, next) => {
  try {
    const allTask = await Task.findAll({
      include: [
        {
          model: User,
          as: "created_by",
          attributes: [
            [fn("CONCAT", col("firstName"), " ", col("lastName")), "userName"],
          ],
        },
      ],
    });
    //       const [result] = await sequelize.query(`SELECT
    //   t.id AS "taskId",
    //   t."title",
    //   t."category",
    //   t."description",t."tag",t."color",
    //   JSON_AGG(
    //     JSON_BUILD_OBJECT('userName',CONCAT( u."firstName", ' ', u."lastName"))
    //   ) AS "user"
    //   FROM "Tasks" t
    //   LEFT JOIN "Users" u ON t."userId" = u.id
    //   GROUP BY t.id;
    // `);
    //       task = result;

    res.status(200).json({ message: "Tasks Retrieved Successfully", allTask });
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task || task.userId != req.userId) {
      throw new Error("Task not found!");
    }
    await task.destroy();
    await Task.decrement("sortOrder", {
      by: 1,
      where: {
        sortOrder: {
          [Op.gt]: task.sortOrder,
        },
      },
    });
    // const [task] = await sequelize.query(
    //   `DELETE FROM "Tasks" where id=? RETURNING*`,
    //   {
    //     replacements: [id],
    //     type: sequelize.QueryTypes.DELETE,
    //   }
    // );
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    next(error);
  }
};

exports.updateSortOrder = async (req, res, next) => {
  try {
    const { taskId, newIndex, category } = req.body;
    const newSortOrder = newIndex + 1; //3

    const task = await Task.findByPk(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const oldSortOrder = task.sortOrder; //5

    if (newSortOrder < oldSortOrder) {
      await Task.increment("sortOrder", {
        by: 1,
        where: {
          sortOrder: {
            [Op.gte]: newSortOrder,
            [Op.lt]: oldSortOrder,
          },
          category,
        },
      });
    } else if (newSortOrder > oldSortOrder) {
      await Task.decrement("sortOrder", {
        by: 1,
        where: {
          sortOrder: {
            [Op.lte]: newSortOrder,
            [Op.gt]: oldSortOrder,
          },
          category,
        },
      });
    }

    task.sortOrder = newSortOrder;
    await task.save();

    res.status(200).json({ message: "Sort order updated", task });
  } catch (error) {
    next(error);
  }
};
