var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var Exchange   = new Schema({
    name: {type: String, index: true},
    email: {type: String, index: true},
    account: {type: String, index: true},
    permission: {type: String, index: true, default: "trade"}, // trade | withdraw
    type: {type: String, index: true, default: "single"}, // single | share
    key: {type: String},
    secret: {type: String},
});

Exchange.set('autoIndex', true);
Exchange.index({exchange: 1, email: 1, role: 1})
const connection = mongoose.createConnection(__Config.ExchangeDB);
var DBModel = connection.model('Exchange', Exchange);
exports = module.exports = DBModel

// =================== =====================//
// =================== =====================//
// =================== =====================//

DBModel.getExchangeAccounts= async function(exchange){
    let results = await this.find({exchange: exchange})
    let data = results.map((exchange) => {
        return exchange.account
    })
    return data
}