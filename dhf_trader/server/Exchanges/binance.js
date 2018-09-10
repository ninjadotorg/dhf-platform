"use strict";
var BinanceAPI = require('binance-api-node').default;

module.exports = class Binance {
    constructor(cred){
        this.client = BinanceAPI({
            apiKey: cred.key,
            apiSecret: cred.secret,
        })
    }

    async updateCredential(cred){
        this.client = BinanceAPI({
            apiKey: cred.key,
            apiSecret: cred.secret,
        })
        // console.log(await this.client.trades({ symbol: 'EDOETH' }))
    }

    async getBalance(currencies){
        let result =  await this.client.accountInfo();
        var returnList = []
        for (var i in result.balances){
            let asset = result.balances[i]
            if (Number(asset.free) != 0 || Number(asset.locked) != 0){                
                if (!currencies || currencies.indexOf(asset.asset)>-1) returnList.push(asset)
            }   
        }
        return returnList
    }

    async buyLimit(params){
        let result = await this.client.order({
            symbol: params.symbol,
            side: 'BUY',
            type: "LIMIT",
            quantity: params.quantity,
            price: params.price,
            newClientOrderId: params.clientOrderId,
            newOrderRespType: "FULL"
        })
        return JSON.stringify(result)
    }

    async sellLimit(params){
        let result = await this.client.order({
            symbol: params.symbol,
            side: 'SELL',
            type: "LIMIT",
            quantity: params.quantity,
            price: params.price,
        })
        return JSON.stringify(result)
    }

    async getOrder(params){
        let result = await this.client.getOrder({
            symbol: params.symbol,
            origClientOrderId: params.clientOrderId,
        })
        return JSON.stringify(result)
    }

    async cancelOrder(params){
        let result = await this.client.cancelOrder({
            symbol: params.symbol,
            origClientOrderId: params.clientOrderId,
        })
        return JSON.stringify(result)
    }

    async buyMarket(params){
        let result = await this.client.order({
            symbol: params.symbol,
            side: 'BUY',
            type: "MARKET",
            quantity: params.quantity,
        })
        return JSON.stringify(result)
    }

    async sellMarket(params){
        let result = await this.client.order({
            symbol: params.symbol,
            side: 'SELL',
            type: "MARKET",
            quantity: params.quantity,
        })
        return JSON.stringify(result)
    }

    async tradeHistory(params){
        console.log(await this.client.tradesHistory({ symbol: 'ETHBTC' }))
    }

    async myTrades(params){
        return await this.client.myTrades({
            symbol: params.symbol,
        })
    }

    async exchangeInfo() {
        return await this.client.exchangeInfo()
    }

    async getDepositAddress(params) {
        return await this.client.depositAddress({ asset: params.asset })
    }
}
