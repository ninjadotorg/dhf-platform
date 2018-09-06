"use strict";
var ExchangeUtil = require("../common/lib/exchange")

var Gateway = require('./Exchanges/gateway');
let ExchangeDB = require("../common/models/exchanges")
let ProjectDB = require("../common/models/projects")
let AssetDB = require("../common/models/assets")

let Async = require("async");


var GatewayList = {}
var semaphores = {}
var swaggerUi = require('swagger-ui-express'),
YAML = require('yamljs'),
swaggerDocument = YAML.load(__dirname + '/../configs/swagger.yaml')

exports = module.exports = function (app, router){
    
    app.use('/trade/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    
    router.get("/trade/getExchageAccounts", getExchageAccounts);

    router.all("/trade/:project/:action", action);
    
    router.all('*', function(req, res) {
		console.error("Not found: %s %s",req.method,req.url)
  		res.status("404").end();
	});
}

async function getExchageAccounts(req, res){
    let result = await ExchangeCommon.getExchangeAccounts(req.params.exchange)
    res.end(JSON.stringify(result))
}


async function action(req, res){
    try {
        let action = req.params.action
        let project = req.params.project
        let params = (req.method == "POST") ? req.body : req.query

        if (!semaphores[project]) semaphores[project] = require("semaphore")(1)

        semaphores[project].take(function(){
            switch (action){
                case "addFund": 
                    let currency = params.currency
                    let amount = params.amount
                    let account = params.account
                    let exchange = params.exchange
                    let sumAmount = await AssetDB.getTotalAmount(project, currency)
                    let exchangeAccountBalance = await ExchangeUtil.getBalance(currency)
                
                    break;
            }
        })

        

        // if (!GatewayList[req.params.project]) {
        //     let result = await ProjectDB.findOne({project: req.params.project})
        // }
        // if (!GatewayList[req.params.project]) {
        //     GatewayList[req.params.project] = new Gateway(req.params.project)
        //     await GatewayList[req.params.project].init()
        // }
        // var gateway = GatewayList[req.params.project]
        // if (!gateway.exchange) throw new Error("Exchange name incorrect")
        // let params = (req.method == "POST") ? req.body : req.query
        // res.end(await gateway.action((req.params.action || params.action), params))

    } catch(err){
        console.error(err)
        res.status(500).send(err.message);
    }
}

