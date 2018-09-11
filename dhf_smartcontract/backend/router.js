let ethrpc = require("./rpcMethod")
exports = module.exports = function (app, router) {
    app.use("/", router)
    router.options('*', function (req, res) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
        res.end()
    });

    router.post("/eth/jsonrpc/:method", ethrpcHandler);
    router.post("/api/deposit", depositHandler);

    router.all('*', function (req, res) {
        console.error("Not found: %s %s", req.method, req.url)
        res.status("404").end();
    });
}

async function ethrpcHandler(req, res) {
    try {
        let params = req.body.params || []
        let method = req.params.method
        console.log(method, params)
        let result = await ethrpc[method](...params)
        res.header({ 'Access-Control-Allow-Origin': '*' })
        res.json({ result: result })
    } catch (err) {
        res.header({ 'Access-Control-Allow-Origin': '*' })
        res.json({ status: "fail" })
    }
}

async function depositHandler(req, res){
    try {   
        res.header({ 'Access-Control-Allow-Origin': '*' })
        res.json({ result: result })
    } catch(err){
        res.header({ 'Access-Control-Allow-Origin': '*' })
        res.json({ status: "fail" })
    }
}