'use strict';
const rolesSupported = ['admin', 'user', 'backend'];
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
      if (role.name === 'backend') {
        self.createBackend(role);
      }
    });
  });
  self.createAdmin = function(role) {
    app.models.user.findOne({where: {email: 'dhf@autonomous.nyc'}},
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

  self.createBackend = function(role) {
    app.models.user.findOne({where: {email: 'backend@autonomous.nyc'}},
      function(err, existedUser) {
        if (err) {
          console.log(err);
          throw err;
        }
        if (!existedUser) {
          app.models.user.create(
            {
              realm: 'backend',
              firstName: 'backend',
              lastName: 'autonomous',
              username: 'backend',
              email: 'backend@autonomous.nyc',
              password: 'DHF@123',
              userType: 'backend',
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
