var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var Transaction   = new Schema({
    orderKey: {type: String, index: true, unique: true},
    exchangeOrderID: {type: Number, index: true, unique: true},
    time: {type: Date, index: true},
    status: {type: String, index: true},
    

});

Transaction.set('autoIndex', true);
Transaction.index({})
const connection = mongoose.createConnection(__Config.transactionDB);
var DBModel = connection.model('Transaction', Transaction);

exports = module.exports = DBModel