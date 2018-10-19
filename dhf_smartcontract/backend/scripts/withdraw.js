require("../config")
const HedgeFundAPI = require("../common/libs/HedgeFundAPI")
const Web3js = require("web3")

async function start(){
    var client  = new HedgeFundAPI("latest", false)

    let r = await client.getProjectInfo("0x5bc70639c6182f0055044877")
    console.log(r)

    r = await client.getWithdrawAmount("0x5bc70639c6182f0055044877", "0xe1F42CA59Bb2809cecCDD6f747B08ea757aDa3DA")
    console.log(r)

    let tx = await client.withdrawFund("b388789b8ee810eca1d4a80fd2a0c875644aa61333dfe53c3c498c334f659dee", "0x5bc70639c6182f0055044877")
    try {
        await tx.estimateGas()
        tx.run()
        .on('transactionHash', function(hash){
            console.log("tx hash:" , hash)
        })
        .on('receipt', async function(receipt){
            console.log("receipt:" , receipt)
            let r = await client.getProjectInfo("0x5bc70639c6182f0055044877")
            console.log(r)
        })
    } catch(err){
        console.log(err)
    }

}

start()