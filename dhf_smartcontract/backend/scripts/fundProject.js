require("../config")
const HedgeFundAPI = require("../common/libs/HedgeFundAPI")
const Web3js = require("web3")

async function start(){
    var client  = new HedgeFundAPI("latest", false)
    let r = await client.getProjectInfo("0x5bc71984c6182f0055044878")
    console.log(r)
    let tx = await client.fundProject(__Config.PrivateKey, 0.001, "0x5bc71984c6182f0055044878")
    try {
        await tx.estimateGas()
        tx.run()
        .on('transactionHash', function(hash){
            console.log("tx hash:" , hash)
        })
        .on('receipt', async function(receipt){
            console.log("receipt:" , receipt)
            let r = await client.getFundAmount("0x5bc71984c6182f0055044878", 0xe1F42CA59Bb2809cecCDD6f747B08ea757aDa3DA)
            console.log(r)
        })
    } catch(err){
        console.log(err)
    }
}
start()