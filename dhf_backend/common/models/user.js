'use strict';

module.exports = function(User) {
  User.validatesInclusionOf('userType', {
    in: ['admin', 'trader', 'user', 'backend'],
    message: 'must be trader or user',
  });
  User.observe('before save', function(ctx, next) {
    if (ctx.instance && ctx.isNewInstance) {
      if ((ctx.instance.userType === 'admin' || ctx.instance.userType === 'backend') &&
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
