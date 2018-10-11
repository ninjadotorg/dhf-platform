const HedgeFundAPI = require("../common/libs/HedgeFundAPI")
const Web3js = require("web3")

async function start(){
    var client  = new HedgeFundAPI("latest", false)
    console.log(HedgeFundAPI.NETWORK_TYPE)
    try {
        let r = await client.getProjectInfo("0x0041004200430044004500460047")
        console.log(r)
    } catch(err){
        console.log(err)
    } finally{

    }
}

start()