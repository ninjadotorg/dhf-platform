import EthereumTx from 'ethereumjs-tx';
import ethRpcClient from "./ethereum-rpc";
import Web3 from 'web3';
const web3 = new Web3();

//TODO: get eth price estimation
class SmartContract {
    constructor(name, contractAddress){
        this.name = name;
        this.contractAddress = contractAddress;
        this.contract = null
    }

    async load(){
        var self = this
        return new Promise(function (resolve) {
            var oReq = new XMLHttpRequest();
            oReq.onload = function reqListener() {
                self.contract = new web3.eth.Contract(JSON.parse(this.responseText), self.contractAddress);
                resolve()
            };
            oReq.onerror = function reqError(err) {
                resolve("")
            };
            oReq.open('get', `http://35.240.197.175/contract/${self.name}.${self.contractAddress}.json`, true);
            oReq.send();
        })
    }

    async getRawTx(funcName, params, account){
        const nonce = await ethRpcClient.host.eth_getTransactionCount(account.address, "latest")
        
        if (!nonce || nonce.result == undefined){
            console.log("Cannot get nonce", nonce)
            return
        }

        const functionInstance = this.contract.methods[funcName](...params);
        const functionInstanceAbi = functionInstance.encodeABI();
        const txParams = {
            gasPrice: '0x165A0BC00',
            gasLimit: 3000000,
            to: this.contract._address,
            data: functionInstanceAbi,
            from: account.address,
            nonce: '0x' + nonce.result,
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

    async initProject(fromAccount, max, deadline, lifetime, owner, pid){
        let hexStr = await this.getRawTx("initProject", [max, deadline, lifetime, owner, pid], fromAccount)
        let sendTx = await ethRpcClient.host.eth_sendRawTransaction(hexStr)
        console.log(sendTx)
    }

    async fundProject(){
        let result = await this.getRawTx("fundProject", [pid], fromAccount)
        console.log(result)
    }

    //add more function here

}

export default SmartContract;