const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Check if Authorization header exists
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2️⃣ If no token, block access
    if (!token) {
      return res.status(401).json({
        message: "Not authorized, token missing",
      });
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Get user from DB (excluding password)
    req.user = await User.findById(decoded.id).select("-password");

    // 5️⃣ Allow request to continue
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, token invalid",
    });
  }
};

module.exports = { protect };
