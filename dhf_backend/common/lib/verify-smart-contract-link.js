'use strict';
const limistTime = 1440; // one day (24hours) in a  minute
module.exports = function(app) {
  let self = {
    verify: function(data, amount, callback) {
      if (!data) callback({
        code: 1,
        mess: 'Address was not found!',
      });
      if (!self.verifyTime(data.requestDate)) callback({
        code: 2,
        mess: 'Your session has expired!',
      });
      if (data.amountTest !== amount) callback({
        code: 3,
        mess: 'Your amount test not validated!',
      });
      data.status = 'approved';
      data.activeDate = new Date();
      data.save(data, callback);
    },
    verifyTime: function(date) {
      let createdDate = new Date(date);
      let now = new Date();
      let validated = (now - createdDate) / 1000; // convert to  minutes;
      return (validated <= limistTime);
    },
  };
  return self;
};
