const mongoose = require("mongoose");

const comentScheema = new mongoose.Schema({
    bookId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Books'
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    comment:{
        type:String,
        required:true
    },
    username:{
        type:String
    },
    createAt:{
        type:Date,
        default:Date.now
    }
});
module.exports = mongoose.model('Comment',comentScheema)