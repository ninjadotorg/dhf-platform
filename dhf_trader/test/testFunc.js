require("../configs/configuration")
let AssetDB = require("../common/models/assets")
let ExchangeUtil = require("../common/lib/exchange")

!async function (){
    // let sumAmount = await AssetDB.getTotalAmount("test", "USDT")
    // console.log(sumAmount)

    let result = await ExchangeUtil.getBalance("binance","test","BTC")
    
}()

