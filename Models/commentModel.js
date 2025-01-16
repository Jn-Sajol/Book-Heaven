const mongoose = require("mongoose");

const comentScheema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:false,
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