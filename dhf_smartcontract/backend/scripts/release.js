require("../config")
const HedgeFundAPI = require("../common/libs/HedgeFundAPI")

async function start(){
    var client  = new HedgeFundAPI("latest", false)

    let r = await client.getProjectInfo("0x5bc83bd747cefc0064cf9eab")
    console.log(r)

    let project = "0x5bc83bd747cefc0064cf9eab";
    let depositAddress = "0x77470AC27Bdff497e0116067b0b00214c16592E4";
    let amount = 0.11;
    let stage = "0x5bc97a030c5bbd00b4688483";

    try {
    let tx = await client.release(__Config.PrivateKey,
        project,
        depositAddress,
        amount,
        stage)
    
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