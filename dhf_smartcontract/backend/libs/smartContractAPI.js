
const SmartContractDB = require("../models/smartcontract_version")
const EthereumTx = require('ethereumjs-tx');
const rpcMethod = require("./rpcMethod");
const Web3 = require('web3');
const web3 = new Web3();

const request = require("request")

var fromAccount = {
    address: "0x38da05d0ca5a2defb87003b6b7b09dcd2676a0e8",
    privateKey: "2917a7d1a7223c94db8045654cf04a63529acf3e2ffeda4f5427bb1e66cbbc3e"
}
var smartcontract = {}

class SmartContract {
    constructor(contractAddress, version, abi){
        this.contractAddress = contractAddress;
        this.contract = null
        this.version = version
        this.contract = new web3.eth.Contract(abi, this.contractAddress);
    }

    async getRawTx(funcName, params, account){
        const nonce = await rpcMethod.eth_getTransactionCount(account.address, "latest")
        
        if (nonce == undefined){
            console.log("Cannot get nonce", nonce)
            return
        }
        console.log(funcName, ...params)
        const functionInstance = this.contract.methods[funcName](...params);
        const functionInstanceAbi = functionInstance.encodeABI();
        const txParams = {
            gasPrice: '0x165A0BC00',
            gasLimit: 3000000,
            to: this.contract._address,
            data: functionInstanceAbi,
            from: account.address,
            nonce:  nonce,
            // chainId: 4
        };
        // console.log(txParams)
        const tx = new EthereumTx(txParams);
        tx.sign(Buffer.from(account.privateKey, 'hex'));
        const serializedTx = tx.serialize();
        
        var hexStr = ""
        for (let i = 0; i < serializedTx.length; i++){
            hexStr += serializedTx[i].toString(16).padStart(2,'0');
        }

        return hexStr
    }

    async release(exchange, amount, pid, stage){
        let hexStr = await this.getRawTx("release", ['0x'+pid, exchange, web3.utils.toWei(amount+'', 'ether'), '0x'+stage], fromAccount)
        let sendTx = await rpcMethod.eth_sendRawTransaction(hexStr)
        return sendTx
    }

    async retract(pid,scale, denominator){
        let hexStr = await this.getRawTx("retract", [pid, scale, denominator], fromAccount)
        let sendTx = await rpcMethod.eth_sendRawTransaction(hexStr)
        return sendTx
    }

    async stop(pid){
        let hexStr = await this.getRawTx("stopProject", [pid], fromAccount)
        let sendTx = await rpcMethod.eth_sendRawTransaction(hexStr)
        return sendTx
    }

    async validateState(pid){
        let hexStr = await this.getRawTx("validateState", [pid], fromAccount)
        let sendTx = await rpcMethod.eth_sendRawTransaction(hexStr)
        return sendTx
    }

    async shouldValidateState(pid){
        let hexStr = await this.getRawTx("shouldValidateState", [pid], fromAccount)
        let sendTx = await rpcMethod.eth_call(hexStr)
        return sendTx
    }

}

!async function(){
    setInterval(async function(){
        let version = await SmartContractDB.getVersionList()
        for (var i in version){
            smartcontract[version[i].version] = new SmartContract(version[i].address, version[i].version, version[i].abi)
        }
    },5000)
}()

exports = module.exports = smartcontract