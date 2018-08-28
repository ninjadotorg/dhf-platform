'use strict';

module.exports = function(Linktocontract) {
  Linktocontract.verify = function(smartAddress, amount, callback) {
    let verify = require('../lib/verify-smart-contract-link')(Linktocontract.app).verify;
    Linktocontract.findOne({
      smartAddress: smartAddress,
      status: 'pending',
    }, function(err, data) {
      if (err) callback(err);
      verify(data, amount, callback);
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
    }
    next();
  });
};
