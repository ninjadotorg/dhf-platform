require("../config")
const HedgeFundAPI = require("../common/libs/HedgeFundAPI")
const Web3js = require("web3")

async function start(){


    
    var client  = new HedgeFundAPI("v2", false)
    await client._init()
    var web3js = new Web3js()
    let target = 1
    let max = 10

    

    let tx = await client.initProject(__Config.PrivateKey, target, max, Math.floor((new Date()-0)/1000)+24*60*60, 10, 5, "123" )
    try {
        await tx.estimateGas()
        tx.run()
        .on('transactionHash', function(hash){
            console.log("tx hash:" , hash)
        })
        .on('receipt', async function(receipt){
            console.log("receipt:" , receipt)
            let r = await client.getProjectInfo("123")
            console.log(r)
        })
    } catch(err){
        console.log(err)
    } finally{

    }
}

start()