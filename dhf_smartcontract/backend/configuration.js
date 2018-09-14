var Config = {
    SmartContractDB: "mongodb://35.240.197.175:27018/SmartContractDB",
}

Object.defineProperty(global, '__Config', {
	get: function() {
        return Config;
    }
});


exports = module.exports = Config
