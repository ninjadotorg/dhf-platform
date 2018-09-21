// balance
// ticker price -> pair pair
// open order
// 24h trade history
// orderbook

class Binance {
  constructor (
    key,
    secret,
    project = '5b9221bb129e900086c9d406',
    baseUrl = 'http://35.240.197.175:9000/api',
    token = '6qWEVFxhkKWEk5hbvnkpTQ6uRbWgJTZktq1lGlcU59bAAjG5V8PoFJ8CFYFcVHlp'
  ) {
    this.key = key
    this.secret = secret
    this.baseUrl = baseUrl
    this.project = project
    this.token = token
    // public data
    this.exchangeInfo = {}
    this.tickerPrice = {}
    this.orderBook = { ask: [], bid: [] }

    this.supportedSymbols = ['BTC', 'ETH', 'USDT', 'BNB']

    this.init()
  }

  async getData (url) {
    const resp = await fetch(this.baseUrl + url)
    return resp.json()
  }

  async init () {
    this.exchangeInfo = await this.getData(
      '/infos/exchange-info?projectId=' +
        this.project +
        '&access_token=' +
        this.token
    )
    this.updateTicker()
  }

  getSymbolInfo (symbols, symbol) {
    for (let i = 0; i < symbols.length; i++) {
      if (symbols[i].symbol === symbol) {
        return symbols[i]
      }
    }
    return null
  }

  async updateTicker () {
    let allTickerPrice = await this.getData(
      '/infos/prices?projectId=' + this.project + '&access_token=' + this.token
    )

    const result = {}
    this.supportedSymbols.forEach(s => (result[s] = []))

    for (var symbol in allTickerPrice) {
      const info = this.getSymbolInfo(this.exchangeInfo.symbols, symbol)
      if (!info) {
        continue
      }
      info.price = allTickerPrice[symbol]

      for (let i = 0; i < this.supportedSymbols.length; i++) {
        if (symbol.endsWith(this.supportedSymbols[i])) {
          result[this.supportedSymbols[i]].push(info)
          break
        }
      }
    }

    const self = this
    const miniTickerSocket = new WebSocket(
      'wss://stream.binance.com:9443/ws/!miniTicker@arr'
    )

    miniTickerSocket.onmessage = function (event) {
      const tickers = JSON.parse(event.data)

      const findSymbol = function (symbols, symbol) {
        for (let s in symbols) {
          if (symbol.endsWith(s)) {
            return self.getSymbolInfo(symbols[s], symbol)
          }
        }
        return null
      }

      tickers.forEach(t => {
        const symbol = t.s
        const info = findSymbol(result, symbol)
        if (info) {
          info.price = t.c
        }
      })

      console.log(result)
      this.tickerPrice = result
    }
  }
}

export default Binance
