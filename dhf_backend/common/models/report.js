'use strict';
let {PROJECT_STATE} = require('../lib/constants');
let async = require('async');
let errorHandler = require('../lib/error-handler');

module.exports = function(Report) {
  Report.running = function(callback) {
    let error = new Error();
    let result = {
      cumulativeEarnings: 0,
      cumulativeReturn: 0,
      numberOfProjects: 0,
      totalFundRaised: 0,
      projects: [],
    };
    Report.app.models.Project.find({
      where: {
        state: PROJECT_STATE.RELEASE,
        userId: Report.app.currentUserId,
      },
    }, function(err, projects) {
      if (err) {
        return callback(err);
      }
      async.eachSeries(projects, function(project, callback) {
        let currentBalance = 0;
        let returnPercent = 0;
        let yourEarnings =  0;
        let growthPercent = 0;
        async.series([
          function getCurrentBalance(callback) {
            Report.app.models.trade.getBalanceInCurrency(
              project.id.toString(),
              project.currency,
              function(err, data) {
                if (err) {
                  error.message = errorHandler.filler(err);
                  error.status = 405;
                  return callback(error);
                } else {
                  // Return(%) = (Current balance - Initial balance) / Initial balance) *100
                  // Growth (%)= (Return - previous return)/previous return ) * 100
                  // Withdrawal request (%) = ⅀ (Fund share of each investor)
                  // Your earnings = (Current balance - init balance) * Commission rate
                  currentBalance = project.fundingAmount -  project.releasedAmount +  data.balance;
                  returnPercent = ((currentBalance - project.fundingAmount) / project.fundingAmount) * 100;
                  yourEarnings =  (currentBalance - project.fundingAmount) * project.commission;
                  growthPercent = 'NA';
                  callback();
                }
              }
            );
          },
        ], function onComplete(err) {
          if (err) {
            return callback(err);
          } else {
            project.currentBalance = currentBalance;
            project.returnPercent = returnPercent;
            project.growthPercent = growthPercent;
            project.yourEarnings = yourEarnings;
            result.cumulativeEarnings += yourEarnings;
            result.cumulativeReturn += returnPercent;
            result.numberOfProjects += 1;
            result.totalFundRaised += project.fundingAmount;
            result.projects.push(project);
            callback();
          }
        });
      }, function done(err) {
        if (err) {
          callback(err);
        } else {
          callback(null, result);
        }
      });
    });
  };

  Report.remoteMethod(
    'running',
    {
      accepts: [],
      http: {
        path: '/running-project',
        verb: 'GET',
      },
      returns: {arg: 'data', root: true, type: 'Object'},
    }
  );
};
