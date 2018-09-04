var Config = {
    exchangeDB: "mongodb://localhost:27017/Exchange",
    
}

Object.defineProperty(global, '__Config', {
	get: function() {
        return Config;
    }
});


exports = module.exports = Config