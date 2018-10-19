require("../config")
const HedgeFundAPI = require("../common/libs/HedgeFundAPI")

async function start(){
    var client  = new HedgeFundAPI("latest", false)

    let r = await client.getProjectInfo("0x5bc70639c6182f0055044877")
    console.log(r)

    let amount = 0.99;
    let tx = await client.stopProject(__Config.PrivateKey, "0x5bc70639c6182f0055044877")
    try {
        await tx.estimateGas()
        tx.run()
        .on('transactionHash', function(hash){
            console.log("tx hash:" , hash)
        })
        .on('receipt', async function(receipt){
            console.log("receipt:" , receipt)
        })
    } catch(err){
        console.log(err)
    }
}

start()