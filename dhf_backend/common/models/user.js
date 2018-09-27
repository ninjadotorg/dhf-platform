'use strict';
const {USER_TYPE} = require('../lib/constants');

module.exports = function(User) {
  User.validatesInclusionOf('userType', {
    in: ['admin', 'user', 'backend'],
    message: 'must be an user',
  });

  User.updateProfile = function(firstName, lastName, username, email, avatar, callback) {
      this.findOne({where: {id:  User.app.currentUserId.toString(), email: email, username: username}}, function (err, user) {
        if (err) {
         callback(err);
        }  else if (!user) {
        let mess = "No match between provided current logged user and email or username";
        let newErr = new Error(mess);
        newErr.statusCode = 401;
        newErr.code = 'LOGIN_FAILED_EMAIL';
        callback(newErr);
      } else {
        user.updateAttributes({'firstName': firstName, 'lastName': lastName, 'avatar': avatar}, function (err, instance) {
          if (err) {
                callback(err);
              } else {
                callback(null, user);
              }
        });
      }
    });
  }

  User.remoteMethod(
    'updateProfile',
    {
      description: 'Update user profile',
      accepts: [
        {arg: 'firstName', type: 'string', required: true},
        {arg: 'lastName', type: 'string', required: true},
        {arg: 'username', type: 'string', required: true},
        {arg: 'email', type: 'string', required: true},
        {arg: 'avatar', type: 'string'},
      ],
      returns: {arg: 'data', root: true, type: 'Object'},
      http: {path: '/update-profile', verb: 'put'},
    }
  );

  User.updatePassword = function (oldPassword, newPassword, callback) {
  let newErrMsg, newErr;
  try {
    this.findOne({where: {id:  User.app.currentUserId.toString()}}, function (err, user) {
      if (err) {
        callback(err);
      } else {
        user.hasPassword(oldPassword, function (err, isMatch) {
          if (isMatch) {
            user.updateAttributes({'password': newPassword}, function (err, instance) {
              if (err) {
                callback(err);
              } else {
                callback(null, true);
              }
            });
          } else {
            newErrMsg = 'User specified wrong current password !';
            newErr = new Error(newErrMsg);
            newErr.statusCode = 401;
            newErr.code = 'LOGIN_FAILED_PWD';
            return callback(newErr);
          }
        });
      }
    });
  } catch (err) {
    logger.error(err);
    callback(err);
  }
};

User.remoteMethod(
  'updatePassword',
  {
    description: "Allows a logged user to change his/her password.",
    http: {path: '/update-password', verb: 'put'},
    accepts: [
      {arg: 'oldPassword', type: 'string', required: true, description: "The user old password"},
      {arg: 'newPassword', type: 'string', required: true, description: "The user NEW password"}
    ],
    returns: {arg: 'passwordChange', type: 'boolean'}
  }
);

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
