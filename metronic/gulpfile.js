var gulp = require('gulp');
var gls = require('gulp-live-server');
gulp.task('serve', function() {
  //1. serve with default settings
  var server = gls([gls.script, 'static', 8000]);
  server.start();


  //use gulp.watch to trigger server actions(notify, start or stop)
  gulp.watch(['/**/*.css', '/**/*.html'], function (file) {
    server.notify.apply(server, [file]);
  });
});