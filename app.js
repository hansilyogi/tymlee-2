var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var customerRouter = require('./routes/customer');
var companyUserRouter = require('./routes/companyuser');
var vendorUserRouter = require('./routes/vendor');
var bodyParser = require('body-parser');
var app = express();


app.use(cors());
// app.use(express.limit(100000000));
app.use(logger('dev'));
// app.use(express.urlencoded());
app.use(express.json({limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
// app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/customer', customerRouter);
app.use('/companyuser', companyUserRouter);
app.use('/api', vendorUserRouter);

app.get('/*', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

module.exports = app;