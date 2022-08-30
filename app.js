const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require("dotenv").config();
const sequelize = require('./database');
const api = require('./routes/api');
const auth = require('./auth/_helpers');
const session = require('express-session');
const fileUpload = require("express-fileupload");
const debug = require('debug')('test-task:server');
const http = require('http');


sequelize.sync({ force: false }).then(() => console.log('db is ready'));

const app = express();

// view engine setup
const port = normalizePort(process.env.APP_PORT || '8000');
app.set('port', port);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  fileUpload()
);

app.use(session({
  secret: "Some_secret^string",
  resave: true,
  saveUninitialized: true
}));

app.use('/api/v1', api.unprotected);
app.use('/api/v1', auth, api.protected);

const server = http.createServer(app);

server.listen(port, '0.0.0.0', function () { console.log(`Server is ready on port ${port}`); });
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

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
});

module.exports = app;
