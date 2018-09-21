const HedgeFund = artifacts.require("HedgeFund")
const Utils = require("./utils")



contract("HedgeFund", (accounts) => {
    const root = accounts[0];
    const trader = accounts[1];
    const investor1 = accounts[2];
    const investor2 = accounts[3];
    const exchangeAddress = accounts[5]

    let hf = null

    let PID1 =  "project_" + new Date().getTime()

    console.log("trader: ", trader)
    console.log("investor1: ", investor1)
    console.log("investor2: ", investor2)
    console.log("PID1: ", PID1)
    

    async function getProjectInfo(pid){
        let r = await hf.getProjectInfo(pid);
        var owner = r[0].toString()
        var target = web3.fromWei(r[1].toString(), "ether")
        var max = web3.fromWei(r[2].toString(), "ether")
        var fundingAmount = web3.fromWei(r[3].toString(), "ether")
        var updatedAmmount = web3.fromWei(r[4].toString(), "ether")
        var releasedAmount = web3.fromWei(r[5].toString(), "ether")
        var startTime = r[6].toString()
        var deadline = r[7].toString()
        var lifeTime = r[8].toString()
        var state = r[9].toString()
        console.log({owner, target, max, fundingAmount, updatedAmmount, releasedAmount, startTime, deadline, lifeTime, state})
    }

    async function getFunder(pid){
        let _a = await hf.getFunders(PID1);
        let _t = {}
        for (var i in _a){
            if (!_t[_a[i]]) {
                _t[_a[i]] = 1;
                let f = web3.fromWei((await hf.getFundAmount(PID1, _a[i])).toString(), "ether")
                let w = web3.fromWei((await hf.getWithdrawAmount(PID1, _a[i])).toString(), "ether")
                console.log(_a[i], f, w)
            }

        }
    }
    before(async ()=>{
        hf = await HedgeFund.deployed()
        // console.log(Utils.b2s("0x70726f6a6563745f313533373236373037343938350000000000000000000000,"))
    })

    describe("Basic scenario 1", () => {
        it("should allow them to init fund by them self", async ()=>{
            let target = web3.toWei(0.5);
            let max = web3.toWei(1);
            let deadline = Math.floor(new Date().getTime()/1000) + 60*60;
            let lifeTime = 3;
            let owner = trader;
            let tx1 = await hf.initProject(target, max, deadline, lifeTime, PID1, {from: owner});
            assert.equal(PID1, Utils.b2s(Utils.oc(tx1, "__init", "pid")))
            assert.equal("INITFUND", Utils.b2s(Utils.oc(tx1, "__changeState", "to")))
        })

        it("should allow investor to invest fund to an exist project (within deadline)", async () => {
            let tx1 = await hf.fundProject(PID1, {from: investor1, value: web3.toWei(0.01)});
            assert.equal(web3.toWei(0.01), Utils.oc(tx1, "__funding", "amount"))
            assert.equal(investor1,  Utils.oc(tx1, "__funding", "funder"))
            let tx2 = await hf.fundProject(PID1, {from: investor2, value: web3.toWei(0.01)});
        })  

        it("should allow investor to withdraw fund if project is in INIT state", async () => {
            let tx1 = await hf.withdrawFund(PID1, {from: investor1});
            assert.equal(web3.toWei(0.01), Utils.oc(tx1, "__withdraw", "withdrawAmount"))
        })  

        //should not release if reach limit
        it("should NOT release if project is in INIT state", async () => {
            await Utils.assertRevert(hf.release(PID1, exchangeAddress, web3.toWei(0.01), 0, {from: root}))
        }) 


        //invest reach target
        it("should change to READY state if fund reach target", async () => {
            let tx1 = await hf.fundProject(PID1, {from: investor1, value: web3.toWei(0.5)});
            assert.equal("READY", Utils.b2s(Utils.oc(tx1, "__changeState", "to")))
            let tx2 = await hf.fundProject(PID1, {from: investor2, value: web3.toWei(0.02)});
            assert.equal(web3.toWei(0.02), Utils.oc(tx2, "__funding", "amount"))
        })  

        it("should NOT allow investor to withdraw fund if project is in READY state", async () => {
            await Utils.assertRevert(hf.withdrawFund(PID1, {from: investor1}))
        }) 

        //invest reach max
        it("should NOT allow investor to fund or withdraw fund if project reach max", async () => {
            let tx1 = await hf.fundProject(PID1, {from: investor1, value: web3.toWei(0.5)});
            
            await Utils.assertRevert(hf.fundProject(PID1, {from: investor1, value: web3.toWei(0.01)}))
            await Utils.assertRevert(hf.withdrawFund(PID1, {from: investor1}))
        }) 

        //release money
        it("should release if project is in READY state", async () => {
            var preBalance = await web3.eth.getBalance(exchangeAddress);
            let tx1 = await hf.release(PID1, exchangeAddress, web3.toWei(0.01), 1, {from: root})
            assert.equal("RELEASE", Utils.b2s(Utils.oc(tx1, "__changeState", "to")))
            var postBalance = await web3.eth.getBalance(exchangeAddress);
            assert.equal(preBalance.plus(web3.toWei(0.01)).toString() , postBalance.toString())

            preBalance = await web3.eth.getBalance(exchangeAddress);
            tx1 = await hf.release(PID1, exchangeAddress, web3.toWei(0.01), 2, {from: root})
            assert.equal("RELEASE", Utils.b2s(Utils.oc(tx1, "__changeState", "to")))
            postBalance = await web3.eth.getBalance(exchangeAddress);
            assert.equal(preBalance.plus(web3.toWei(0.01)).toString() , postBalance.toString())

        }) 

        it("should NOT release if same release period param", async () => {
            await Utils.assertRevert(hf.release(PID1, exchangeAddress, web3.toWei(0.01), 1, {from: root}))
        }) 

        it("should NOT release more than funding amount", async () => {
            var preBalance = await web3.eth.getBalance(exchangeAddress);
            await Utils.assertRevert(hf.release(PID1, exchangeAddress, web3.toWei(3),2, {from: root}))
            var postBalance = await web3.eth.getBalance(exchangeAddress);
            assert.equal(preBalance.toString() , postBalance.toString())
        }) 

        it("should NOT release more than funding amount", async () => {
            var preBalance = await web3.eth.getBalance(exchangeAddress);
            await Utils.assertRevert(hf.release(PID1, exchangeAddress, web3.toWei(3),3, {from: root}))
            var postBalance = await web3.eth.getBalance(exchangeAddress);
            assert.equal(preBalance.toString() , postBalance.toString())
        }) 

        //stop & retract money
        it("should NOT allow to retract", async () => {
            await Utils.assertRevert(hf.retract(PID1, 1, 1, {from: investor1}))
        }) 

        it("should allow to stop ", async () => {
            let tx1 = await hf.stopProject(PID1, {from: trader});
            assert.equal("STOP", Utils.b2s(Utils.oc(tx1, "__changeState", "to")))
        }) 

        it("should allow to retract amount ", async () => {
            let tx1 = await hf.retract(PID1, 35, 100, {from: root});
            assert.equal("WITHDRAW", Utils.b2s(Utils.oc(tx1, "__changeState", "to")))
        }) 

        it("should allow to withdraw after retract", async () => {
            let tx2 = await hf.withdrawFund(PID1, {from: investor2});
            weiF = Utils.oc(tx2, "__withdraw", "withdrawAmount").toString();
            assert.equal('0.0105' , web3.fromWei(weiF, "ether"))

            let tx1 = await hf.withdrawFund(PID1, {from: investor1});
            weiF = Utils.oc(tx1, "__withdraw", "withdrawAmount").toString();
            assert.equal('0.35' , web3.fromWei(weiF, "ether"))
            // await getProjectInfo(PID1);
            // await getFunder(PID1)
        }) 

    })


})