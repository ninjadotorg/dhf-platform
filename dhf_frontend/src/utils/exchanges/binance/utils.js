var BinanceAPI = require('binance-api-node').default
// balance
// ticker price -> pair pair
// open order
// 24h trade history
// orderbook

class Binance {
  constructor (
    key = 'MXCeKzgZScAKo6DglG0aZz5PECnVAjXoh3ilqOh0xBnhxC199rg09aBR7Kaj6baQ',
    secret = 'Vp0AyrlOXc4GDLRm9TbpABeKE5JDGFj3cpfz7qqBQjE9Tjb7rYj5ako72yEVrs1m',
    project = '5b9221bb129e900086c9d406',
    baseUrl = 'http://35.198.235.226:9000/api',
    token = '6qWEVFxhkKWEk5hbvnkpTQ6uRbWgJTZktq1lGlcU59bAAjG5V8PoFJ8CFYFcVHlp'
  ) {
    this.key = key
    this.secret = secret
    this.baseUrl = baseUrl
    this.project = project
    this.token = token
    this.client = BinanceAPI({
      apiKey: key,
      apiSecret: secret
    })

    // public data
    this.exchangeInfo = {}
    this.balance = {}
    this.tickerPrice = {}
    this.openOrders = {}

    this.orderBook = { ask: [], bid: [] }

    this.supportedSymbols = ['BTC', 'ETH', 'USDT', 'BNB']

    this.init()
  }

  async getData (url) {
    const resp = await fetch(this.baseUrl + url)
    return resp.json()
  }

  async init () {
    const result = await Promise.all([
      this.getData(
        `/infos/exchange-info?projectId=${this.project}&access_token=${
          this.token
        }`
      ),
      this.getData(
        `/infos/balance?projectId=${this.project}&access_token=${this.token}`
      )
    ])
    this.exchangeInfo = result[0]
    this.balance = result[1]

    this.updateTicker()
    this.getOpenOrders()
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

      this.tickerPrice = result
    }
  }

  async getOpenOrders () {
    const listenKey = await this.client.getDataStream()
    const fn = this.client.ws.userWithListenKey(listenKey.listenKey)
    const clean = await fn(msg => {
      console.log(msg)
    })
  }
}

export default Binance
