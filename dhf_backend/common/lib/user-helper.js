'use strict';
const ejs = require('ejs');
const fs = require('fs');

module.exports = {
  template: function(file) {
    var templates = this._templates || (this._templates = {});
    var str = templates[file] || (templates[file] = fs.readFileSync(file, 'utf8'));
    return ejs.compile(str);
  },
};
