'use strict';
module.exports = function(Account) {
  Account.validatesInclusionOf('userType', {
    in: ['admin', 'trader', 'user'],
    message: 'must be trader or user',
  });
  Account.observe('after save', function(ctx, next) {
    next();
  });
  Account.afterRemote('create', function(context, user, next) {
    /*
    add user to role
    * */
    let models = Account.app.models;
    models.Role.findOne({name: user.userType}, function(err, role) {
      if (err) throw err;
      role.principals.create({
        principalType: models.RoleMapping.USER,
        principalId: user.id,
      }, function(err, principal) {
        if (err) throw err;
        console.log('user has been added to role', principal);
      });
    });
    next();
  });
};
