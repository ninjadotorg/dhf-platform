'use strict';
const {USER_TYPE} = require('../lib/constants');

module.exports = function(User) {
  User.validatesInclusionOf('userType', {
    in: ['admin', 'user', 'backend'],
    message: 'must be trader or user',
  });
  User.listTrader = function(next) {
    User.find({where: {
      userType: USER_TYPE.USER,
      isTrader: true,
    }}, next);
  };
  User.remoteMethod('listTrader',
    {
      description: 'Get all trader',
      returns: {arg: 'data', root: true, type: 'Object'},
      http: {path: '/list-trader', verb: 'get'},
    });
  User.observe('before save', function(ctx, next) {
    if (ctx.instance && ctx.isNewInstance) {
      if ((ctx.instance.userType === USER_TYPE.ADMIN ||
        ctx.instance.userType === USER_TYPE.BACKEND) &&
        ctx.instance.realm !== 'backend') {
        let err = new Error();
        err.status = 401;
        err.message = 'Admin type can\'t create from rest api';
        return next(err);
      }
    }
    next();
  });
  User.afterRemote('create', function(context, user, next) {
    /*
    add user to role
    * */
    let models = User.app.models;
    models.Role.findOne({where: {name: user.userType}}, function(err, role) {
      if (err) return next(err);
      role.principals.create({
        principalType: models.RoleMapping.USER,
        principalId: user.id,
      }, function(err, principal) {
        if (err) return next(err);
        console.log('user has been added to role', principal);
      });
    });
    next();
  });
};
