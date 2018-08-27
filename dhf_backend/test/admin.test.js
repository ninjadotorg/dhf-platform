'use strict';
let app = require('../server/server');
let request = require('supertest');
let assert = require('assert');

var adminUser, accessToken;
before(function(done) {
  // clean db
  require('./fixtures/clear-admin-user-data')(app, function loaded(err) {
    if (err)
      console.log(err);

    // load test fixtures
    require('./fixtures/load-admin-role-user')(app,
      function loaded(err, result) {
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
  console.log(123, app.models.user.getDataSource());
  it('should be login user "admin" ', function(done) {
    json('post', '/api/users/login')
      .send({
        email: 'dhf@autonomous.nyc',
        password: 'DHF@123',
      })
      .expect(200)
      .end(function(err, res) {
        assert(typeof res.body === 'object');
        assert(res.body.userId === 1);
        assert(res.body.id !== '');
        done();
      });
  });
  it('should be login user "admin" with username & password', function(done) {
    json('post', '/api/users/login')
      .send({
        username: 'admin',
        password: 'DHF@123',
      })
      .expect(200)
      .end(function(err, res) {
        console.log(res.body);
        assert(typeof res.body === 'object');
        assert(res.body.userId === 1);
        assert(res.body.id !== '');
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
          console.log(res.body);
          assert(typeof res.body === 'object');
          assert(res.body.error != null);
          assert(res.body.error.statusCode === 401);
          assert(res.body.error.message === 'login failed');
          done();
        });
    });
});
