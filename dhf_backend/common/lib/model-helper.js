'use strict';

module.exports = function(app) {
  // var async = require('async');
  //
  // return {
  //   deleteRelatedModels: function(relatedModels, relatedIdField, relatedId, callback) {
  //     var queryClause = {};
  //     queryClause[relatedIdField] = relatedId;
  //
  //     async.eachSeries(relatedModels, function(relatedModel, callback) {
  //       relatedModel.find({where: queryClause}, function(err, results) {
  //         if (err)
  //           return callback(err);
  //
  //         async.eachSeries(results, function(object, callback) {
  //           relatedModel.destroyById(object.id, callback);
  //         }, callback);
  //       });
  //     }, callback);
  //   },
  // };
};
