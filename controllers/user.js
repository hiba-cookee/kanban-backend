const { sequelize, Task, User } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { fn, col } = require("sequelize");

exports.createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("Email Already Exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    // const [existingUser] = await sequelize.query(
    //   `SELECT 1 FROM "Users" WHERE "email"=?`,
    //   {
    //     replacements: [email],
    //     type: sequelize.QueryTypes.SELECT,
    //   }
    // );
    // if (existingUser) {
    //   throw new Error("Email Already Exists");
    // }
    // const hashedPassword = await bcrypt.hash(password, 10);
    // const newUser = await sequelize.query(
    //   `INSERT INTO "Users" ("firstName", "lastName", "email", "password" ) VALUES (:firstName, :lastName, :email, :password ) RETURNING *`,
    //   {
    //     replacements: {
    //       firstName,
    //       lastName,
    //       email,
    //       password: hashedPassword,
    //     },
    //     type: sequelize.QueryTypes.INSERT,
    //   }
    // );
    res
      .status(201)
      .json({ message: "User created successfully"});
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("User not found");
    }
    // const [existingUser] = await sequelize.query(
    //   `SELECT "id","password" FROM "Users" WHERE "email"=? LIMIT 1`,
    //   {
    //     replacements: [email],
    //     type: sequelize.QueryTypes.SELECT,
    //   }
    // );
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid password");
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await User.findAll({
      include: [
        {
          model: Task,
          as: "tasks",
          attributes: { exclude: ["createdAt", "updatedAt", "userId"] },
        },
      ],
      attributes: [
        "id",
        [fn("CONCAT", col("firstName"), " ", col("lastName")), "fullName"],
      ],
    });
    //     const allUsers = await sequelize.query(
    //       `SELECT
    //   u.id AS "userId",
    //   CONCAT(
    //   u."firstName",' ',
    //   u."lastName") AS "userName",
    //   JSON_AGG(
    //     JSON_BUILD_OBJECT('id', t.id, 'title', t.title)
    //   ) AS "tasks"
    //   FROM "Users" u
    //   LEFT JOIN "Tasks" t ON u.id = t."userId"
    //   GROUP BY u.id;
    // `,
    //       {
    //         type: sequelize.QueryTypes.SELECT,
    //       }
    //     );
    res.status(200).json({ message: "Users retrieved successfully", allUsers });
  } catch (error) {
    next(error);
  }
};
