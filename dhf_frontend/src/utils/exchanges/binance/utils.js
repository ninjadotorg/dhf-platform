//balance
//ticker price -> pair pair
//open order
//24h trade history
//orderbook

class Binance {
    constructor(key, secret, project='5b9221bb129e900086c9d406', baseUrl="http://35.240.197.175:9000/api", token='6qWEVFxhkKWEk5hbvnkpTQ6uRbWgJTZktq1lGlcU59bAAjG5V8PoFJ8CFYFcVHlp'){
        this.key = key;
        this.secret = secret;
        this.baseUrl = baseUrl;
        this.project = project;
        this.token = token
        //public data
        this.exchangeInfo = {}
        this.tickerPrice = {}
        this.orderBook = {ask: [], bid: []}
        
        this.init()
    }

    async getData(url){
        return await fetch(this.baseUrl + url)
    }
    
    async init(){
        this.updateTicker()
        let info = await this.getData("/infos/exchange-info?projectId="+this.project+"&access_token="+this.token);
    
        

    }

    async updateTicker() {
        
        let allTickerPrice = await this.getData("/infos/prices?projectId="+this.project+"&access_token="+this.token);
        let tmpResult = {}
        for (var symbol in allTickerPrice){
            if (symbol.endsWith("BTC")) {
                tmpResult['BTC'] = {
                    price: allTickerPrice[symbol]
                }
            }
            if (symbol.endsWith("ETH")) {
                
            }
            if (symbol.endsWith("USDT")) {
                
            }
            if (symbol.endsWith("BNB")) {
                
            }
        }

        var miniTickerSocket = new WebSocket("wss://stream.binance.com:9443/ws/!miniTicker@arr");
        miniTickerSocket.onmessage = function(event){
            let tickers = JSON.parse(event.data)
            for (var i in tickers){
                let ticker = tickers[i]
                if (ticker.s=="BTCUSDT")
                    console.log(ticker.s, ticker.c)



            
            }

            self.tickerPrice = tmpResult
        }
    }
    

}


export default Binance