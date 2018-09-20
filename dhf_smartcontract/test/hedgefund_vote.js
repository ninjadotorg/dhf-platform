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
        console.log(Utils.b2s("0x5f00000000000000000000000000000000000000000000000000000000000000,"))
    })

    describe("Voting at APPROVE state", () => {
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

        //invest reach target
        it("should change to READY state if fund reach target", async () => {
            let tx1 = await hf.fundProject(PID1, {from: investor1, value: web3.toWei(0.5)});
            assert.equal("READY", Utils.b2s(Utils.oc(tx1, "__changeState", "to")))
            let tx2 = await hf.fundProject(PID1, {from: investor2, value: web3.toWei(0.02)});
            assert.equal(web3.toWei(0.02), Utils.oc(tx2, "__funding", "amount"))
        })  

        it("should allow to vote in READY state", async () => {
            let tx1 = await hf.voteStop(PID1, 1, {from: investor1})
            assert.equal(Utils.b2s(Utils.oc(tx1, "__changeState", "to")), "WITHDRAW")
            await getFunder(PID1) 
            await getProjectInfo(PID1)
        }) 

        

    })


})