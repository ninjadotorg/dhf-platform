const Web3 = require('web3')
const rpc_server = "http://35.240.197.175:16000"
var provider = new Web3.providers.HttpProvider(rpc_server)
var web3 = new Web3(new Web3.providers.HttpProvider(rpc_server))

exports = module.exports = {
    eth_getTransactionCount: async function(address, block){
        let result = await web3.eth.getTransactionCount(address, block)
        return result

    },
    eth_sendRawTransaction: async function(signedTx){
        try {
            let result = await web3.eth.sendSignedTransaction('0x' + signedTx)
            return result
        } catch(err){
            console.log(err)
        }
    }
}

// exports.eth_getTransactionCount("0xc0187bad0ecf6576e11c789f57eff23ccc69d766", "latest")