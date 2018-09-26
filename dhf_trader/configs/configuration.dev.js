var Config = {
    ExchangeDB: "mongodb://dhf-mongodb:27018/Exchange",
    TransactionDB: "mongodb://dhf-mongodb:27018/Transaction",
    OrderDB: "mongodb://dhf-mongodb:27018/Order",
    ProjectDB: "mongodb://dhf-mongodb:27018/Project",
    AssetDB: "mongodb://dhf-mongodb:27018/Asset",
}

Object.defineProperty(global, '__Config', {
	get: function() {
        return Config;
    }
});


exports = module.exports = Config
