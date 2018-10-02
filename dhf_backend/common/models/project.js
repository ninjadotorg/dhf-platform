'use strict';
let errorHandler = require('../lib/error-handler');
let {PROJECT_STATE, PROJECT_STAGE_STATE} = require('../lib/constants');
let async = require('async');
let {BigNumber}  = require('bignumber.js');

module.exports = function(Project) {
  Project.observe('before save', function(ctx, next) {
    if (ctx.instance && ctx.isNewInstance) {
      ctx.instance.userId = Project.app.currentUserId;
      ctx.instance.refundAmount = 0;
      ctx.instance.pendingAmount = 0;
      ctx.instance.isTransfer = false;
      ctx.instance.depositAddress = null;
      ctx.instance.currentStage = null;
      ctx.instance.createdDate = new Date();
      ctx.instance.updatedDate = new Date();
      Project.app.models.smartContract.smartContactGetVersion('currentVersion',
        function(err, data) {
          if (err) {
            let error = new Error();
            error.message = errorHandler.filler(err);
            error.status = 405;
            return next(error);
          }
          ctx.instance.smartContractVersion = data.version;
          next();
        });
    } else {
      ctx.instance.updatedDate = new Date();
      next();
    }
  });
  Project.observe('after save', function(ctx, next) {
    next();
  });
  // listProjects
  Project.listProjects = function(userId, isFunding, callback) {
    let fiter = {where: {}, include: 'User'};
    if (userId) fiter.where.userId = userId;
    if (isFunding) {
      fiter.where.or = [];
      fiter.where.or.push({state: PROJECT_STATE.READY});
      fiter.where.or.push({state: PROJECT_STATE.INITFUND});
    }

    Project.find(fiter, callback);
  };

  Project.myProjects = function(isTrading, callback) {
    let fiter = {where: {
      userId: Project.app.currentUserId,
    }};

    if (isTrading) fiter.where.state = PROJECT_STATE.RELEASE;
    Project.find(fiter, callback);
  };

  Project.myInvest = function(callback) {
    let fiter = {
      where: {
        state: {neq: PROJECT_STATE.NEW},
      },
      include: {
        relation: 'funding',
        scope: {
          fields: ['userId'],
          where: {userId: Project.app.currentUserId},
        },
      },
    };

    Project.find(fiter, function(err, data) {
      if (err) {
        return callback(err);
      }
      let result = [];
      data.forEach(function(item) {
        if (item.funding().length > 0) {
          result.push(item);
        };
      });
      callback(null, result);
    });
  };

  Project.release = function(projectId, callback) {
    let error = new Error();
    let currentProject;
    let currentStage;
    let transactionId;
    async.series([
      function validateProject(callback) {
        Project.findById(projectId, function(err, project) {
          if (err) return callback(err);
          if (!project) {
            error.status = 405;
            error.message = 'Project was not existed!';
            return callback(error);
          }
          if (!project.userId ||
            project.userId.toString() !== Project.app.currentUserId.toString()) {
            error.status = 405;
            error.message = 'You don\'t have permission on this project';
            return callback(error);
          }
          if (project.state !== PROJECT_STATE.READY) {
            error.status = 405;
            error.message = 'Project not ready!';
            return callback(error);
          }
          let fundingAmount = BigNumber(project.fundingAmount);
          if (fundingAmount.lte(0)) {
            error.status = 405;
            error.message = 'Project can not release, funding amount must be greater than 0!';
            return callback(error);
          }
          if (!project.stages) {
            error.status = 405;
            error.message = 'Project don\'t have any stage';
            return callback(error);
          }
          currentProject = project;
          callback();
        });
      },
      function pickUpExchangeAccount(callback) {
        if (!currentProject.depositAddress || currentProject.depositAddress === '') {
          currentProject.isTransfer = false;
          Project.app.models.trade.getOrSetAccount(
            currentProject.id,
            currentProject.exchange,
            currentProject.currency, function(err, data) {
              if (err) {
                return callback(err);
              }
              currentProject.depositAddress = data.depositAddress;
              callback();
            });
        } else {
          callback();
        }
      },
      function createStageState(callback) {
        if (currentProject.stages) {
          let preStage =  null;
          let stageLength = currentProject.stages.length;
          let totalRelease = new BigNumber(0);
          let i = 0;
          async.eachSeries(currentProject.stages, function(stage, cb) {
            let releaseDate = new Date();
            let dateOfStage = currentProject.lifeTime / stageLength;
            releaseDate.setDate(releaseDate.getDate() + (dateOfStage * i));
            let amount = new BigNumber(currentProject.fundingAmount);
            if (i < stageLength - 1) {
              amount = ((amount * stage) / 100);
              amount.toFixed(2);
              totalRelease = totalRelease.plus(amount);
            } else {
              amount = amount.minus(totalRelease);
            }
            Project.app.models.releaseStages.create(
              {
                'releaseDate': releaseDate.toString(),
                'amount': amount,
                'stageValue': stage,
                'state': 'NEW',
                'transactionId': null,
                'nextStage': null,
                'projectId': currentProject.id.toString(),
              }, function(err, data) {
              if (err) return cb(err);
              if (preStage) {
                preStage.nextStage = data.id;
                preStage.save(preStage, function(err, stg) {
                  preStage = data;
                  i++;
                  cb();
                });
              } else {
                currentStage = data;
                preStage = data;
                i++;
                cb();
              }
            }
            );
          }, function done(err) {
            if (err) {
              return callback(err);
            }
            callback();
          });
        }
      },
      function transferMoneyToExchange(callback) {
        if (currentProject.depositAddress || currentProject.depositAddress !== '') {
          Project.app.models.smartContract.smartContactVersionRelease(
            currentProject.smartContractVersion,
            currentProject.depositAddress,
            currentStage.amount,
            currentProject.id.toString(),
            currentStage.id.toString(),
            function(err, data) {
              if (err) {
                let error = new Error();
                error.message = errorHandler.filler(err);
                error.status = 405;
                return callback(error);
              }
              transactionId = data.result;
              currentProject.isTransfer = true;
              callback();
            });
        } else {
          callback();
        }
      },
      function updateStage(callback) {
        if (currentStage && currentProject.isTransfer) {
          currentStage.state = 'CURRENT';
          currentStage.transactionId = transactionId;
          currentStage.save(currentStage, function(err) {
            if (err) {
              return callback(err);
            }
            currentProject.currentStage = currentStage.id;
            callback();
          });
        } else {
          callback();
        }
      },
      function updateProject(callback) {
        currentProject.state = PROJECT_STATE.RELEASE;
        currentProject.save(function(err, data) {
          if (err) {
            console.log(err);
            callback(err);
          }
          callback();
        });
      },
    ], function onComplete(err) {
      if (err) return callback(err);
      callback(null, {
        released: true,
        currentState: currentStage,
      });
    });
  };

  Project.cancel = function(projectId, callback) {
    let error = new Error();
    let currentProject;
    async.series([
      function validateProject(callback) {
        Project.findById(projectId, function(err, project) {
          if (err) return callback(err);
          if (!project) {
            error.status = 405;
            error.message = 'Project was not existed!';
            return callback(error);
          }
          if (!project.userId ||
            project.userId.toString() !== Project.app.currentUserId.toString()) {
            error.status = 405;
            error.message = 'You don\'t have permission on this project';
            return callback(error);
          }
          if (project.state === PROJECT_STATE.STOP ||
            project.state === PROJECT_STATE.WITHDRAW) {
            error.status = 401;
            error.message = 'You can not cancel this, Project was stopped!';
            return callback(error);
          }
          currentProject = project;
          callback();
        });
      },
      function isReleased(callback) {
        if (currentProject.state === PROJECT_STATE.RELEASE) {
          Project.app.models.smartContract.stop(
            currentProject.smartContractVersion,
            currentProject.id.toString(),
            function(err) {
              if (err) {
                let error = new Error();
                error.message = errorHandler.filler(err);
                error.status = 405;
                return callback(error);
              }
              currentProject.state = PROJECT_STATE.STOP;
              callback();
            });
        } else {
          currentProject.state = PROJECT_STATE.WITHDRAW;
          callback();
        }
      },
      function updateStage(callback) {
        if (currentProject.state === PROJECT_STATE.RELEASE) {
          Project.app.models.releaseStages.find({where: {
            projectId: currentProject.id.toString(),
          }}, function(err, stages) {
            if (err) return callback(err);
            async.eachSeries(stages, function(stage, callback) {
              if (stage.state === PROJECT_STAGE_STATE.NEW) {
                stage.updateAttribute('state', PROJECT_STAGE_STATE.SUSPEND, callback);
              } else if (stage.state === PROJECT_STAGE_STATE.CURRENT) {
                stage.updateAttribute('state', PROJECT_STAGE_STATE.CANCEL, callback);
              } else {
                callback();
              }
            }, function done(err) {
              if (err) callback(err);
              callback();
            });
          });
        } else {
          callback();
        }
      },
      function updateProject(callback) {
        currentProject.save(function(err, data) {
          if (err) {
            console.log(err);
            callback(err);
          }
          callback();
        });
      },
    ], function onComplete(err) {
      if (err) return callback(err);
      callback(null, {
        canceled: true,
      });
    });
  };

  Project.remoteMethod('listProjects', {
    description: 'Get all projects',
    accepts: [
      {arg: 'userId', type: 'string'},
      {arg: 'isFunding', type: 'boolean'},
    ],
    returns: {arg: 'data', root: true, type: 'Object'},
    http: {path: '/list', verb: 'get'},
  });

  Project.remoteMethod('release', {
    description: 'release project',
    accepts: [
      {arg: 'projectId', type: 'string', required: true},
    ],
    returns: {arg: 'data', root: true, type: 'Object'},
    http: {path: '/release', verb: 'post'},
  });

  Project.remoteMethod('myProjects', {
    description: 'Get all projects of current user',
    accepts: [
      {arg: 'isTrading', type: 'boolean'},
    ],
    returns: {arg: '', root: true, type: 'Object'},
    http: {path: '/list/my', verb: 'get'},
  });

  Project.remoteMethod('myInvest', {
    description: 'Get all projects invested of current',
    accepts: [],
    returns: {arg: '', root: true, type: 'Object'},
    http: {path: '/list/my-invest', verb: 'get'},
  });
};
