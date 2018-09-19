'use strict';
let async = require('async');
let {PROJECT_STATE} = require('../../common/lib/constants');
let ProjectState = module.exports = function(app, jobConfig) {
  this.Project = app.models.project;
  this.app = app;
  this.config = jobConfig;
  this.processing = false;
};
ProjectState.prototype.run = function() {
  console.log('[Init Fund State]In released run...');
  if (this.processing) {
    console.log('....but processing, so skip');
    return;
  }
  console.log('... and not processing, so launching!');

  this.processing = true;

  this.released();
};
ProjectState.prototype.released = function() {
  let self = this;

  this.Project.find({
    where: {
      state: PROJECT_STATE.INITFUND,
    },
  }, function(err, projects) {
    if (err) {
      self.processing = false;
      return console.log(err);
    }
    async.eachSeries(projects, function(project, callback) {
      let today = new Date();
      if (project.deadline >= today) {
        // @todo call smart check stage
      }
      callback();
    }, function done(err) {
      if (err) console.log(err);
      self.processing = false;
    });
  });
};
