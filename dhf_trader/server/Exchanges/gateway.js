"use strict";

let Binance = require('./binance')
let ExchangeDB = require("../../common/models/exchanges")
let ExchageList = {}

module.exports = class Gateway {

    constructor(exchangeName, account){
        var self = this
        this.name = exchangeName;
        this.account = account;
        setInterval(function(){
            ExchangeDB.findOne({exchange: exchangeName, account: account, role: "trade"}, function(err, result){
                if (result){
                    self.exchange.updateCredential(result)
                }
            })  
        },60000)
    }

    async init(){
        var self = this
        let cred = await ExchangeDB.findOne({exchange: this.name, account: this.account, role: "trade"})
        switch (this.name) {
            case "binance": 
                this.exchange = new Binance(cred);
                break;
            default:
                break;
        }
    }


    async action(action, params){
        if (!this.exchange[action]) throw new Error("Action not found")
        return await this.exchange[action](params)
    }
}

