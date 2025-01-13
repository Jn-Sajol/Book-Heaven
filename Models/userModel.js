const mongoose = require("mongoose");

const userScheema = new mongoose.Schema ({
    usename:{String,required:true},
    email:{String,required:true},
    password:{String,required:true}
}, {timestamps:true});

module.exports = mongoose.model('User', userScheema);