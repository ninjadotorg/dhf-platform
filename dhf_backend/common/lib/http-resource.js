'use strict';

module.exports = function(app) {
  let ds = app.loopback.createDataSource({
    connector: require('loopback-connector-rest'),
    debug: false,
    baseURL: app.get('trader').URL,
    operations: [{
      template: {
        'method': 'POST',
        'url': '',
        'headers': {
          'accepts': 'application/json',
          'content-type': 'application/json',
        },
        'body': {
          'a': '{a:number}',
          'b': '{b=true}',
        },
      },
      functions: {
        'myOp': [
          'a',
          {
            'name': 'b',
            'source': 'header',
          },
        ],
      },
    }],
  });
};
