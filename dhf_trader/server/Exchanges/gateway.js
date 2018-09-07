"use strict";

let Binance = require('./binance')
let ExchangeDB = require("../../common/models/exchanges")
let ExchageList = {}

module.exports = class Gateway {

    constructor(name, account){
        this.name = name
        this.account = account
    }

    async init(name, account){
        var self = this
        this.name = name || this.name
        this.account = account || this.account
        
        let cred = await ExchangeDB.findOne({name: this.name, account: this.account})
        
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

