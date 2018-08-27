'use strict';
module.exports = function(Account) {
  Account.observe('after save', function(ctx, next) {
    next();
  });
  Account.afterRemote('create', function(context, user, next) {
    next();
  });
};
