const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRegistration = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //check existency
    const existency = await userModel.findOne({
      $or: [{ email }, { username }],
    });
    if (existency || existency < 0) {
      return res.status(404).json({
        success: false,
        message: "Email or Username is already exist",
      });
    }
    const bcryptPass = await bcrypt.hash(password, 10);
    const user = new userModel({
      email,
      username,
      password: bcryptPass,
    });
    await user.save();
    res.status(200).json({
      success: true,
      message: "User successfully created",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `server error ${error}`,
    });
  }
};

//User Login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    //find user
    const user = await userModel.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    //Verify the password
    const VerifyPass = await bcrypt.compare(password, user.password);
    if (!VerifyPass) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    //Jwt token Genarate
    const jwtToken = jwt.sign(
      { userId: user._id, userName: user.username },
      "secretKey",
      { expiresIn: "24h" }
    );
    return res.status(200).json({
      success: true,
      message: "User Login successfull",
      token: jwtToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `server error ${error}`,
    });
  }
};

//Privet Route
module.exports = { userRegistration, userLogin};
