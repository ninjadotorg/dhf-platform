let ethrpc = require("./libs/rpcMethod")
let smartContractAPI = require("./libs/smartContractAPI")
let SmartcontractDB = require("./models/smartcontract_version")

exports = module.exports = function (app, router) {
    app.use("/", router)
    router.options('*', function (req, res) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
        res.end()
    });

    router.post("/eth/jsonrpc/:method", ethrpcHandler);

    router.get("/smartcontract/listVersion", getVersionList); //not require param
    router.get("/smartcontract/currentVersion", getCurrentVersion); //not require param
    router.get("/smartcontract/:version/info", getVersionInfo); //not require param

    router.post("/smartcontract/:version/release", releaseHandler);
    router.post("/smartcontract/:version/retract", retractHandler);
    router.post("/smartcontract/:version/stop", stopHandler);

    // POST "/smartcontract/v1/release" {depositAddress: string, amount: string, project: string}

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
    let depositAddress = req.body.depositAddress
    let amount = req.body.amount
    let project = req.body.project
    if (!smartContractAPI[version]) {
        console.log("Cannot find version " + version)
        return null
    }
    let result = smartContractAPI[version].release(depositAddress, amount, project)
    if (!result) {
        res.json({status: "fail", message: "Cannot call smartcontract"})
    } else {
        res.json({tx: result})
    }
}

async function retractHandler(req, res){
    let version = req.params.version
    let project = req.params.project
    let scale = req.params.scale
    let denominator = req.params.denominator
    if (!smartContractAPI[version]) {
        console.log("Cannot find version " + version)
        return null
    }
    let result = smartContractAPI[version].retract(project, scale, denominator)
    if (!result) {
        res.json({status: "fail", message: "Cannot call smartcontract"})
    } else {
        res.json({tx: result})
    }
}

async function stopHandler(req, res){
    let version = req.params.version
    let project = req.params.project
    if (!smartContractAPI[version]) {
        console.log("Cannot find version " + version)
        return null
    }
    let result = smartContractAPI[version].stop(project)
    if (!result) {
        res.json({status: "fail", message: "Cannot call smartcontract"})
    } else {
        res.json({tx: result})
    }
}

async function getVersionList(req, res){
    let versions = await SmartcontractDB.getVersionList()
    for (var i in versions) {
        delete versions[i]._id
        delete versions[i].abi
    }
    res.json(versions)
}

async function getVersionInfo(req, res){
    let version = await SmartcontractDB.getVersion(req.params.version)
    delete version._id
    res.json(version)
}

async function getCurrentVersion(req, res){
    let version = await SmartcontractDB.getCurrentVersion()
    res.json(version)
}