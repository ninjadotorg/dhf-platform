var fs = require("fs")
var Config = {
    ContractInfo: 'http://35.198.235.226/json/hedgefund_[version].json',
    SmartContractDB: "mongodb://35.198.235.226:27018/SmartContractDB",
    PlatformDB: "mongodb://35.198.235.226:27018/dhf-platform",
    Versions: ["v1"]
}



let env = require("./.env.js")
Config = {...Config, ...env}

Object.defineProperty(global, '__Config', {
	get: function() {
        return Config;
    }
});


exports = module.exports = Config
