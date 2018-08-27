'use strict';

module.exports = function(Project) {
  // listProjects
  Project.listProjects = function(cb) {
    Project.find({
      fields: {
        status: 'open',
      },
    }, cb);
  };
  Project.remoteMethod('listProjects', {
    returns: {arg: 'projects', type: 'array'},
    http: {path: '/list', verb: 'get'},
  });
};
