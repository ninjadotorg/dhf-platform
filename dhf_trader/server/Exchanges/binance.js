"use strict";
var BinanceAPI = require('binance-api-node').default;
let OrderDB = require("../../common/models/orders")

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

    async buyLimit(params, project){
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

        const order = new OrderDB({
            project: project,
            orderKey: result.clientOrderId,
            symbol: params.symbol,
            side: result.side,
            type: result.type,
            exchangeOrderID: result.orderId,
            time: result.transactTime,
            status: result.status,
            price: params.price,
            requestQty: params.quantity,
            fillQty: 0,
            fillQuoteQty: 0
        })
        await order.save()

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

    async openOrders(params) {
        let result = await this.client.openOrders({
          symbol: params.symbol
        })
        return JSON.stringify(result)
    }

    async allOrders(params) {
        let result = await this.client.allOrders({
          symbol: params.symbol
        })
        return JSON.stringify(result)
    }

    async accountInfo(params) {
        let result = await this.client.accountInfo()
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
        let result = await this.client.tradesHistory({ symbol: params.symbol})
        return JSON.stringify(result)
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
        return JSON.stringify(result)
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
