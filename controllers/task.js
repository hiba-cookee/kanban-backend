const { fn, col } = require("sequelize");
const { Task } = require("../models");
const { User } = require("../models");
const { sequelize } = require("../models");

exports.createTask = async (req, res, next) => {
  try {
    const { title, description = null, category, tag = null, color } = req.body;
    const task = await Task.create({
      userId: req.userId,
      title,
      description,
      category,
      tag,
      color,
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
    const { title, description = null, category, tag = null, color } = req.body;
    const task = await Task.findByPk(id);
    if (!task) {
      throw new Error("Task Not Found");
    }
    await Task.update(
      {
        title,
        description,
        category,
        tag,
        color,
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
      if (!task || task.userId != req.userId) throw new Error("Task Not Found!");
    } else {
      task = await Task.findAll({
        where: {
          userId: req.userId,
        },
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

    // const [task] = await sequelize.query(
    //   `DELETE FROM "Tasks" where id=? RETURNING*`,
    //   {
    //     replacements: [id],
    //     type: sequelize.QueryTypes.DELETE,
    //   }
    // );
    res.status(200).json({ message: "Task deleted"});
  } catch (error) {
    next(error);
  }
};
