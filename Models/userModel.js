const mongoose = require("mongoose");

const userScheema = new mongoose.Schema(
  {
    username: {type: String, required: true },
    email: { type:String, required: true },
    password: { type:String, required: true },
    whitelist:[
      {
        bookId:{type:mongoose.Schema.Types.ObjectId,ref:'Books'},

      }
    ],
    personalnote:[
      {
        bookId:{
          type:mongoose.Schema.Types.ObjectId,
          ref:'Books'
        },
        note:{
          type:String
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userScheema);
