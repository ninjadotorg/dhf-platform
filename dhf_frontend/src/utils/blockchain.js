const EthereumTx = require('ethereumjs-tx');
const Web3 = require('web3');
const web3 = new Web3();

var Blockchain = {
    getContractInstance: async function (name, contractAddress) {
        return new Promise(function (resolve) {
            var oReq = new XMLHttpRequest();
            oReq.onload = function reqListener() {
                const tokenContract = new web3.eth.Contract(JSON.parse(this.responseText), contractAddress);
                resolve(tokenContract)
            };
            oReq.onerror = function reqError(err) {
                resolve("")
            };
            oReq.open('get', `http://35.240.197.175/contract/${name}.${contractAddress}.json`, true);
            oReq.send();
        })
    },
    getNonce: async function(account){
        return 345
    },
    callFunction: async function(contract, funcName, params, account){
        const functionInstance = contract.methods[funcName](...params);
        const functionInstanceAbi = functionInstance.encodeABI();
        const nonce = await this.getNonce(account.address)
        const txParams = {
            gasPrice: '0x09184e72a000',
            gasLimit: 3000000,
            to: contract._address,
            data: functionInstanceAbi,
            from: account.address,
            nonce: '0x' + nonce,
            chainId: 4
        };
        const tx = new EthereumTx(txParams);
        tx.sign( Buffer.from(account.privateKey, 'hex'));
        const serializedTx = tx.serialize();
        
    }
}
export default Blockchain
