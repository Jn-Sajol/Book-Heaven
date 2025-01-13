const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
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
};

module.exports = userAuth;
