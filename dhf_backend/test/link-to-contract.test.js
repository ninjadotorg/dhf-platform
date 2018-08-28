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
let currentUser;
before(function(done) {
  let trader = {
    firstName: 'tuan anh',
    lastName: 'blackbean',
    username: 'trader',
    email: 'trader@autonomous.nyc',
    password: 'DHF@123',
    userType: 'trader',
  };
  accessToken = json('post', '/api/users')
    .send(trader)
    .expect(200)
    .end(function(err, res) {
      if (err) return err;
      currentUser = res.body;
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

describe('REST API request link to smart contract', function() {
  let contractAddress = {
    smartAddress: 'string',
    status: 'pedding',
    verifyAmount: 0,
    ownerId: 1,
  };
  it('should not create address successful with out permission', function(done) {
    json('post', '/api/link-to-contract?access_token')
      .send(contractAddress)
      .expect(200)
      .end(function(err, res) {
        assert(typeof res.body === 'object');
        assert(res.body.error != null);
        assert(res.body.error.statusCode === 401);
        assert(res.body.error.code === 'AUTHORIZATION_REQUIRED');
        done();
      });
  });
  it('should be create address successful from trader account', function(done) {
    json('post', '/api/link-to-contract', accessToken)
      .send(contractAddress)
      .expect(200)
      .end(function(err, res) {
        assert(typeof res.body === 'object');
        assert(res.body.id === 1);
        assert(res.body.smartAddress === contractAddress.smartAddress);
        console.log(res.body);
        done();
      });
  });
  it('should be verify address successful from trader account', function(done) {
    json('post', '/api/link-to-contract/verify', accessToken)
      .send({
        smartAddress: contractAddress.smartAddress,
        amount: contractAddress.amountTest,
      })
      .expect(200)
      .end(function(err, res) {
        assert(typeof res.body === 'object');
        assert(res.body.success.smartAddress === contractAddress.smartAddress);
        assert(res.body.success.status === 'approved');
        done();
      });
  });
});
