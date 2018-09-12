'use strict';

module.exports = {
  filler: function(error) {
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
    } else if (error && error.message) {
      err = error.message;
    } else {
      err = error;
    }
    return err;
  },
};
