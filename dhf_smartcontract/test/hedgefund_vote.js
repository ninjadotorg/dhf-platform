const HedgeFund = artifacts.require('HedgeFund')
const Utils = require('./utils')

contract('HedgeFund', accounts => {
  const root = accounts[0]
  const trader = accounts[1]
  const investor1 = accounts[2]
  const investor2 = accounts[3]
  const exchangeAddress = accounts[5]

  let hf = null

  let PID1 = 'project_' + new Date().getTime()

  console.log('trader: ', trader)
  console.log('investor1: ', investor1)
  console.log('investor2: ', investor2)
  console.log('PID1: ', PID1)
  
  before(async () => {
    hf = await HedgeFund.deployed()
    console.log("Smart contract: " + hf.address)
  })

  describe('Voting at APPROVE state', () => {
    it('should allow them to init fund by them self', async () => {
      let target = web3.toWei(0.5)
      let max = web3.toWei(1)
      let deadline = Math.floor(new Date().getTime() / 1000) + 60 * 60
      let lifeTime = 3
      let owner = trader
      let commission = 5;
      let tx1 = await hf.initProject(target, max, deadline, lifeTime, commission, PID1, {
        from: owner
      })
      assert.equal(PID1, Utils.b2s(Utils.oc(tx1, '__init', 'pid')))
      assert.equal(1, Utils.oc(tx1, '__changeState', 'to'))
    })

    it('should allow investor to invest fund to an exist project (within deadline)', async () => {
      let tx1 = await hf.fundProject(PID1, {
        from: investor1,
        value: web3.toWei(0.01)
      })
      assert.equal(web3.toWei(0.01), Utils.oc(tx1, '__funding', 'amount'))
      assert.equal(investor1, Utils.oc(tx1, '__funding', 'funder'))
      let tx2 = await hf.fundProject(PID1, {
        from: investor2,
        value: web3.toWei(0.01)
      })
    })

    // invest reach target
    it('should change to READY state if fund reach target', async () => {
      let tx1 = await hf.fundProject(PID1, {
        from: investor1,
        value: web3.toWei(0.5)
      })
      assert.equal(2, Utils.oc(tx1, '__changeState', 'to'))
      let tx2 = await hf.fundProject(PID1, {
        from: investor2,
        value: web3.toWei(0.02)
      })
      assert.equal(web3.toWei(0.02), Utils.oc(tx2, '__funding', 'amount'))
    })

    it('should allow to vote in READY state', async () => {
      let tx1 = await hf.voteStop(PID1, 1, { from: investor1 })
      assert.equal(5, Utils.oc(tx1, '__changeState', 'to'))
      await Utils.getFunder(hf, PID1)
      await Utils.getProjectInfo(hf, PID1)
    })
  })
})
