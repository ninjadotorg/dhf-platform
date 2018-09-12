'use strict';

module.exports = function(app) {
  let CronJob = require('cron').CronJob;

  let crons = [];
  let cronConfigs = app.get('crons');
  let cronNames = Object.keys(cronConfigs);

  // foreach cron configured, select all the enabled and add it to the cron's list.
  cronNames.forEach(function(cronName, index, array) {
    let cronConfig = cronConfigs[cronName];
    if (cronConfig.enable === true) {
      console.log('Including the ' + cronName + ' in the crons list.');
      cronConfig['name'] = cronName;
      crons.push(cronConfig);
    }
  });

  console.log('Initializing ' + crons.length + ' cronjobs');

  crons.forEach(function(cronConfig) {
    let pattern = cronConfig.interval;
    let JobClass = require('../' + cronConfig.jobClass);
    let jobToExecute = new JobClass(app, cronConfig);

    try {
      console.log('Launching cron ' + cronConfig.name);
      let job = new CronJob({
        cronTime: pattern,
        onTick: function() {
          jobToExecute.run();
        },
        start: true,
        runOnInit: false,
      });
    } catch (ex) {
      console.log(ex);
    }
  });
};
