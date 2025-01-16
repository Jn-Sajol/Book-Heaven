const mongoose = require('mongoose');

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
    publisDate:{type:Date,default:Date.now},
    
})
module.exports = mongoose.model('Books',bookScheema)