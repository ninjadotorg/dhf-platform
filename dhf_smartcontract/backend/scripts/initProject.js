require("../config")
const HedgeFundAPI = require("../common/libs/HedgeFundAPI")
const Web3js = require("web3")

async function start(){


    
    var client  = new HedgeFundAPI("v2", false)
    await client._init()
    var web3js = new Web3js()
    let target = web3js.utils.toWei("1" ,"ether")
    let max = web3js.utils.toWei("10" ,"ether")

    

    let tx = await client.initProject(__Config.PrivateKey, target, max, Math.floor((new Date()-0)/1000)+24*60*60, 10, 5, "ABCDEFG" )
    try {
        await tx.estimateGas()
        tx.run()
        .on('transactionHash', function(hash){
            console.log("tx hash:" , hash)
        })
        .on('receipt', function(receipt){
            console.log("receipt:" , receipt)
        })
    } catch(err){
        console.log(err)
    } finally{

    }
}

start()