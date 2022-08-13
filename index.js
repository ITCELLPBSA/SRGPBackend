const express = require('express');
const bodyParser = require('body-parser'); 
const cors = require('cors');

const app = express();

const MAX_UPLOAD_SIZE = '10mb';
app.use(cors());
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
const userRouter = require("./routes/user.routes");
const adminRouter = require("./routes/admin.routes");

const errorLogger = require("./utils/errorLogger");



app.use(bodyParser.json({limit:MAX_UPLOAD_SIZE}));
app.use(bodyParser.urlencoded({extended:true, limit:MAX_UPLOAD_SIZE}))
app.use('/user',userRouter);
app.use('/admin',adminRouter);
app.use(errorLogger);


const PORT = process.env.PORT || 5000;
app.listen(PORT);
