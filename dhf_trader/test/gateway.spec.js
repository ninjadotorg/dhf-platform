require("../configs/configuration")
const expect = require('chai').expect
const sinon = require('sinon')
const sinonTestFactory = require('sinon-test')
const sinonTest = sinonTestFactory(sinon)
const BinanceAPI = require('binance-api-node').default
const Binance = require("../server/Exchanges/binance")

describe('Gateway', () => {
})

// async function test() {
//     var gateway = new Gateway("binance", "test");
//     await gateway.init()

    // var params = {
    //     symbol: "EDOETH",
    //     quantity: "10",
    //     price: "0.003112",
    //     clientOrderId: "hihihi1"
    // }
    // var result = await gateway.action("buyLimit", params)
    // console.log(result)


    // params = {
    //     symbol: "EDOETH",
    //     clientOrderId: "hihihi1"
    // }
    // result = await gateway.action("getOrder", params)
    // console.log(result)

    // params = {
    //     symbol: "ADAETH",
    //     clientOrderId: "hihihi1"
    // }
    // result = await gateway.action("cancelOrder", params)
    // console.log(result)


//     let result = await gateway.action("getDepositAddress", {asset: "BTC"})
//     console.log(result)
// }
//
// test()

