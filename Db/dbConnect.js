const mongoose = require("mongoose");

const mongoConnect = () => {
  try {
    mongoose
      .connect(
        "mongodb+srv://julkar10121:pyZNqNvAaZzPfTiT@cluster0.z3cog.mongodb.net/"
      )
      .then(() => console.log("Db connected"))
      .catch((e) => console.log(e));
  } catch (error) {
    console.error(error);
  }
};

module.exports = mongoConnect;
