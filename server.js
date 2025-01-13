const express = require('express');
const mongoConnect = require('./Db/dbConnect');
const userRoute = require('./Router/userRoute')
const app = express();
app.use(express.json());

//db Connect
mongoConnect();

//Root Route
app.use('/api/user',userRoute)

app.listen(3000,()=>{
    console.log('server running in 3000 port')
})