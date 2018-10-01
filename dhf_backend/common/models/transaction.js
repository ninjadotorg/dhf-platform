'use strict';
let async = require('async');
let {TRANSACTION_STATE} = require('../lib/constants');
module.exports = function(Transaction) {
  Transaction.getAllTransaction = function(projectId, state = false, callback) {
    let error = new Error();
    let transactions = [];
    async.series([
      function validateProject(callback) {
        Transaction.app.models.project.findById(projectId, function(err, project) {
          if (err) return callback(err);
          if (!project) {
            error.status = 405;
            error.message = 'Project was not existed!';
            return callback(error);
          }
          if (project.userId.toString() !== Transaction.app.currentUserId.toString()) {
            error.status = 405;
            error.message = 'You don\'t have permission on this project';
            return callback(error);
          }
          callback();
        });
      },
      function validationState(callback) {
        if (state) {
          let value = false;
          for (let item in TRANSACTION_STATE) {
            if (item === state) {
              value = true;
              break;
            }
          }
          if (!value) {
            error.status = 405;
            error.message = 'State not validated';
            return callback(error);
          }
          callback();
        } else  callback();
      },
      function getTransaction(callback) {
        let filter = {
          where: {
            projectId: projectId,
          },
        };
        if (state) {
          filter.where.state = state;
        }
        Transaction.app.models.trader.find(filter, function(err, trans) {
          if (err) return callback(err);
          transactions = trans;
          callback();
        });
      },
    ], function onComplete(err) {
      if (err)
        return callback(err);
      callback(null, transactions);
    });
  };

  Transaction.getPendingTransaction = function(projectId, callback) {
    Transaction.getAllTransaction(projectId, TRANSACTION_STATE.PENDING, callback);
  };

  Transaction.remoteMethod(
    'getAllTransaction',
    {
      description: 'get all histories of placing order',
      accepts: [
        {arg: 'projectId', type: 'string', required: true},
        {arg: 'state', type: 'string'},
      ],
      http: {verb: 'GET', path: '/transaction'},
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );

  Transaction.remoteMethod(
    'getPendingTransaction',
    {
      description: 'get all histories of placing order',
      accepts: [
        {arg: 'projectId', type: 'string', required: true},
      ],
      http: {verb: 'GET', path: '/transaction/pending'},
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );
};
