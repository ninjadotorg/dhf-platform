'use strict';

module.exports = function(Test) {
  Test.test = function(callback) {
    Test.listLockAccount('binance', function(err, data) {
      callback(err, data);
    });
  };
  Test.listAvailable = function(callback) {
    Test.listAvailableAccount('binance', function(err, data) {
      callback(err, data);
    });
  };
  Test.getOrSet = function(callback) {
    Test.getOrSetAccount('5b973408f62f5301e2318973', 'binance', function(err, data) {
      console.log(err, data);
      callback(err, data);
    });
  };
  Test.unLock = function(callback) {
    Test.unLockAccount('hola', function(err, data) {
      console.log(err, data);
      callback(err, data);
    });
  };

  Test.remoteMethod(
    'listAvailable',
    {
      accepts: [],
      http: {
        path: '/listAvailable',
        verb: 'GET',
      },
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );
  Test.remoteMethod(
    'unLock',
    {
      accepts: [],
      http: {
        path: '/unLock',
        verb: 'GET',
      },
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );
  Test.remoteMethod(
    'test',
    {
      accepts: [],
      http: {
        path: '/test',
        verb: 'GET',
      },
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );
  Test.remoteMethod(
    'getOrSet',
    {
      accepts: [],
      http: {
        path: '/get-or-set',
        verb: 'POST',
      },
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );
};
