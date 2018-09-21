require("../configs/configuration")
let AssetDB = require("../common/models/assets")
let ExchangeDB = require("../common/models/exchanges")
let ExchangeUtil = require("../common/lib/exchange")

!async function (){
    let getLock = await ExchangeDB.getAvailableAccounts("binance")
    console.log(getLock)
}()

