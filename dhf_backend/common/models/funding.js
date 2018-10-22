'use strict';
let async = require('async');
let {PROJECT_STATE} = require('../lib/constants');

module.exports = function(Funding) {
  Funding.observe('before save', function(ctx, next) {
    if (ctx.instance && ctx.isNewInstance) {
      ctx.instance.state = PROJECT_STATE.INITFUND;
      Funding.app.models.project.findById(ctx.instance.projectId, function(err, project) {
        if (err) return next(err);
        let error = new Error();
        if (!project) {
          error.status = 405;
          error.message = 'Project was not existed!';
          return next(error);
        }
        console.log(123, project.state === PROJECT_STATE.READY);
        if (!(project.state === PROJECT_STATE.READY ||
        project.state === PROJECT_STATE.INITFUND)) {
          error.status = 405;
          error.message = 'Project was not ready for fund or finished!';
          return next(error);
        }
        next();
      });
    } else {
      next();
    }
  });
  Funding.observe('after save', function(ctx, next) {
    if (ctx.instance && ctx.isNewInstance) {
      Funding.app.models.project.findById(ctx.instance.projectId, function(err, project) {
        if (err) return next(err);
        project.refundAmount += ctx.Model.amount;
        project.save(project, function(err) {
          if (err) return next(err);
          next();
        });
      });
    } else {
      next();
    }
  });
  Funding.listFunding = function(projectId, callback) {
    let error = new Error();
    let fundings = {};
    async.series([
      function validateProject(callback) {
        Funding.app.models.project.findById(projectId, function(err, project) {
          if (err) return callback(err);
          if (!project) {
            error.status = 405;
            error.message = 'Project was not existed!';
            return callback(error);
          }
          if (project.userId.toString() !== Funding.app.currentUserId.toString()) {
            error.status = 405;
            error.message = 'You don\'t have permission on this project';
            return callback(error);
          }
          callback();
        });
      },
      function findFunding(callback) {
        Funding.find({where: {
          projectId: projectId,
        }}, function(err, funding) {
          if (err) return callback(err);
          if (!funding) {
            error.status = 405;
            error.message = 'Project don\'t have any funding!';
            return callback(error);
          }
          fundings = funding;
          callback();
        });
      },
    ], function onComplete(err) {
      if (err)
        return callback(err);
      callback(null, fundings);
    });
  };

  Funding.myFunding = function(callback) {
    Funding.find({where: {
      userId: Funding.app.currentUserId,
    }}, callback);
  };

  Funding.listFundingByOwner = function(ownerAddress, callback) {
    Funding.find({where: {
      owner: ownerAddress,
    }}, callback);
  };

  Funding.remoteMethod('listFunding', {
    description: 'Get all Funding of project',
    accepts: [
      {arg: 'projectId', type: 'string', required: true},
    ],
    returns: {arg: 'data', root: true, type: 'Object'},
    http: {path: '/list', verb: 'get'},
  });

  Funding.remoteMethod('myFunding', {
    description: 'Get all Funding of current user',
    accepts: [],
    returns: {arg: 'data', root: true, type: 'Object'},
    http: {path: '/my-fund', verb: 'get'},
  });

  Funding.remoteMethod('listFundingByOwner', {
    description: 'Get all Funding of current by owner address',
    accepts: [
      {arg: 'ownerAddress', type: 'string', required: true},
    ],
    returns: {arg: 'data', root: true, type: 'Object'},
    http: {path: '/list/:ownerAddress', verb: 'get'},
  });
};
