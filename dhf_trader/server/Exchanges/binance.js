"use strict";
var BinanceAPI = require('binance-api-node').default;

module.exports = class Binance {
    constructor(cred){
        this.client = BinanceAPI({
            apiKey: cred.key,
            apiSecret: cred.secret,
        })
    }

    updateCredential(cred){
        this.client = BinanceAPI({
            apiKey: cred.key,
            apiSecret: cred.secret,
        })
    }

    async buyLimit(params){
        if (typeof params.symbol == "undefined" ||
            typeof params.price == "undefined" ||
            typeof params.quantity == "undefined")
            throw new Error("Missing params")
            
        let result = await this.client.order({
            symbol: params.symbol,
            side: 'BUY',
            type: "LIMIT",
            quantity: params.quantity,
            price: params.price,
        })
        return JSON.stringify(result)
    }

    async sellLimit(params){
        if (typeof params.symbol == "undefined" ||
            typeof params.price == "undefined" ||
            typeof params.quantity == "undefined")
            throw new Error("Missing params")

        let result = await this.client.order({
            symbol: params.symbol,
            side: 'SELL',
            type: "LIMIT",
            quantity: params.quantity,
            price: params.price,
        })
        return JSON.stringify(result)
    }

    async buyMarket(params){

    }

    async sellMarket(params){

    }

    async tradeHistory(params){
        console.log(await this.client.tradesHistory({ symbol: 'ETHBTC' }))
    }

    async myTrades(params){
        console.log(await this.client.myTrades({
            symbol: 'ETHBTC',
          }))
    }

    async accountInfo() {
        console.log(await this.client.accountInfo())
    }

}
