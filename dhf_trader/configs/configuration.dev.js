var Config = {
    ExchangeDB: "mongodb://35.240.197.175:27018/Exchange",
    TransactionDB: "mongodb://35.240.197.175:27018/Transaction",
    OrderDB: "mongodb://35.240.197.175:27018/Order",
    ProjectDB: "mongodb://35.240.197.175:27018/Project",
    AssetDB: "mongodb://35.240.197.175:27018/Asset",
}

Object.defineProperty(global, '__Config', {
	get: function() {
        return Config;
    }
});


exports = module.exports = Config
