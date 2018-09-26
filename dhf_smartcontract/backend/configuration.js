var Config = {
    SmartContractDB: "mongodb://dhf-mongodb:27018/SmartContractDB",
    ProjectDB: "mongodb://dhf-mongodb:27018/dhf-platform",
}

Object.defineProperty(global, '__Config', {
	get: function() {
        return Config;
    }
});


exports = module.exports = Config
