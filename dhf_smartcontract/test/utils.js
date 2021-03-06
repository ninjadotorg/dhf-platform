var fs = require('fs')

module.exports = {
  // convert bytes32 to string
  b2s: function (b) {
    if (!b) return ''
    return web3.toAscii(b).replace(/\u0000/g, '')
  },

  // convert string to bytes32
  s2b: function (s) {
    return web3.fromAscii(s)
  },

  // convert an array of string to an array of bytes32
  s2ba: function (a) {
    return a.map(s => web3.fromAscii(s))
  },

  // convert an array of string to an array of bytes32
  b2sa: function (a) {
    return a.map(b => web3.toAscii(b).replace(/\u0000/g, ''))
  },

  // convert ether to wei
  e2w: function (e) {
    return web3.toWei(e)
  },

  // convert days to seconds
  d2s: function (d) {
    return d * 24 * 60 * 60
  },

  // convert years to seconds
  y2s: function (y) {
    return this.d2s(y * 365)
  },

  // get onchain data
  oc: function (tx, event, key) {
    try {
      return tx.logs.filter(log => log.event == event).map(log => log.args)[0][
        key
      ]
    } catch (err) {}
    return null
  },

  // print onchain data to the console
  poc: function (tx, event, key) {
    console.log(
      tx.logs.filter(log => log.event == event).map(log => log.args)[0][key]
    )
  },

  // print onchain data to the console
  paoc: function (tx) {
    tx.logs.map(log => console.log(log.event, log.args))
  },

  // get the instance of a contract with *name* at a specific deployed *address*
  ca: function (name, address) {
    return web3.eth
      .contract(
        JSON.parse(
          fs.readFileSync('build/contracts/' + name + '.json').toString()
        ).abi
      )
      .at(address)
  },

  increaseTime: function (seconds) {
    web3.currentProvider.send({
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      params: [seconds],
      id: 0
    })
  },

  assertRevert: async function (promise) {
    try {
      await promise
      assert.fail('Expected revert not received')
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0
      assert(revertFound, `Expected "revert", got ${error} instead`)
    }
  },

  eBalance: function (acc) {
    return web3.fromWei(web3.eth.getBalance(acc), 'ether').toNumber()
  },

  balance: function (acc) {
    return web3.eth.getBalance(acc).toNumber()
  },

  latestTime: function () {
    return web3.eth.getBlock('latest').timestamp
  },

  increaseTimeTo: function (target) {
    let now = this.latestTime()
    if (target < now) {
      throw Error(
        `Cannot increase current time(${now}) to a moment in the past(${target})`
      )
    }
    let diff = target - now
    this.increaseTime(diff)
  },

  getProjectInfo: async function (hf, PID1) {
    let r = await hf.getProjectInfo(PID1)
    let i = 0
    var owner = r[i++].toString()
    var target = web3.fromWei(r[i++].toString(), 'ether')
    var max = web3.fromWei(r[i++].toString(), 'ether')
    var fundingAmount = web3.fromWei(r[i++].toString(), 'ether')
    var availableAmount = web3.fromWei(r[i++].toString(), 'ether')
    var releasedAmount = web3.fromWei(r[i++].toString(), 'ether')
    var retractAmount = web3.fromWei(r[i++].toString(), 'ether')

    var startTime = r[i++].toString()
    var deadline = r[i++].toString()
    var lifeTime = r[i++].toString()
    var state = r[i++].toString()
    var numFunder = r[i++].toString()
    console.log({
      owner,
      target,
      max,
      fundingAmount,
      availableAmount,
      releasedAmount,
      retractAmount,
      startTime,
      deadline,
      lifeTime,
      state,
      numFunder
    })
  },

  getFunder: async function (hf, PID1) {
    let _a = await hf.getFunders(PID1)
    let _t = {}
    for (var i in _a) {
      if (!_t[_a[i]]) {
        _t[_a[i]] = 1
        let f = web3.fromWei(
          (await hf.getFundAmount(PID1, _a[i])).toString(),
          'ether'
        )
        let w = web3.fromWei(
          (await hf.getWithdrawAmount(PID1, _a[i])).toString(),
          'ether'
        )
        console.log(_a[i], f, w)
      }
    }
  }
}
