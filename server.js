const express = require('express');
const mongoConnect = require('./Db/dbConnect');
const userRoute = require('./Router/userRoute')
const bookRouter = require('./Router/bookRoute')
const bodyParser = require('body-parser');
const cors = require('cors');

// Enable CORS for all origins

const app = express();
app.use(cors());
app.use(express.json());

// Middleware to parse URL-encoded data
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

//db Connect
mongoConnect();

//Root Route
app.use('/api/user',userRoute)
app.use('/api/book',bookRouter)

app.listen(3000,()=>{
    console.log('server running in 3000 port')
})