'use strict';
var async = require('async');

module.exports = function(LinkToWallet) {
  LinkToWallet.verify = function(authToken, verifyCode, userId, callback) {
    LinkToWallet.findOne({
      smartAddress: authToken,
      status: 'pending',
      userId: userId,
    }, function(err, data) {
      if (err) callback(err);
      let error = new Error();
      if (!data) {
        error.status = 404;
        error.message = 'Token not found!';
        return callback(error);
      }
      if (data.verifyCode !== verifyCode) {
        error.status = 401;
        error.message = 'Verify code invalided';
        return callback(error);
      }
      data.status = 'approved';
      data.activeDate = new Date();
      data.save(data, callback);
    });
  };
  LinkToWallet.remoteMethod('verify', {
    accepts: [
      {arg: 'authToken', type: 'string'},
      {arg: 'verifyCode', type: 'string'},
      {arg: 'userId', type: 'string'},
    ],
    returns: {arg: 'success', type: 'boolean'},
    http: {path: '/verify', verb: 'post'},
  });
  LinkToWallet.observe('before save', function(ctx, next) {
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
