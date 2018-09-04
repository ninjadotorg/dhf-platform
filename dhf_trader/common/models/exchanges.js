var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var Exchange   = new Schema({
    exchange: {type: String, index: true},
    email: {type: String, index: true},
    account: {type: String, index: true},
    role: {type: String, index: true, default: "trade"}, // trade | withdraw
    type: {type: String, index: true, default: "single"}, // single | multi
    key: {type: String},
    secret: {type: String},
});

Exchange.set('autoIndex', true);
Exchange.index({exchange: 1, email: 1, role: 1})
const connection = mongoose.createConnection(__Config.exchangeDB);
var DBModel = connection.model('Exchange', Exchange);
exports = module.exports = DBModel