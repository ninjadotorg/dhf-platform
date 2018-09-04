require("../configs/configuration")
const request = require("request")
const Gateway = require("../server/Exchanges/gateway")

async function test() {
    var gateway = new Gateway("binance", "test");
    await gateway.init()

    
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


    await gateway.action("myTrades", {})

}

test()
