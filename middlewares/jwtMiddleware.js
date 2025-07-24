const jwt = require("jsonwebtoken");

exports.jwtMiddleware = (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "token not found" });
  }
  try {
    const jwtResponse = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = jwtResponse.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "authentication failed" });
  }
};
