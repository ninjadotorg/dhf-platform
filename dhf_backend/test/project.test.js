'use strict';
let app = require('../server/server');
let request = require('supertest');
let assert = require('assert');

function json(verb, url, accessToken) {
  if (accessToken) {
    if (url.indexOf('?') !== -1)
      url += '&access_token=' + accessToken;
    else
      url += '?access_token=' + accessToken;
  }
  return request(app)[verb](url)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/);
}
let accessToken;
before(function(done) {
  let trader = {
    firstName: 'tuan anh',
    lastName: 'blackbean',
    username: 'user',
    email: 'user@autonomous.nyc',
    password: 'DHF@123',
    userType: 'user',
  };
  accessToken = json('post', '/api/users')
    .send(trader)
    .expect(200)
    .end(function(err, res) {
      if (err) return err;
      json('post', '/api/users/login')
        .send({
          username: trader.username,
          password: trader.password,
        })
        .expect(200)
        .end(function(err, res) {
          accessToken = res.body.id;
          done();
        });
    });
});

describe('REST API request project', function() {
  console.log(accessToken);
  let product = {
    name: 'test 1',
    status: 'open',
  };
  it('should be create product successful', function(done) {
    json('post', '/api/Projects?access_token=' + accessToken)
      .send(product)
      .expect(200)
      .end(function(err, res) {
        console.log(res.body);
        assert(typeof res.body === 'object');
        assert(res.body.id === 1);
        done();
      });
  });
});
