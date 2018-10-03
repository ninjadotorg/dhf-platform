'use strict'
const moment = require('moment')
const Promise = require('bluebird')
var BinanceAPI = require('binance-api-node').default
const OrderDB = require('../../common/models/orders')

module.exports = class Binance {
  constructor (cred) {
    this.client = BinanceAPI({
      apiKey: cred.key,
      apiSecret: cred.secret
    })
  }

  async updateCredential (cred) {
    this.client = BinanceAPI({
      apiKey: cred.key,
      apiSecret: cred.secret
    })
    // console.log(await this.client.trades({ symbol: 'EDOETH' }))
  }

  async getBalance (params) {
    var returnList = {}

    if (params.currencies) {
      params.currencies = params.currencies.split(',')
      for (var i in params.currencies) {
        returnList[params.currencies[i]] = {
          free: '0.00000000',
          locker: '0.00000000'
        }
      }
    }

    let result = await this.client.accountInfo()

    for (var i in result.balances) {
      let asset = result.balances[i]
      if (Number(asset.free) != 0 || Number(asset.locked) != 0) {
        if (!params.currencies || params.currencies.indexOf(asset.asset) > -1) {
          returnList[asset.asset] = { free: asset.free, locked: asset.locked }
        }
      }
    }

    return returnList
  }

  async buyLimit (params) {
    // const clientOrderId = project + '-' + new Date().getTime()

    let result = await this.client.order({
      symbol: params.symbol,
      side: 'BUY',
      type: 'LIMIT',
      quantity: params.quantity,
      price: params.price,
      // newClientOrderId: clientOrderId,
      newOrderRespType: 'FULL'
    })

    return result
  }

  async sellLimit (params) {
    let result = await this.client.order({
      symbol: params.symbol,
      side: 'SELL',
      type: 'LIMIT',
      quantity: params.quantity,
      price: params.price
    })
    return result
  }

  async getOrder (params) {
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

  async cancelOrder (params) {
    let query = {
      symbol: params.symbol
    }

    if (params.orderId) query.orderId = params.orderId
    if (params.clientOrderId) query.origClientOrderId = params.clientOrderId

    let result = await this.client.cancelOrder(query)
    return result
  }

  async openOrders ({ symbol } = {}) {
    if (symbol) {
      return await this.client.openOrders({ symbol })
    }
    return await this.client.openOrders()
  }

  async allOrders ({ project = '', symbol = '', limit = 10 } = {}) {
    if (symbol) {
      return await this.client.allOrders({ symbol, limit })
    }

    const orders = await OrderDB.find({
      project,
      status: { $in: ['CANCELED', 'FILLED'] },
      time: {
        $lte: moment()
          .subtract(24, 'hours')
          .toDate()
      }
    }).limit(limit)

    return orders.map(o => this.transformFromOrder(o))
  }

  async accountInfo (params) {
    let result = await this.client.accountInfo()
    return result
  }

  async buyMarket (params) {
    let result = await this.client.order({
      symbol: params.symbol,
      side: 'BUY',
      type: 'MARKET',
      quantity: params.quantity
    })
    return result
  }

  async sellMarket (params) {
    let result = await this.client.order({
      symbol: params.symbol,
      side: 'SELL',
      type: 'MARKET',
      quantity: params.quantity
    })
    return result
  }

  async tradeHistory (params) {
    let result = await this.client.tradesHistory({ symbol: params.symbol })
    return result
  }

  async depositHistory () {
    return await this.client.depositHistory()
  }

  async withdrawHistory () {
    return await this.client.withdrawHistory()
  }

  async withdraw (params) {
    let result = await this.client.withdraw({
      asset: params.asset,
      address: params.address,
      amount: params.amount
    })
    return result
  }

  async myTrades (params) {
    return await this.client.myTrades({
      symbol: params.symbol,
      limit: params.limit || 10
    })
  }

  async exchangeInfo () {
    return await this.client.exchangeInfo()
  }

  async getDepositAddress (params) {
    return await this.client.depositAddress({ asset: params.asset })
  }

  async getPrices () {
    return await this.client.prices()
  }

  async getListenKey () {
    return await this.client.getDataStream()
  }

  async keepDataStream ({ listenKey }) {
    return await this.client.keepDataStream({ listenKey })
  }

  async closeDataStream ({ listenKey }) {
    return await this.client.closeDataStream({ listenKey })
  }

  async sellAll ({ project }) {
    const { balances } = await this.client.accountInfo()
    const invalidAssets = {}

    // cancel all open orders
    const orders = await this.openOrders()
    if (orders.length) {
      await Promise.map(
        orders,
        async o =>
          await this.cancelOrder({ symbol: o.symbol, orderId: o.orderId }),
        { concurrency: 2 }
      )
    }

    for (let i = 0; i < balances.length; i++) {
      const { asset, free } = balances[i]
      if (asset === 'ETH') {
        continue
      }
      const quantity = Number(free.match(/\d+(?:\.\d{0,2})?/)[0])
      if (quantity === 0) {
        continue
      }

      const symbol = `${asset}ETH` // sell asset to get eth
      try {
        console.log('selling symbol:', symbol, 'quantity:', quantity)
        await this.sellMarket({ symbol, quantity })
      } catch (e) {
        // Invalid symbol
        if (e.code === -1121) {
          invalidAssets[asset] = quantity
          continue
        }

        // Filter failure: LOT_SIZE
        if (e.code == -1013) {
          continue
        }

        console.log('error while selling symbol', symbol, e)
      }
    }

    if (Object.keys(invalidAssets).length) {
      for (let asset in invalidAssets) {
        if (asset === 'BTC') {
          continue
        }
        try {
          // sell asset to get btc
          await this.sellMarket({
            symbol: `${asset}BTC`,
            quantity: invalidAssets[asset]
          })
        } catch (e) {
          console.log('error while selling asset', asset, 'to BTC', e)
        }
      }
    }

    const { balances: balancesAfterSell } = await this.client.accountInfo()
    for (let i = 0; i < balancesAfterSell.length; i++) {
      if (balancesAfterSell[i].asset !== 'BTC') {
        continue
      }

      // sell all btc to get eth
      try {
        await this.sellMarket({
          symbol: 'ETHBTC',
          quantity: Number(balancesAfterSell[i].free)
        })
      } catch (e) {
        if (e.code !== -1013) {
          console.log('error while selling btc to get eth', e)
        }
      }

      break
    }
  }

  transformToOrder (result) {
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

  transformFromOrder (order) {
    return {
      symbol: order.symbol,
      orderId: order.exchangeOrderID,
      clientOrderId: order.orderKey,
      price: order.price,
      origQty: order.requestQty,
      executedQty: order.fillQty,
      status: order.status,
      timeInForce: order.time,
      type: order.type,
      side: order.side,
      stopPrice: 0,
      icebergQty: 0,
      time: order.time
    }
  }
}
