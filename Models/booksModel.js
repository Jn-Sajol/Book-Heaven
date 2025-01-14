const mongoose = require('mongoose');

const comentScheema = new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:false,
    },
    comment:{
        type:String,
        required:true
    },
    createAt:{
        type:Date,
        default:Date.now
    }
})

// books scheema
const bookScheema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    publisDate:{type:Date.now},
    comment:[comentScheema]
    
})
module.exports = mongoose.model('Books',bookScheema)