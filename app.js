var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
// const flash = require('connect-flash');
// const session = require('express-session')



var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
const { extname } = require('path');
var app = express();

// connecting to mongodb
const dbURI = 'mongodb+srv://Hisham:12345@cluster0.uywsytb.mongodb.net/fcart'
mongoose.set('strictQuery', true)
mongoose.connect(dbURI)
.then((result) => {
  console.log('connected to db')
})
.catch((err) => console.log(err))

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(session({ 
//   secret: 'mysecretkey',
//   resave: false,
//   saveUninitialized: true
// }))
// app.use(flash());

app.use('/', indexRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  console.log(err)
});


module.exports = app;

