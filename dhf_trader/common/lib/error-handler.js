'use strict';

module.exports = {
  filler: function(error) {
    console.log(error);
    let err;
    if (typeof error !== 'object') {
      error = JSON.parse(error);
    }
    if (error && error.body) {
      let body = error.body;
      try {
        body = JSON.parse(body);
        err = body.msg || body.message;
      } catch (e) {
        err = body;
      }
    }
    return err;
  },
};
