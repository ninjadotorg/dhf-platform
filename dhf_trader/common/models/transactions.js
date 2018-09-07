var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

/**
 * Cannot cancel transaction if in pending, processing state
 */

var Transaction   = new Schema({
    project: {type: String, index: true},
    orderKey: {type: String, index: true, unique: true},

    symbol: {type: String, index: true},//ETH-USDT (base-quote)
    side: {type: String}, //BUY | SELL
    type: {type: String}, //LIMIT|MARKET

    exchangeOrderID: {type: Number, index: true, unique: true},
    time: {type: Date, index: true},
    status: {type: String, index: true}, //pending | processing | new | fill | partially fill | cancel

    price: {type: String},
    requestQty: {type: String},
    fillQty: {type: String},
    fillQuoteQty: {type: String},

});

Transaction.set('autoIndex', true);
Transaction.index({})
const connection = mongoose.createConnection(__Config.TransactionDB);
var DBModel = connection.model('Transaction', Transaction);

exports = module.exports = DBModel