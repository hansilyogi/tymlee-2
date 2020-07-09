var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var customerRouter = require('./routes/customer');
var companyAdminRouter = require('./routes/companyadmin');

var app = express();
 
app.get('/*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads", express.static(__dirname+"/uploads"));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/customer', customerRouter);
app.use('/companyadmin', companyAdminRouter);

module.exports = app;
