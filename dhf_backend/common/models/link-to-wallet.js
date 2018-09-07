'use strict';
var async = require('async');

module.exports = function(LinkToWallet) {
  LinkToWallet.verify = function(smartAddress, userId, callback) {
    LinkToWallet.findOne({
      smartAddress: smartAddress,
      status: 'pending',
      userId: userId,
    }, function(err, data) {
      if (err) callback(err);
      data.status = 'approved';
      data.activeDate = new Date();
      data.save(data, callback);
    });
  };
  LinkToWallet.remoteMethod('verify', {
    accepts: [
      {arg: 'smartAddress', type: 'string'},
      {arg: 'amount', type: 'number'},
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
