'use strict';
let async = require('async');
let {PROJECT_STATE, PROJECT_STAGE_STATE} = require('../../common/lib/constants');
let ProjectState = module.exports = function(app, jobConfig) {
  this.Project = app.models.project;
  this.ProjectStages = app.models.releaseStages;
  this.app = app;
  this.config = jobConfig;
  this.processing = false;
};
ProjectState.prototype.run = function() {
  console.log('[Next Release]In released run...');
  if (this.processing) {
    console.log('....but processing, so skip');
    return;
  }
  console.log('... and not processing, so launching!');

  this.processing = true;

  this.checkState();
};
ProjectState.prototype.checkState = function() {
  let self = this;

  this.ProjectStages.find({
    where: {
      state: PROJECT_STAGE_STATE.NEW,
      releaseDate: {lte: new Date()},
    },
  }, function(err, stages) {
    if (err) {
      self.processing = false;
      return console.log(err);
    }
    async.eachSeries(stages, function(stage, callback) {
      let currentProject;
      let transactionId;
      async.series([
        function findProject(callback) {
          self.Project.findById(stage.projectId, function(err, project) {
            if (err) {
              console.log(err);
              return callback(err);
            }
            if (!project || project.state !== PROJECT_STATE.RELEASE) {
              return callback('skip processing because state of project was changed');
            }
            currentProject = project;
            callback();
          });
        },
        function getCurrentStage(callback) {
          if (!currentProject.currentStage) {
            callback();
          } else {
            self.ProjectStages.findById(currentProject.currentStage, function(err, currentStage) {
              if (err) {
                console.log(err);
                return callback(err);
              }
              if (!currentStage || !currentStage.nextStage ||
                currentStage.nextStage.toString() !== stage.id.toString()) {
                return callback('skip processing because scenario not validated');
              }
              callback();
            });
          }
        },
        function transferMoneyToExchange(callback) {
          console.log('call transfer money to: ', currentProject.id);
          if (currentProject.depositAddress || currentProject.depositAddress !== '') {
            transactionId = '';
          }
          callback();
        },
        function updateStage(callback) {
          console.log('call update stage for project: ', currentProject.id);
          console.log('update stage : ', stage.id);
          if (currentProject) {
            stage.state = PROJECT_STAGE_STATE.CURRENT;
            stage.transactionId = transactionId;
            stage.save(stage, function(err) {
              if (err) {
                console.log(err);
                return callback(err);
              }
              currentProject.currentStage = stage.id;
              callback();
            });
          } else {
            callback();
          }
        },
        function updateProject(callback) {
          console.log('updated project:', currentProject.id);
          currentProject.save(function(err, data) {
            if (err) console.log(err);
            callback();
          });
        },
      ], function onComplete(err) {
        if (err) console.log(err);
        console.log('Processing done for stage ', stage.id);
        callback();
      });
    }, function done(err) {
      if (err) console.log(err);
      self.processing = false;
    });
  });
};
