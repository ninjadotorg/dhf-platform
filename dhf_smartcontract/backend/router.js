let smartContractAPI = require("./logics/smartContractAPI")

exports = module.exports = function (app, router) {
    app.use("/", router)
    router.options('*', function (req, res) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
        res.end()
    });

    router.post("/smartcontract/:version/release", smartContractAPI.release);
    router.post("/smartcontract/:version/retract", smartContractAPI.retract);
    router.post("/smartcontract/:version/stop", smartContractAPI.stop);

    // POST "/smartcontract/v1/release" {depositAddress: string, amount: string, project: string}

    router.all('*', function (req, res) {
        console.error("Not found: %s %s", req.method, req.url)
        res.status("404").end();
    });
}
