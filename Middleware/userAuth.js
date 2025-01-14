const jwt = require("jsonwebtoken");

const userAuth = (req, res, next) => {
  try {
    const tokenFromheader = req.headers.authorization;
    if (!tokenFromheader) {
      return res.status(404).json({
        success: false,
        message: "Header not sent",
      });
    }

    //split token
    const splitToken = req.headers.authorization.split(" ")[1];
    if (!splitToken) {
      return res.status(404).json({
        success: false,
        message: "Header not sent",
      });
    }

    //verify token
    const verifyToken = jwt.verify(splitToken, "secretKey");
    if (!verifyToken) {
      return res.status(404).json({
        success: false,
        message: "Not valid user",
      });
    }
    req.user = verifyToken;
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);

    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {userAuth};
