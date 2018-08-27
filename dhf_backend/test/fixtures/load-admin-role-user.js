'use strict';

var async = require('async');

module.exports = function(app, callback) {
  var defaultAdminUser;
  async.series([
    function createAdminRole(callback) {
      app.models.Role.create({name: 'admin'}, function(err, adminRole) {
        if (err)
          return callback(err);

        callback();
      });
    },

    function createAdminUser(callback) {
      app.models.user.create({
        realm: 'backend',
        firstName: 'admmin',
        lastName: 'autonomous',
        username: 'admin',
        email: 'dhf@autonomous.nyc',
        password: 'DHF@123',
        userType: 'admin',
      }, function(err, result) {
        if (err)
          return callback(err);

        defaultAdminUser = result;
        callback();
      });
    },
  ], function(err) {
    callback(err, defaultAdminUser);
  });
};
