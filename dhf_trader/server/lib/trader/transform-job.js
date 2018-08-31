'use strict';

let async = require('async');
let binance = require('binance');
var TransformJob = module.exports = function(app, jobConfig) {
  this.isActive = true;
  this.config = jobConfig;
};
TransformJob.prototype.run = function() {
  if (!this.isActive) {
    return console.log('Transformation job inactive, skipping.');
  }
};
