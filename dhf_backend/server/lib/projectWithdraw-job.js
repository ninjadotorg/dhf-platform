'use strict';
let async = require('async');
let {PROJECT_STATE} = require('../../common/lib/constants');
let errorHandler = require('../../common/lib/error-handler');
let {BigNumber}  = require('bignumber.js');

let ProjectState = module.exports = function(app, jobConfig) {
  this.Project = app.models.project;
  this.Trade = app.models.trade;
  this.SmartContract = app.models.smartContract;
  this.ProjectWithdraw = app.models.projectWithdraw;
  this.app = app;
  this.config = jobConfig;
  this.processing = false;
};
ProjectState.prototype.run = function() {
  console.log('[Project withdraw State]In released run...');
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

  this.Project.find({
    where: {
      state: PROJECT_STATE.STOP,
    },
    include: 'projectWithdraw',
  }, function(err, projects) {
    if (err) {
      self.processing = false;
      return console.log(err);
    }
    async.eachSeries(projects, function(project, callback) {
      if (!project.projectWithdraw() ||
        (project.projectWithdraw() && !project.projectWithdraw().callSaleAllCoins)) {
        let callSaleAllCoins = false;
        async.series([
          function saleAllCoins(callback) {
            // @todo call trader API to sale all coins
            console.log('call sale all coins');
            callSaleAllCoins = true;
            callback();
          },
          function saveProjectWithdraw(callback) {
            let projectWithdraw;
            if (!project.projectWithdraw()) {
              projectWithdraw = {
                projectId: project.id.toString(),
                callSaleAllCoins: callSaleAllCoins,
                canWithdraw: false,
                withdrawAmount: null,
                transactionId: null,
                isWithdraw: false,
                isCallWithdraw: false,
                createdDate: new Date(),
                updatedDate: new Date(),
              };
              self.ProjectWithdraw.create(projectWithdraw, function(err, data) {
                console.log(err, data);
                if (err) return callback(err);
                callback();
              });
            } else {
              projectWithdraw = project.projectWithdraw();
              projectWithdraw.updatedDate = new Date();
              projectWithdraw.callSaleAllCoins = true;
              project.projectWithdraw.save(projectWithdraw, function(err, data) {
                console.log(err, data);
                if (err) return callback(err);
                callback();
              });
            }
          },
        ], function onComplete(err) {
          if (err) return callback(err);
          callback();
        });
      } else {
        let canWithdraw = false;
        let WithdrawAmount = '';
        let isWithdraw = false;
        let transactionId = '';
        let isCallWithdraw = false;
        async.series([
          function checkReadyWithdraw(callback) {
            self.Trade.action(project.id.toString(), 'accountInfo',
              function(err, resp) {
                if (err) {
                  let error = new Error();
                  error.message = errorHandler.filler(err);
                  error.status = 405;
                  return callback(error);
                }
                if (resp.canWithdraw) {
                  let balance = resp.balances.filter(function(x) {
                    return x.free !== '0.00000000';
                  });
                  if (balance.length === 1) {
                    WithdrawAmount = balance[0].free;
                    canWithdraw = true;
                  }
                  if (balance.length === 0) {
                    isWithdraw = true;
                  }
                }
                callback();
              });
          },
          function callWithdraw(callback) {
            if (!isWithdraw && canWithdraw) {
              self.Trade.withdraw(
                project.id.toString(),
                project.currency,
                project.owner,
                WithdrawAmount,
                function(err, resp) {
                  if (err) {
                    let error = new Error();
                    error.message = errorHandler.filler(err);
                    error.status = 405;
                    return callback(error);
                  }

                  transactionId = resp.result;
                  isCallWithdraw = true;
                  callback();
                });
            } else {
              callback();
            }
          },
          function callRetract(callback) {
            if (isWithdraw && isCallWithdraw) {
              let scale = new BigNumber(project.fundingAmount);
              scale = scale.dividedBy(WithdrawAmount);
              let denominator = 10000000;
              scale = scale.multipliedBy(denominator);
              scale = scale.toFixed(0);
              self.SmartContract.smartContactVersionRetract(
                project.smartContractVersion,
                project.id.toString(),
                scale,
                denominator,
                function(err, data) {
                  if (err) {
                    let error = new Error();
                    error.message = errorHandler.filler(err);
                    error.status = 405;
                    return callback(error);
                  }
                });
            }
          },
          function saveProjectWithdraw(callback) {
            let withdraw = project.projectWithdraw;
            if (canWithdraw) {
              withdraw.canWithdraw = canWithdraw;
            }
            if (isWithdraw) {
              withdraw.isWithdraw = isWithdraw;
            }
            if (isCallWithdraw) {
              withdraw.isCallWithdraw = isCallWithdraw;
            }
            if (transactionId !== '') {
              withdraw.transactionId = transactionId;
            }
            if (WithdrawAmount !== '') {
              withdraw.WithdrawAmount = WithdrawAmount;
            }
            self.ProjectWithdraw.save(withdraw, callback);
          },
        ], function onComplete(err) {
          if (err) return callback(err);
          callback();
        });
      }
    }, function done(err) {
      if (err) console.log(err);
      console.log('done');
      self.processing = false;
    });
  });
};
