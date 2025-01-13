const express = require('express');
const mongoConnect = require('./Db/dbConnect');
const app = express();
app.use(express.json());

//db Connect
mongoConnect();

app.listen(3000,()=>{
    console.log('server running in 3000 port')
})