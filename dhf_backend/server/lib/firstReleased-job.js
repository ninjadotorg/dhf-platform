'use strict';
let async = require('async');
let {PROJECT_STATE} = require('../../common/lib/constants');
let {BigNumber}  = require('bignumber.js');

let FirstReleasedJob = module.exports = function(app, jobConfig) {
  this.Project = app.models.project;
  this.Trade = app.models.trade;
  this.ProjectStages = app.models.releaseStages;
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
            self.Trade.getOrSetAccount(
              project.id,
              project.exchange,
              project.currency, function(err, data) {
                if (err) {
                  return callback(err);
                }
                project.depositAddress = data.depositAddress;
                isUpdate = true;
                callback();
              });
          } else {
            callback();
          }
        },
        function createStageState(callback) {
          if (project.stages) {
            console.log('begin create stage state of project');
            let preStage =  null;
            let stageLength = project.stages.length;
            let totalRelease = new BigNumber(0);
            let i = 0;
            async.eachSeries(project.stages, function(stage, callback) {
              let releaseDate = new Date();
              let dateOfStage = project.lifeTime / stageLength;
              releaseDate.setDate(releaseDate.getDate() + (dateOfStage * i));
              let amount = new BigNumber(project.fundingAmount);
              if (i < stageLength - 1) {
                amount = ((amount * stage) / 100);
                amount.toFixed(2);
                totalRelease = totalRelease.plus(amount);
              } else {
                amount = amount.minus(totalRelease);
              }
              self.ProjectStages.create(
                {
                  'releaseDate': releaseDate.toString(),
                  'amount': amount,
                  'stageValue': project.stages[i],
                  'state': 'NEW',
                  'transactionId': null,
                  'nextStage': null,
                  'projectId': project.id,
                }, function(err, data) {
                if (err) return callback(err);
                if (preStage) {
                  preStage.nextStage = data.id;
                  preStage.save(preStage, function(err, stg) {
                    preStage = data;
                    i++;
                    callback();
                  });
                } else {
                  preStage = data;
                  i++;
                  callback();
                }
              }
              );
            }, function done(err) {
              if (err) {
                console.log(err);
                return callback(err);
              }
              callback();
            });
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
            console.log('updated project:', project.id);
            project.save(function(err, data) {
              if (err) console.log(err);
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
