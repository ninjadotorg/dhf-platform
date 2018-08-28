'use strict';
let app = require('../server/server');
let request = require('supertest');
let assert = require('assert');

var adminUser, accessToken;
before(function(done) {
  // clean db
  app.models.user.destroyAll();
  app.models.RoleMapping.destroyAll();
  app.models.Role.destroyAll();
  app.models.Role.create({name: 'admin'}, function(err, adminRole) {
        if (err)
            return callback(err);

      app.models.user.create({
          realm: 'backend',
          firstName: 'admmin',
          lastName: 'autonomous',
          username: 'admin',
          email: 'dhf@autonomous.nyc',
          password: 'DHF@123',
          userType: 'admin',
      }, function(err, result) {
          if (err)
              return callback(err);

          adminUser = result;
          done();
      });
  });
});
function json(verb, url) {
  return request(app)[verb](url)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/);
}
describe('REST API request login', function() {
  it('should be login user "admin" ', function(done) {
    json('post', '/api/users/login')
      .send({
        email: 'dhf@autonomous.nyc',
        password: 'DHF@123',
      })
      .expect(200)
      .end(function(err, res) {
        assert(typeof res.body === 'object');
        assert(res.body.userId !== '');
        assert(res.body.id !== '');
        accessToken = res.body.id;
        done();
      });
  });
  it('should not login user "admin" with username & and empty password',
    function(done) {
      json('post', '/api/users/login')
        .send({
          username: 'admin',
          password: '',
        })
        .expect(200)
        .end(function(err, res) {
          assert(typeof res.body === 'object');
          assert(res.body.error != null);
          assert(res.body.error.statusCode === 401);
          assert(res.body.error.message === 'login failed');
          done();
        });
    });
});
