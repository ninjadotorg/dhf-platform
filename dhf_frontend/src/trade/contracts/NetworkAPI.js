import Web3js from 'web3'

export default class NetworkAPI {
    constructor(network){
        this.network = network
        this.checkTransactionStatus("0x0b0f4fe34e2b0ef11f778b258ed051bfc5b2c96bcbb1b900d0f0bff2a053ab3f")
    }

    async checkTransactionStatus(txid){
        var web3js = new Web3js(new Web3js.providers.HttpProvider(this.network))
        let trans = await web3js.eth.getTransaction(txid);
        console.log("trans.blockNumber", trans.blockNumber)
        return (trans && trans.blockNumber)
    }
}