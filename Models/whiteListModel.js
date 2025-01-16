const mongoose = require('mongoose');

const whitelistShema = new mongoose.Schema({
    bookId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Books'
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
});
module.exports = mongoose.model('Whitelist',whitelistShema);