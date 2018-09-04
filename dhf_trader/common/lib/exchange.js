let ExchangeDB = require("../models/exchanges")
module.exports = {
    getExchangeAccounts: async function(exchange){
        let results = await ExchangeDB.find({exchange: exchange})
        let data = results.map((exchange) => {
            return exchange.account
        })
        return data
    }
}