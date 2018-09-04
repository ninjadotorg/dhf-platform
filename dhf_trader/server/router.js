"use strict";
var ExchangeCommon = require("../common/lib/exchange")
var Gateway = require('./Exchanges/gateway');
var GatewayList = {}

var swaggerUi = require('swagger-ui-express'),
YAML = require('yamljs'),
swaggerDocument = YAML.load(__dirname + '/../configs/swagger.yaml')

exports = module.exports = function (app, router){
    
    app.use('/exchange/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.use("/exchange", router);
    router.get("/:exchange/accounts", getExchageAccounts);
    router.all("/:exchange/:account/:action", forwardAction);
    
    router.all('*', function(req, res) {
		console.error("Not found: %s %s",req.method,req.url)
  		res.status("404").end();
	});
}

async function forwardAction(req, res){
    try {
        if (!GatewayList[req.params.exchange + " " + req.params.account]) {
            GatewayList[req.params.exchange + " " + req.params.account] = new Gateway(req.params.exchange,req.params.account)
            await GatewayList[req.params.exchange + " " + req.params.account].init()
        }
        var gateway = GatewayList[req.params.exchange + " " + req.params.account]

        if (!gateway.exchange) throw new Error("Exchange name incorrect")

        res.end(await gateway.action(req.params.action, req.method == "POST" ? req.body : req.query))
    } catch(err){
        console.error(err)
        res.status(500).send(err.message);
    }
}

async function getExchageAccounts(req, res){
    let result = await ExchangeCommon.getExchangeAccounts(req.params.exchange)
    res.end(JSON.stringify(result))
}