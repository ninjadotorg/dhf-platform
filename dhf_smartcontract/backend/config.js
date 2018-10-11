var fs = require("fs")
var Config = {
    ContractInfo: 'https://storage.googleapis.com/dhf/hedgefund_v2.json',
    eth: {
        network: "wss://rinkeby.infura.io/ws"
    },
    SmartContractDB: "mongodb://35.198.235.226:27018/SmartContractDB",
    ProjectDB: "mongodb://35.198.235.226:27018/dhf-platform"
}



let env = require("./.env.js")
Config = {...Config, ...env}

Object.defineProperty(global, '__Config', {
	get: function() {
        return Config;
    }
});


exports = module.exports = Config
