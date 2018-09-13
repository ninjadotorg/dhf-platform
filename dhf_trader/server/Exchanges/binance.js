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

    async getBalance(params){

       if (params.currencies) {
           params.currencies = params.currencies.split(",")
       }
       let result =  await this.client.accountInfo();
       var returnList = []
       for (var i in result.balances){
           let asset = result.balances[i]
           if (Number(asset.free) != 0 || Number(asset.locked) != 0){
               if (!params.currencies || params.currencies.indexOf(asset.asset)>-1 ) returnList.push(asset)
           }
       }
       return returnList
    }

    async buyLimit(params){
        // const clientOrderId = project + '-' + new Date().getTime()

        let result = await this.client.order({
            symbol: params.symbol,
            side: 'BUY',
            type: "LIMIT",
            quantity: params.quantity,
            price: params.price,
            // newClientOrderId: clientOrderId,
            newOrderRespType: "FULL"
        })

        return result
    }

    async sellLimit(params){
        let result = await this.client.order({
            symbol: params.symbol,
            side: 'SELL',
            type: "LIMIT",
            quantity: params.quantity,
            price: params.price,
        })
        return result
    }

    async getOrder(params){
        let result = await this.client.getOrder({
            symbol: params.symbol,
            origClientOrderId: params.clientOrderId,
        })
        return result
    }

    async cancelOrder(params){
        let result = await this.client.cancelOrder({
            symbol: params.symbol,
            origClientOrderId: params.clientOrderId,
        })
        return result
    }

    async openOrders({ symbol = '' } = {}) {
        let result
        if (!symbol) {
            result = await this.client.openOrders()
        } else {
            result = await this.client.openOrders({ symbol })
        }
        return result
    }

    async allOrders({ symbol = '' } = {}) {
        let result
        if (!symbol) {
            result = await this.client.allOrders()
        } else {
            result = await this.client.allOrders({ symbol })
        }
        return result
    }

    async accountInfo(params) {
        let result = await this.client.accountInfo()
        return result
    }

    async buyMarket(params){
        let result = await this.client.order({
            symbol: params.symbol,
            side: 'BUY',
            type: "MARKET",
            quantity: params.quantity,
        })
        return result
    }

    async sellMarket(params){
        let result = await this.client.order({
            symbol: params.symbol,
            side: 'SELL',
            type: "MARKET",
            quantity: params.quantity,
        })
        return result
    }

    async tradeHistory(params){
        let result = await this.client.tradesHistory({ symbol: params.symbol})
        return result
    }

    async depositHistory() {
        return JSON.stringify(await this.client.depositHistory())
    }

    async withdrawHistory() {
        return JSON.stringify(await this.client.withdrawHistory())
    }

    async withdraw(params) {
        let result = await this.client.withdraw({
            asset: params.asset,
            address: params.address,
            amount: params.amount
        })
        return result
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

    async getPrices() {
        return await this.client.prices()
    }

    transformToOrder(result) {
        return {
            orderKey: result.clientOrderId,
            symbol: result.symbol,
            side: result.side,
            type: result.type,
            exchangeOrderID: result.orderId,
            time: result.transactTime,
            status: result.status,
            price: result.price,
            requestQty: result.origQty,
            fillQty: 0,
            fillQuoteQty: 0
        }
    }
}
