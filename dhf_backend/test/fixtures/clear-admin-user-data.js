'use strict';

var async = require('async');

module.exports = function(app, callback) {
  var models = require('../../server/model-config.json');

  // ping, to make sure we have established DB connection
  app.models.User.getDataSource().connector.ping(function(err) {
    // clear all statistics tables
    app.models.User.getDataSource().connector.db.collections(
      function(err, results) {
        if (err)
          return callback(err);
        async.each(
        results,
        function(collection, callback) {
          var model = collection.s.name;

          if (model  ===  'Role' ||
            model === 'RoleMapping' ||
            model === 'user' ||
            (models[model] && models[model].dataSource === 'mongo')) {
            collection.drop(function(err, result) {
              callback();
            });
          } else {
            callback();
          }
        },
        callback);
      });
  });
};
