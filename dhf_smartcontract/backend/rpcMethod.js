const Web3 = require('web3')
rpc_server = "http://35.240.197.175:16000"
var provider = new Web3.providers.HttpProvider(rpc_server)
var web3 = new Web3(new Web3.providers.HttpProvider(rpc_server))

exports = module.exports = {
    eth_getTransactionCount: async function(address, block){
        console.log("eth_getTransactionCount", address, block)
        let result = await web3.eth.getTransactionCount(address, block)
        console.log(result)

    },
    eth_sendRawTransaction: function(...params){
        console.log("eth_sendRawTransaction", params)
    }
}

// exports.eth_getTransactionCount("0xc0187bad0ecf6576e11c789f57eff23ccc69d766", "latest")