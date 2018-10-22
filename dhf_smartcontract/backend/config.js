var fs = require("fs")
var Config = {
    ContractInfo: 'http://35.198.235.226/json/hedgefund_latest.json',
    eth: {
        network: "wss://rinkeby.infura.io/ws"
    },
    SmartContractDB: "mongodb://35.198.235.226:27018/SmartContractDB",
    PlatformDB: "mongodb://35.198.235.226:27018/dhf-platform"
}



let env = require("./.env.js")
Config = {...Config, ...env}

Object.defineProperty(global, '__Config', {
	get: function() {
        return Config;
    }
});


exports = module.exports = Config
