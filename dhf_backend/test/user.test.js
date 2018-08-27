'use strict';
let app = require('../server/server');
let request = require('supertest');
let assert = require('assert');

function json(verb, url) {
  return request(app)[verb](url)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/);
}

describe('REST API request create trader', function() {
  let trader = {
    firstName: 'dauden',
    lastName: 'blackbean',
    username: 'trader',
    email: 'trader@autonomous.nyc',
    password: 'DHF@123',
    userType: 'trader',
  };
  it('should be create trader successful', function(done) {
    json('post', '/api/users')
      .send(trader)
      .expect(200)
      .end(function(err, res) {
        console.log(res.body);
        assert(typeof res.body === 'object');
        assert(res.body.username === 'trader');
        assert(res.body.id !== '');
        done();
      });
  });
  it('should be login user trader with username & password', function(done) {
    json('post', '/api/users/login')
      .send({
        username: trader.username,
        password: trader.password,
      })
      .expect(200)
      .end(function(err, res) {
        console.log(res.body);
        assert(typeof res.body === 'object');
        assert(res.body.userId !== '');
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
describe('REST API request create user', function() {
  let trader = {
    firstName: 'tuan anh',
    lastName: 'blackbean',
    username: 'user',
    email: 'user@autonomous.nyc',
    password: 'DHF@123',
    userType: 'user',
  };
  it('should be create user successful', function(done) {
    json('post', '/api/users')
      .send(trader)
      .expect(200)
      .end(function(err, res) {
        console.log(res.body);
        assert(typeof res.body === 'object');
        assert(res.body.username === 'user');
        assert(res.body.id !== '');
        done();
      });
  });
  it('should be login user trader with username & password', function(done) {
    json('post', '/api/users/login')
      .send({
        username: trader.username,
        password: trader.password,
      })
      .expect(200)
      .end(function(err, res) {
        console.log(res.body);
        assert(typeof res.body === 'object');
        assert(res.body.userId !== '');
        assert(res.body.id !== '');
        done();
      });
  });
});
