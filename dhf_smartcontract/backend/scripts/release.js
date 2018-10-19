require("../config")
const HedgeFundAPI = require("../common/libs/HedgeFundAPI")

async function start(){
    var client  = new HedgeFundAPI("latest", false)

    let r = await client.getProjectInfo("0x5bc70639c6182f0055044877")
    console.log(r)

    let project = "0x5bc70639c6182f0055044877";
    let depositAddress = "0xB3537000b1b2ba2A899F235E507569E912724618";
    let amount = 1;
    let stage = "0x01";

    let tx = await client.release(__Config.PrivateKey,
        project,
        depositAddress,
        amount,
        stage)
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