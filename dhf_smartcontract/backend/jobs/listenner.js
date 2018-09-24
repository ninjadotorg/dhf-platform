require("../configuration")
const ProjectDB = require("../models/pseudo_project")
const TruffleContract = require('truffle-contract')
const Web3 = require('web3')
const rpc_server = "http://35.240.197.175:16000"
const fs = require("fs")

async function start(){
    try {
        
        const contractData = JSON.parse(fs.readFileSync(__dirname + `../../build/contracts/HedgeFund.json`).toString())
        // console.log(contractData)
        var provider = new Web3.providers.HttpProvider(rpc_server)
        // var web3 = new Web3(new Web3.providers.HttpProvider(rpc_server))
        // const accounts = web3.eth.accounts

        var Contract = TruffleContract(contractData)
        Contract.setProvider(provider);
        var instance = await Contract.deployed();
        
        instance.allEvents({fromBlock:0}, function(err, event){
            console.log(event)
        })

    } catch(err){
        console.log(err)
    }
}

start()
