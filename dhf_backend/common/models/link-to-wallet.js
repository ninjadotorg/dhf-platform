'use strict';
var async = require('async');

module.exports = function(LinkToWallet) {
  LinkToWallet.verify = function(verifyCode, callback) {
    LinkToWallet.findOne({where:{
      verifyCode: verifyCode,
      status: 'pending',
    }}, function(err, data) {
      if (err) callback(err);
      let error = new Error();
      if (!data) {
        error.status = 404;
        error.message = 'Verify not found or code invalided!';
        return callback(error);
      }

      let createdDate = new Date(data.requestDate);
      let now = new Date();
      let validated = (now - createdDate) / 1000; // convert to  minutes;
      const limiestTime = 1440; // one day (24hours) in a  minute
      if (validated <= limiestTime) {
        data.userId = LinkToWallet.app.currentUserId;
        data.status = 'approved';
        data.activeDate = new Date();
        data.save(data, callback);
      } else {
        data.delete(data, function(err) {
          if (err) callback(err);
          error.status = 404;
          error.message = 'Your active code has been expired!';
          return callback(error);
        });
      }
    });
  };

  LinkToWallet.myWallet = function( callback) {
    LinkToWallet.find({where:{
        userId: LinkToWallet.app.currentUserId,
      }}, function(err, data) {
      if (err) callback(err);
      callback(null, data );
    });
  };

  LinkToWallet.isLinked = function(walletId, callback) {
    LinkToWallet.findOne({where:{
        walletId: walletId
    }}, function(err, data) {
      if (err) callback(err);
      callback(null, data !== null);
    });
  };
  LinkToWallet.remoteMethod('myWallet', {
    accepts: [
    ],
    returns: {arg: 'data', root: true, type: 'Object'},
    http: {path: '/my-wallet', verb: 'get'},
  });
  LinkToWallet.remoteMethod('isLinked', {
    accepts: [
      {arg: 'walletId', type: 'string'},
    ],
    returns: {arg: 'success', type: 'boolean'},
    http: {path: '/has-linked', verb: 'get'},
  });

  LinkToWallet.remoteMethod('verify', {
    accepts: [
      {arg: 'verifyCode', type: 'string'},
    ],
    returns: {arg: 'success', type: 'boolean'},
    http: {path: '/verify', verb: 'post'},
  });

  LinkToWallet.createVerifyCode = async function(){
    let key = await Math.random().toString(36);
    key = key.substring(key.length - 8);
    return new Promise(function(resolve, reject){
      LinkToWallet.findOne({where: {
          verifyCode: key
        }}, function (err, data) {
        if(err) reject(err);
        if(!data){
          resolve(key)
        } else {
          resolve(LinkToWallet.createVerifyCode());
        }
      })
    })
  };

  LinkToWallet.observe('before save', function(ctx, next) {
    if (ctx.instance && ctx.isNewInstance) {
      LinkToWallet.findOne({where: {
          walletId: ctx.instance.walletId
        }}, function (err, data) {
        if (err) return next(err);
        if (data) {
          let err = new Error();
          err.status = 401;
          err.message = 'Wallet existed';
          return next(err);
        }
        LinkToWallet.createVerifyCode().then(function (key) {
          ctx.instance.status = 'pending';
          ctx.instance.requestDate = new Date();
          ctx.instance.activeDate = new Date();
          ctx.instance.verifyCode = key;
          next();
        });
      });
    } else {
      next();
    }
  });
};
