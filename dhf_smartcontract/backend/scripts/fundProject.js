require("../config")
const HedgeFundAPI = require("../common/libs/HedgeFundAPI")
const Web3js = require("web3")

async function start(){
    var client  = new HedgeFundAPI("latest", false)
    let r = await client.getProjectInfo("0x5bc5645722c175002005d5d3")
    console.log(r)
    let tx = await client.fundProject(__Config.PrivateKey, 0.001, "0x5bc5645722c175002005d5d3")
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
    }

}

start()