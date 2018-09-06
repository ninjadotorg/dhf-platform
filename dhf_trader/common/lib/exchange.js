let ExchangeDB = require("../models/exchanges")
let GateWay = require("../../server/Exchanges/gateway")

module.exports = {
    getBalance: async function(name, account, currency){
        let result = await ExchangeDB.findOne({name, account})
        let exchange = new GateWay(result.name, result.account)
        await exchange.init()
        result = await exchange.action("getBalance")
        console.log(result)
        for (var i  in result){
            let asset = result[i]
            if (asset.asset !== "BTC" && asset.asset !== "BNB"  ){
                console.log(asset)
                let sellR = await exchange.action("sellMarket", {symbol: asset.asset + "BTC" , quantity: asset.free})
                console.log(sellR)
                process.exit()
            }
        }
    }
}