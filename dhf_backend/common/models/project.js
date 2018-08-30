'use strict';

module.exports = function(Project) {
  Project.observe('before save', function(ctx, next) {
    if (ctx.instance && ctx.isNewInstance) {
      ctx.instance.userId = Project.app.currentUserId;
    }
    next();
  });
  // listProjects
  Project.listProjects = function(callback) {
    Project.find({}, callback);
  };

  Project.myProjects = function(callback) {
    Project.app.models.user.findById(Project.app.currentUserId,
      function(err, user) {
        if (err) callback(err);
        user.project(function(err, projects) {
          if (err) callback(err);
          callback(null, projects);
        });
      });
  };

  Project.remoteMethod('listProjects', {
    description: 'Get all projects',
    returns: {arg: 'data', root: true, type: 'Object'},
    http: {path: '/list/all', verb: 'get'},
  });

  Project.remoteMethod('myProjects', {
    description: 'Get all projects of current user',
    returns: {arg: '', root: true, type: 'Object'},
    http: {path: '/list', verb: 'get'},
  });
};
