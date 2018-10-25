'use strict';
let async = require('async');
let {PROJECT_STATE} = require('../../common/lib/constants');
let ProjectState = module.exports = function(app, jobConfig) {
  this.Project = app.models.project;
  this.Trade = app.models.trade;
  this.app = app;
  this.config = jobConfig;
  this.processing = false;
};
ProjectState.prototype.run = function() {
  console.log('[Report running projects] In run...');
  if (this.processing) {
    console.log('....but processing, so skip');
    return;
  }
  console.log('... and not processing, so launching!');

  this.processing = true;

  this.report();
};
ProjectState.prototype.report = function() {
  let self = this;

  this.Project.find({
    where: {
      state: PROJECT_STATE.RELEASE,
    },
  }, function(err, projects) {
    if (err) {
      self.processing = false;
      return console.log(err);
    }
    async.eachSeries(projects, function(project, callback) {
      // @todo call should validate if return true call validate

      callback();
    }, function done(err) {
      if (err) console.log(err);
      self.processing = false;
    });
  });
};
