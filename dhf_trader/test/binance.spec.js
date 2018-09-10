require("../configs/configuration")
const expect = require('chai').expect
const sinon = require('sinon')
const sinonTestFactory = require('sinon-test')
const sinonTest = sinonTestFactory(sinon)
const BinanceAPI = require('binance-api-node').default
const Binance = require("../server/Exchanges/binance")

describe('Binance', () => {
  let stubAPI
  let binance

  before(() => {
    stubAPI = sinon.stub(BinanceAPI())

    binance = new Binance({})
    binance.client = stubAPI
  })

  it('buyLimit', sinonTest(async () => {
    const params = {
      symbol: 'BTC',
      quantity: 1,
      price: 500
    }
    await binance.buyLimit(params)

    expect(stubAPI.order.called).to.be.true
    sinon.assert.calledWithMatch(stubAPI.order, params)
  }))

  it('sellLimit', sinonTest(async () => {
    const params = {
      symbol: 'BTC',
      quantity: 1,
      price: 500
    }
    await binance.sellLimit(params)

    expect(stubAPI.order.called).to.be.true
    sinon.assert.calledWithMatch(stubAPI.order, params)
  }))

  it('getOrder', sinonTest(async () => {
    const params = {
      symbol: 'BTC'
    }
    await binance.getOrder(params)

    expect(stubAPI.getOrder.called).to.be.true
    sinon.assert.calledWithMatch(stubAPI.getOrder, params)
  }))

  it('cancelOrder', sinonTest(async () => {
    const params = {
      symbol: 'BTC'
    }
    await binance.cancelOrder(params)

    expect(stubAPI.cancelOrder.called).to.be.true
    sinon.assert.calledWithMatch(stubAPI.cancelOrder, params)
  }))
})
