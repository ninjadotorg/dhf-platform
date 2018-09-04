var Config = {
    exchangeDB: "mongodb://35.240.197.175:27018/Exchange",
    transactionDB: "mongodb://35.240.197.175:27018/Transaction",
}

Object.defineProperty(global, '__Config', {
	get: function() {
        return Config;
    }
});


exports = module.exports = Config