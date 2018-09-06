require("../configs/configuration")
let credentials = require("../configs/credentials")

var ExchangeDB = require("../common/models/exchanges")
!async function(){
    for (let i in credentials){
        let result = await ExchangeDB.findOneAndUpdate({email: credentials[i].email, permission: (credentials[i].role || "trade") }, credentials[i], {upsert: true, new: true})
    }
    process.exit()
}()
