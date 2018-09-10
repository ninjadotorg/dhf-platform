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
    username: 'trader',
    email: 'trader@autonomous.nyc',
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

describe('REST API request link to wallet', function() {
  let wallet = {
    walletId: 'string',
    walletName: 'string',
    wallets: 'string',
  };
  let verifyCode = '';
  it('should be create link wallet successful', function(done) {
    json('post', '/api/link-to-wallet', accessToken)
      .send(wallet)
      .expect(200)
      .end(function(err, res) {
        assert(typeof res.body === 'object');
        assert(res.body.id !== '');
        verifyCode = res.body.verifyCode;
        done();
      });
  });
  it('should be create verify wallet successful', function(done) {
    json('post', '/api/link-to-wallet/verify', accessToken)
      .send({
        verifyCode: verifyCode,
      })
      .expect(200)
      .end(function(err, res) {
        assert(typeof res.body === 'object');
        assert(res.body.status === 'approved');
        assert(res.body.verifyCode === verifyCode);
        done();
      });
  });
});
