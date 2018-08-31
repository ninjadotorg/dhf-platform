'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

app.start = function() {
  app.use(function(err, req, res, next) {
    console.log(123, err);
    if (err) {
      if ([401, 404].indexOf(err.statusCode) !== -1) {
        // log info only
        console.log('Caught warning in route', err.stack);
      } else {
        // log error
        console.log('Caught error in route', err.stack);
      }
      res.status(err.statusCode).send(err.message);
    } else {
      next();
    }
  });
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};
app.use(loopback.token({
  model: app.models.user,
}));

app.use(function(req, res, next) {
  app.currentUserId = null;
  if (!req.accessToken) return next();
  app.currentUserId = req.accessToken.userId;
  next();
});

app.middleware('auth', loopback.token());

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
