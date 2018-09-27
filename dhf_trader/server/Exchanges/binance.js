"use strict";
var BinanceAPI = require('binance-api-node').default;

module.exports = class Binance {
    constructor(cred) {
        this.client = BinanceAPI({
            apiKey: cred.key,
            apiSecret: cred.secret,
        })
    }

    async updateCredential(cred) {
        this.client = BinanceAPI({
            apiKey: cred.key,
            apiSecret: cred.secret,
        })
        // console.log(await this.client.trades({ symbol: 'EDOETH' }))
    }

    async getBalance(params) {

        var returnList = {}

        if (params.currencies) {
            params.currencies = params.currencies.split(",")
            for (var i in params.currencies) {
                returnList[params.currencies[i]] = { free: "0.00000000", locker: "0.00000000" }
            }
        }

        let result = await this.client.accountInfo();

        for (var i in result.balances) {
            let asset = result.balances[i]
            if (Number(asset.free) != 0 || Number(asset.locked) != 0) {
                if (!params.currencies || params.currencies.indexOf(asset.asset) > -1) returnList[asset.asset] = { free: asset.free, locked: asset.locked }
            }
        }

        return returnList
    }

    async buyLimit(params) {
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

    async sellLimit(params) {
        let result = await this.client.order({
            symbol: params.symbol,
            side: 'SELL',
            type: "LIMIT",
            quantity: params.quantity,
            price: params.price,
        })
        return result
    }

    async getOrder(params) {
        let query = {
            symbol: params.symbol
        }
        if (params.orderId) {
            query.orderId = params.orderId
        }
        if (params.clientOrderId) {
            query.origClientOrderId = params.clientOrderId
        }

        return await this.client.getOrder(query)
    }

    async cancelOrder(params) {
        let query = {
            symbol: params.symbol
        }

        if (params.orderId) query.orderId = params.orderId
        if (params.clientOrderId) query.origClientOrderId = params.clientOrderId

        let result = await this.client.cancelOrder(query)
        return result
    }

    async openOrders({ symbol, limit = 10 }) {
        if (symbol) {
            return await this.client.openOrders({ symbol, limit })
        }
        return await this.client.openOrders({ limit })
    }

    async allOrders({ symbol, limit = 10 }) {
        if (symbol) {
            return await this.client.allOrders({ symbol, limit })
        }
        return await this.client.allOrders({ limit })
    }

    async accountInfo(params) {
        let result = await this.client.accountInfo()
        return result
    }

    async buyMarket(params) {
        let result = await this.client.order({
            symbol: params.symbol,
            side: 'BUY',
            type: "MARKET",
            quantity: params.quantity,
        })
        return result
    }

    async sellMarket(params) {
        let result = await this.client.order({
            symbol: params.symbol,
            side: 'SELL',
            type: "MARKET",
            quantity: params.quantity,
        })
        return result
    }

    async tradeHistory(params) {
        let result = await this.client.tradesHistory({ symbol: params.symbol })
        return result
    }

    async depositHistory() {
        return await this.client.depositHistory()
    }

    async withdrawHistory() {
        return await this.client.withdrawHistory()
    }

    async withdraw(params) {
        let result = await this.client.withdraw({
            asset: params.asset,
            address: params.address,
            amount: params.amount
        })
        return result
    }

    async myTrades(params) {
        return await this.client.myTrades({
            symbol: params.symbol,
            limit: params.limit || 10
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

    async getListenKey() {
        return await this.client.getDataStream()
    }

    async keepDataStream({ listenKey }) {
        return await this.client.keepDataStream({ listenKey })
    }

    async closeDataStream({ listenKey }) {
        return await this.client.closeDataStream({ listenKey })
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
