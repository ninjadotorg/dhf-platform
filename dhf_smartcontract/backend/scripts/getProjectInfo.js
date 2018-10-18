const HedgeFundAPI = require("../common/libs/HedgeFundAPI")
const Web3js = require("web3")

async function start(){
    var client  = new HedgeFundAPI("latest", false)
    try {
        let r = await client.getProjectInfo("0x5bc5b61d4d3a0d0046c4421c")
        console.log(r)

        r = await client.getFunders("0x5bc5b61d4d3a0d0046c4421c")
        console.log(r)

        r = await client.getNumberOfFunder("0x5bc5b61d4d3a0d0046c4421c")
        console.log(r)
        
    } catch(err){
        console.log(err)
    } finally{

    }
}

start()