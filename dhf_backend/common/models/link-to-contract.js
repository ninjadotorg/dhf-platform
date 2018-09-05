'use strict';
var async = require('async');

module.exports = function(Linktocontract) {
  Linktocontract.verify = function(smartAddress, userId, callback) {
    Linktocontract.findOne({
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
  Linktocontract.remoteMethod('verify', {
    accepts: [
      {arg: 'smartAddress', type: 'string'},
      {arg: 'amount', type: 'number'},
    ],
    returns: {arg: 'success', type: 'boolean'},
    http: {path: '/verify', verb: 'post'},
  });
  Linktocontract.observe('before save', function(ctx, next) {
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
