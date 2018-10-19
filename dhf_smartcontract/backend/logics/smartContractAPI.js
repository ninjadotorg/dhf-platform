require('../config')
const HedgeFundAPI = require('../common/libs/HedgeFundAPI')

module.exports = {
  stop: function (req, res) {},
  release: async function (req, res) {
    let depositAddress = req.body.depositAddress
    let amount = req.body.amount
    let project = req.body.project
    let stage = req.body.stage
    let version = req.params.version
    console.log({ version, project, depositAddress, stage, amount })

    var smAPI = new HedgeFundAPI(version, false)

    let tx = await smAPI.release(
      __Config.PrivateKey,
      project,
      depositAddress,
      amount,
      stage
    )

    try {
      await tx.estimateGas()
      tx
        .run()
        .on('transactionHash', function (hash) {
          console.log('tx hash:', hash)
          res.json({ tx: hash })
        })
        .on('error', function (err) {
          console.log(err)
          res.status(500)
          res.json({ tx: null, msg: 'Cannot create transaction' })
        })
    } catch (err) {
      res.status(500)
      res.json({ tx: null, msg: 'Cannot create transaction' })
    }
  },
  retract: function (req, res) {}
}
