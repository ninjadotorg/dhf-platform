'use strict';
let async = require('async');
let {PROJECT_STATE} = require('../../common/lib/constants');
let FirstReleasedJob = module.exports = function(app, jobConfig) {
  this.Project = app.models.project;
  this.Trader = app.models.trader;
  this.app = app;
  this.config = jobConfig;
  this.processing = false;
};
FirstReleasedJob.prototype.run = function() {
  console.log('In released run...');
  if (this.processing) {
    console.log('....but processing, so skip');
    return;
  }
  console.log('... and not processing, so launching!');

  this.processing = true;

  this.released();
};
FirstReleasedJob.prototype.released = function() {
  let self = this;

  this.Project.find({where: {
    state: PROJECT_STATE.READY,
    isTransfer: false,
  }}, function(err, projects) {
    if (err) {
      self.processing = false;
      return console.log(err);
    }
    async.eachSeries(projects, function(project, callback) {
      console.log('begin update deposit Address and transfer money for ' + project.name);
      let isUpdate = false;
      async.series([
        function pickUpExchangeAccount(callback) {
          if (!project.depositAddress || project.depositAddress === '') {
            console.log('get deposit address for project: ', project.id);
            project.isTransfer = false;
            self.Trader.getOrSetAccount(
              project.id,
              project.exchange,
              project.currency, function(err, data) {
                if (err) {
                  console.log(err, data);
                  return callback(err);
                }
                console.log(data);
                project.depositAddress = data.depositAddress;
                isUpdate = true;
                callback();
              });
          } else {
            callback();
          }
        },
        function transferMoneyToExchange(callback) {
          console.log('call transfer money to: ', project.id);
          if (project.depositAddress || project.depositAddress !== '') {
            project.isTransfer = true;
            isUpdate = true;
          }
          callback();
        },
        function updateProject(callback) {
          if (isUpdate) {
            console.log('updated project:', project);
            project.save(function(err, data) {
              console.log(err, data);
              callback();
            });
          }
        },
      ], function onComplete(err) {
        if (err) console.log(err);
        console.log('Processing done ', project.id);
        callback();
      });
    }.bind(this), function done(err) {
      if (err) console.log(err);
      self.processing = false;
    });
  });
};
