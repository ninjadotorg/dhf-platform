'use strict';

module.exports = function(app) {
  const binance = require('node-binance-api')();
  binance.options({
    APIKEY: app.get('binance').APIKEY,
    APISECRET: app.get('binance').APISECRET,
    useServerTime: app.get('binance').useServerTime,
    verbose: true,
    test: app.get('binance').test,
  });
  return {
    binance,
  };
};
