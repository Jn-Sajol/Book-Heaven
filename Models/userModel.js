const mongoose = require("mongoose");

const userScheema = new mongoose.Schema(
  {
    username: {type: String, required: true },
    email: { type:String, required: true },
    password: { type:String, required: true },
    whitelist:[
      {
        bookId:{type:mongoose.Scheema.Types.ObjectId,ref:'Book'},
        
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userScheema);
