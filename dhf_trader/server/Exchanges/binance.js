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
