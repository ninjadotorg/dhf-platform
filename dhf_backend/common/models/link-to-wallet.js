'use strict';
var async = require('async');

module.exports = function(LinkToWallet) {
  LinkToWallet.verify = function(verifyCode, callback) {
    let currentLinked = null;
    async.series([
      function checkCode(callback) {
        LinkToWallet.findOne({
          where: {
            verifyCode: verifyCode,
            status: 'pending',
          }
        }, function (err, data) {
          if (err) callback(err);
          let error = new Error();
          if (!data) {
            error.status = 405;
            error.message = 'Verify not found or code invalided!';
            return callback(error);
          }

          let createdDate = new Date(data.requestDate);
          let now = new Date();
          let validated = (now - createdDate) / 1000; // convert to  minutes;
          const limiestTime = 15; // one day (24hours) in a  minute
          if (validated <= limiestTime) {
            currentLinked = data;
            callback();
          } else {
            data.delete(data, function (err) {
              if (err) callback(err);
              error.status = 405;
              error.message = 'Your active code has been expired!';
              return callback(error);
            });
          }
        });
      },
      function removePreviousLink(callback) {
        if (currentLinked) {
          LinkToWallet.destroyAll({
              walletId: currentLinked.walletId,
          }, function (err, results) {
            if (err)
              return callback(err);

            callback();
          });
        } else {
          callback();
        }
      },
      function addNewLink(callback) {
        if (currentLinked) {
          currentLinked.userId = LinkToWallet.app.currentUserId;
          currentLinked.status = 'approved';
          currentLinked.activeDate = new Date();
          currentLinked.save(currentLinked, callback);
        } else {
          callback()
        }
      },
    ], function onComplete(err) {
      if (err)
        return callback(err);
      callback(null, currentLinked);
    });
  };

  LinkToWallet.myWallet = function(callback) {
    LinkToWallet.find({where:{
        userId: LinkToWallet.app.currentUserId,
      }}, function(err, data) {
      if (err) callback(err);
      callback(null, data );
    });
  };

  LinkToWallet.isLinked = function(token, callback) {
    LinkToWallet.app.models.walletProfile.profile(
      token,
      function (err, profile) {
        if (err) return next(err);
        if (!profile || !profile.status) {
          let errNew = new Error();
          errNew.status = 404;
          errNew.message = 'Profile was not exist';
          return callback(errNew);
        }
        LinkToWallet.findOne({where:{
            walletId: profile.data.id.toString()
          }}, function(err, data) {
          if (err) callback(err);
          callback(null, data !== null);
        });
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
      {arg: 'toke', type: 'string'},
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

  LinkToWallet.beforeRemote('create', function (ctx, data, next) {
    let errNew = new Error();
    if(!ctx.args.data.token) {
      err.status = 405;
      err.message = 'Token is required';
      return next(err);
    }
    LinkToWallet.app.models.walletProfile.profile(
      ctx.args.data.token,
      function (err, profile) {
        if (err) return next(err);
        if (!profile || !profile.status) {
          errNew.status = 404;
          errNew.message = 'Profile was not existed';
          return next(errNew);
        }
        if (profile.data.id.toString() !== ctx.args.data.walletId ||
          profile.data.username !== ctx.args.data.walletName) {
          errNew.status = 404;
          errNew.message = 'Profile was not matched';
          return next(errNew);
        }
        delete ctx.args.data.token;
        next();
      });
  });
  LinkToWallet.observe('before save', function(ctx, next) {
    if (ctx.instance && ctx.isNewInstance) {
      LinkToWallet.createVerifyCode().then(function (key) {
        ctx.instance.status = 'pending';
        ctx.instance.requestDate = new Date();
        ctx.instance.activeDate = new Date();
        ctx.instance.verifyCode = key;
        ctx.instance.userId = null;
        next();
      });
    } else {
      next();
    }
  });
  LinkToWallet.afterRemote('create', function(ctx, data, next) {
    let createdDate = new Date();
    createdDate.setMinutes(createdDate.getMinutes() + 15);
    data.expire = 15;
    data.expireDate = createdDate;
    next();
  });
};
