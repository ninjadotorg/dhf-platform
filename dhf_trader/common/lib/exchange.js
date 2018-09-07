let ExchangeDB = require("../models/exchanges")
let GateWay = require("../../server/Exchanges/gateway")

module.exports = {
    getBalance: async function(name, account, currency){
        let result = await ExchangeDB.findOne({name, account})
        let exchange = new GateWay(result.name, result.account)
        await exchange.init()
        result = await exchange.action("getBalance")
        for (var i in result){
            if (result[i].asset == currency)
                return parseFloat(result[i].free)
        }
        return 0
    }
}