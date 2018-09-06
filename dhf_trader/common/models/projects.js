var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var Project   = new Schema({
    name: {type: String, index: true, unique: true},
    account: {type: String, index: true}
});

Project.set('autoIndex', true);
Project.index({})

const connection = mongoose.createConnection(__Config.ProjectDB);
var DBModel = connection.model('Project', Project);
exports = module.exports = DBModel

