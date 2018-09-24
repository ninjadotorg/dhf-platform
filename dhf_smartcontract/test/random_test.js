const HedgeFund = artifacts.require('HedgeFund')
const Utils = require('./utils')

contract('HedgeFund', function (accounts) {
  const root = accounts[0]
  const trader = accounts[1]
  const investor1 = accounts[2]
  const investor2 = accounts[3]
  const exchangeAddress = accounts[5]

  let hf = null





  
  let PID1 = 'project_' + new Date().getTime()

  console.log('root: ', root)
  console.log('trader: ', trader)
  console.log('investor1: ', investor1)
  console.log('investor2: ', investor2)
  console.log('PID1: ', PID1)

  console.log(root)
  console.log(trader)
  console.log(investor1)
  console.log(investor2)

  before(async () => {
    let r = await web3.eth.getBalance(
      '0xdb2501e6fb02840786055b75a3059543de54bc49'
    )
    console.log(r.toString())
  })

  describe('Basic scenario 1', () => {
    it('', async () => {
      await web3.eth.sendTransaction({
        to: '0xdb2501e6fb02840786055b75a3059543de54bc49',
        from: root,
        value: web3.toWei('5', 'ether')
      })
    })
  })
})
