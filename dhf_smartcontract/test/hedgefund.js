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
    

    async function getHedgeFundProject(pid){
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
        console.log({owner, target, max, fundingAmount, updatedAmmount, releasedAmount, startTime, deadline, lifeTime})
    }

    before(async ()=>{
        hf = await HedgeFund.deployed()
    })

    describe("Basic scenario 1", () => {
        it("should allow them to init fund by them self", async ()=>{
            
            

            let target = web3.toWei(0.5);
            let max = web3.toWei(1);
            let deadline = Math.floor(new Date().getTime()/1000) + 60*60;
            let lifeTime = 3;
            let owner = trader;
            let tx1 = await hf.initProject(target, max, deadline, lifeTime, owner, PID1, {from: owner});
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
            await Utils.assertRevert(hf.release(PID1, exchangeAddress, web3.toWei(0.01), {from: root}))
        }) 


        //invest reach target
        it("should change to APPROVED state if fund reach target", async () => {
            let tx1 = await hf.fundProject(PID1, {from: investor1, value: web3.toWei(0.5)});
            assert.equal("APPROVED", Utils.b2s(Utils.oc(tx1, "__changeState", "to")))
            let tx2 = await hf.fundProject(PID1, {from: investor2, value: web3.toWei(0.02)});
            assert.equal(web3.toWei(0.02), Utils.oc(tx2, "__funding", "amount"))
        })  

        it("should NOT allow investor to withdraw fund if project is in APPROVED state", async () => {
            await Utils.assertRevert(hf.withdrawFund(PID1, {from: investor1}))
        }) 

        //invest reach max
        it("should change to READY state if fund reach max", async () => {
            let tx1 = await hf.fundProject(PID1, {from: investor1, value: web3.toWei(0.5)});
            assert.equal("READY", Utils.b2s(Utils.oc(tx1, "__changeState", "to")))
        })  
        
        it("should NOT allow investor to fund or withdraw fund if project is in READY state", async () => {
            await Utils.assertRevert(hf.fundProject(PID1, {from: investor1, value: web3.toWei(0.01)}))
            await Utils.assertRevert(hf.withdrawFund(PID1, {from: investor1}))
        }) 

        //release money
        it("should release if project is in READY state", async () => {
            var preBalance = await web3.eth.getBalance(exchangeAddress);
            let tx1 = await hf.release(PID1, exchangeAddress, web3.toWei(0.01), {from: root})
            assert.equal("RELEASE", Utils.b2s(Utils.oc(tx1, "__changeState", "to")))
            var postBalance = await web3.eth.getBalance(exchangeAddress);
            assert.equal(preBalance.plus(web3.toWei(0.01)).toString() , postBalance.toString())
        }) 

        it("should NOT release more than funding amount", async () => {
            var preBalance = await web3.eth.getBalance(exchangeAddress);
            await Utils.assertRevert(hf.release(PID1, exchangeAddress, web3.toWei(3), {from: root}))
            var postBalance = await web3.eth.getBalance(exchangeAddress);
            assert.equal(preBalance.toString() , postBalance.toString())
        }) 

        it("should NOT release more than funding amount", async () => {
            var preBalance = await web3.eth.getBalance(exchangeAddress);
            await Utils.assertRevert(hf.release(PID1, exchangeAddress, web3.toWei(3), {from: root}))
            var postBalance = await web3.eth.getBalance(exchangeAddress);
            assert.equal(preBalance.toString() , postBalance.toString())

            await getHedgeFundProject(PID1)
        }) 




    })


})