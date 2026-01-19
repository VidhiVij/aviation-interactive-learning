const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_jwt_secret"; // same secret used in auth.js

module.exports = function(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
