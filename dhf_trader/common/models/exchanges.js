var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Exchange = new Schema({
  name: { type: String, index: true },
  email: { type: String, index: true },
  account: { type: String, index: true },
  password: { type: String },

  type: { type: String, index: true, default: 'single' }, // single | share

  permission: { type: String, index: true, default: 'trade' }, // trade | withdraw
  key: { type: String },
  secret: { type: String },

  readPermCred: {
    key: String,
    secret: String
  },

  tradePermCred: {
    key: String,
    secret: String
  },

  isLock: { type: Boolean, index: true, default: false },
  lock: {
    project: String,
    time: Date
  }
})

Exchange.set('autoIndex', true)
Exchange.index({ exchange: 1, email: 1, role: 1 })
const connection = mongoose.createConnection(__Config.ExchangeDB)
var DBModel = connection.model('Exchange', Exchange)

//= ==================== ===========================//

DBModel.getAvailableAccounts = async function (exchange) {
  let results = await this.find({ name: exchange, isLock: false }).select({
    key: 0,
    secret: 0
  })
  return results
}

DBModel.getLockAccounts = async function (exchange) {
  let results = await this.find({ name: exchange, isLock: true }).select({
    key: 0,
    secret: 0
  })
  return results
}

DBModel.getProjectAccount = async function (project) {
  let lockAccount = await this.findOne({
    isLock: true,
    'lock.project': project
  })
  return lockAccount
}

DBModel.getOrSetProjectAccount = async function (project, exchange) {
  let lockAccount = await this.findOne({
    isLock: true,
    'lock.project': project
  }).lean()
  if (lockAccount) return lockAccount
  else {
    // get single type
    let getOne = await this.findOneAndUpdate(
      { name: exchange, isLock: false, type: 'single', permission: 'trade' },
      { isLock: true, 'lock.project': project, 'lock.time': new Date() },
      { new: true }
    ).lean()
    return getOne
  }
}

DBModel.unlockProjectAccount = async function (project) {
  return await this.findOneAndUpdate(
    { 'lock.project': project },
    { isLock: false },
    { new: true }
  ).select({ key: 0, secret: 0 })
}

exports = module.exports = DBModel
