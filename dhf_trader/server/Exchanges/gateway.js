"use strict";

let Binance = require('./binance')
let ExchangeDB = require("../../common/models/exchanges")
let OrderDB = require("../../common/models/orders")

var projectList = {}
var nameList = {}
module.exports = class Gateway {

    constructor(name, account, project){
        this.name = name
        this.account = account
        this.project = project
        console.log(this.name, this.account, this.project)
    }

    async init(){

        if (this.project){
            console.log("project", this.project)
            var exchangeAccount = projectList[this.project]
            if (!exchangeAccount){
                exchangeAccount =  await ExchangeDB.findOne({'lock.project': this.project});
                projectList[this.project] = exchangeAccount
                if (!exchangeAccount) throw new Error("Cannot find project")
            }
        } else {
            console.log("project", this.name, this.account)
            var exchangeAccount = nameList[this.name + " " + this.account]
            if (!exchangeAccount){
                console.log(this.name, this.account)
                exchangeAccount =  await ExchangeDB.findOne({name: this.name, account: this.account});
                nameList[this.name + " " + this.account] = exchangeAccount
                if (!exchangeAccount) throw new Error("Cannot find project")
            }
        }

        switch (exchangeAccount.name) {
            case "binance":
                this.exchange = new Binance(exchangeAccount);
                break;
            default:
                throw new Error('exchange ' + exchangeAccount.name + ' is not supported')
                break;
        }
    }

    async action(action, params){
        if (!this.exchange[action]) throw new Error("Action not found")
        const result = await this.exchange[action](params)

        switch (action) {
            case 'buyLimit':
            case 'sellLimit':
            case 'buyMarket':
            case 'sellMarket':
                const transformed = this.exchange.transformToOrder(result)
                const order = new OrderDB({...transformed, project: this.project})
                await order.save()
        }

        return result
    }
}

