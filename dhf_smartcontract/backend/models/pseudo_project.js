var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var Project   = new Schema({
    state: String
},{ collection: 'project' });

Project.set('autoIndex', true);
Project.index({})

const connection = mongoose.createConnection(__Config.ProjectDB);
var DBModel = connection.model('Project', Project);
exports = module.exports = DBModel
