'use strict';
var async = require('async');

module.exports = function(LinkToContract) {
  LinkToContract.verify = function(smartAddress, userId, callback) {
    LinkToContract.findOne({
      smartAddress: smartAddress,
      status: 'pending',
      userId: userId,
    }, function(err, data) {
      if (err) callback(err);
      let error = new Error();
      if (!data) {
        error.status = 405;
        error.message = 'Contract not found!';
        return callback(error);
      }
      data.status = 'approved';
      data.activeDate = new Date();
      data.save(data, callback);
    });
  };
  LinkToContract.remoteMethod('verify', {
    accepts: [
      {arg: 'smartAddress', type: 'string'},
    ],
    returns: {arg: 'success', type: 'boolean'},
    http: {path: '/verify', verb: 'post'},
  });
  LinkToContract.observe('before save', function(ctx, next) {
    if (ctx.instance && ctx.isNewInstance) {
      ctx.instance.status = 'pendding';
      ctx.instance.requestDate = new Date();
      ctx.instance.activeDate = new Date();
      next();
    } else {
      next();
    }
  });
};
