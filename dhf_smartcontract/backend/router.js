let ethrpc = require("./rpcMethod")
let smartContractAPI = require("./smartContractAPI")

exports = module.exports = function (app, router) {
    app.use("/", router)
    router.options('*', function (req, res) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
        res.end()
    });

    router.post("/eth/jsonrpc/:method", ethrpcHandler);

    router.get("/smartcontract/getVerison", getVersion);

    router.post("/smartcontract/:version/release", releaseHandler);

    // POST "/smartcontract/release" {depositAddress: string, amount: string, project: string}
    router.all('*', function (req, res) {
        console.error("Not found: %s %s", req.method, req.url)
        res.status("404").end();
    });
}

async function ethrpcHandler(req, res) {
    try {
        let params = req.body.params || []
        let method = req.params.method
        let result = await ethrpc[method](...params)
        res.header({ 'Access-Control-Allow-Origin': '*' })
        res.json({ result: result })
    } catch (err) {
        res.header({ 'Access-Control-Allow-Origin': '*' })
        res.json({ status: "fail" })
    }
}

async function releaseHandler(req, res){
    let version = req.params.version
    console.log(req.body)

    let depositAddress = req.body.depositAddress
    let amount = req.body.amount
    let project = req.body.project

    if (!smartContractAPI[version]) {
        console.log("Cannot find version " + version)
        return null
    }

    if (typeof depositAddress == "undefined" || typeof amount == "undefined" || typeof project == "undefined"){
        console.log("Param not valid")
        return null
    }

    let result = smartContractAPI[version].release(depositAddress, amount, project)
    if (!result) {
        res.json({status: "fail", message: "Cannot call smartcontract"})
    } else {
        res.json({tx: result})
    }
}

async function getVersion(req, res){
    let version = require("./version");
    for (var key in version) {
        if (version[key].abi)
            delete version[key].abi
    }
    res.json(version)
}
