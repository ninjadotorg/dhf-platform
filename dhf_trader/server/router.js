"use strict";
var ExchangeUtil = require("../common/lib/exchange")

var Gateway = require('./Exchanges/gateway');
let ExchangeDB = require("../common/models/exchanges")
let AssetDB = require("../common/models/assets")

let Async = require("async");



var semaphores = {}
var swaggerUi = require('swagger-ui-express'),
YAML = require('yamljs'),
swaggerDocument = YAML.load(__dirname + '/../configs/swagger.yaml')

exports = module.exports = function (app, router){

    app.use('/trade/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.use("/", router)

    router.get("/trade/exchange/:exchange/listLockAccount", listLockAccount);
    router.get("/trade/exchange/:exchange/listAvailableAccount", listAvailableAccount);

    router.all("/trade/project/:project/getOrSetAccount", getOrSetAccount);
    router.all("/trade/project/:project/unLockAccount", unLockAccount);

    //trade
    router.all("/trade/project/:project/:action", action);

    router.all('*', function(req, res) {
		console.error("Not found: %s %s",req.method,req.url)
  		res.status("404").end();
	});
}

async function getOrSetAccount(req, res){
    let exchange = await ExchangeDB.getOrSetProjectAccount(req.params.project, req.query.exchange)
    if (exchange && req.query.depositAsset){
        var address = await ExchangeUtil.getDepositAddress(exchange.name, exchange.account, req.query.depositAsset)
        console.log(address)
        if (address.address) {
            exchange.despositAddress = address.address
        }
    }

    if (!exchange) {
        res.status(400)
        return res.json({status: 'fail', message: 'No available exchange'})
    }
    res.end(JSON.stringify(exchange))
}

async function unLockAccount(req, res){
    let result = await ExchangeDB.unlockProjectAccount(req.params.project)
    if (!result) {
        return res.status(400).json({status: 'fail'})
    }
    delete GatewayList[req.params.project]
    res.end(JSON.stringify(result))
}

async function listLockAccount(req, res){
    let result = await ExchangeDB.getLockAccounts(req.params.exchange)
    res.end(JSON.stringify(result))
}

async function listAvailableAccount(req, res){
    let result = await ExchangeDB.getAvailableAccounts(req.params.exchange)
    res.end(JSON.stringify(result))
}

var GatewayList = {}

async function action(req, res){
    try {
        let action = req.params.action
        let project = req.params.project
        let params = (req.method == "POST") ? req.body : req.query

        if (!GatewayList[req.params.project]) {
            GatewayList[req.params.project] = new Gateway(null, null, req.params.project)
            await GatewayList[req.params.project].init()
        }
        var gateway = GatewayList[req.params.project]
        if (!gateway.exchange) throw new Error("Exchange name incorrect")
        res.end(await gateway.action((req.params.action || params.action), params))

    } catch(err){
        console.error(err)
        res.status(500).send(err.message);
    }
}

