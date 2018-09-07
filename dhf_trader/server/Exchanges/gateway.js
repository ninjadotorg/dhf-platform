"use strict";

let Binance = require('./binance')
let ExchangeDB = require("../../common/models/exchanges")

var projectAccount = {}

module.exports = class Gateway {

    constructor(){
    }

    async init(project){
        var exchangeAccount = projectAccount[project]
        if (!projectAccount[project]){
            exchangeAccount =  await ExchangeDB.getProjectAccount(project);
            projectAccount[project] = exchangeAccount
            if (!exchangeAccount) throw new Error("Cannot find project")
        }
        switch (exchangeAccount.name) {
            case "binance": 
                this.exchange = new Binance(exchangeAccount);
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

