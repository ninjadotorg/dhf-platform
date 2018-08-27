'use strict';
const rolesSupported = ['admin', 'trader', 'user'];
module.exports = function(app) {
  let self = this;
  let Role = app.models.Role;
  rolesSupported.forEach(function(role) {
    Role.findOrCreate({
      name: role,
    }, function(err, role) {
      if (err) throw err;
      if (role.name === 'admin') {
        self.createAdmin(role);
      }
    });
  });
  self.createAdmin = function(role) {
    app.models.user.findOne({email: 'dhf@autonomous.nyc'},
      function(err, existedUser) {
        if (err) {
          console.log(err);
          throw err;
        }
        if (!existedUser) {
          app.models.user.create(
            {
              realm: 'backend',
              firstName: 'admmin',
              lastName: 'autonomous',
              username: 'admin',
              email: 'dhf@autonomous.nyc',
              password: 'DHF@123',
              userType: 'admin',
            },
            function(err, userInstance) {
              if (err) throw err;
            }
          );
        }
      }
    );
  };
};
