const Web3js = require('web3')

class NetworkAPI {
    constructor(network){
        if (network) this.network = network
    }

    async checkTransactionStatus(txid){
        let network = this.network || "https://mainnet.infura.io/"
        var web3js = new Web3js(new Web3js.providers.HttpProvider(network))
        let trans = await web3js.eth.getTransaction(txid);
        return (trans && trans.blockNumber)
    }

    async getGasPrice(){
        let network = this.network || "https://mainnet.infura.io/"
        var web3js = new Web3js(new Web3js.providers.HttpProvider(network))
        return await web3js.eth.getGasPrice()
    }
}

module.exports = NetworkAPI