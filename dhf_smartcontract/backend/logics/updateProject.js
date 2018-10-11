require('../config')
const web3js = require('web3')
const HedgeFundAPI = require('../common/libs/HedgeFundAPI')
const EventLog = require('../common/models/event')
const Project = require('../common/models/project')
const client = new HedgeFundAPI('v2', false)

!(async function () {
  await client._init()
  start()
})()

function getState (n) {
  if (n == '0') return 'NEW'
  if (n == '1') return 'INITFUND'
  if (n == '2') return 'READY'
  if (n == '3') return 'RELEASE'
  if (n == '4') return 'STOP'
  if (n == '5') return 'WITHDRAW'
}

async function start () {
  let newEvent = await EventLog.model
    .findOne({ getTransaction: false })
    .sort({ blockNumber: -1 })
  // console.log(newEvent)

  let id = newEvent.projectID.replace(/^0x/, '')

  let r = await client.getProjectInfo(newEvent.projectID)

  let {
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
    state
  } = r

  target = web3js.utils.fromWei(target, 'ether')
  max = web3js.utils.fromWei(max, 'ether')
  fundingAmount = web3js.utils.fromWei(fundingAmount, 'ether')
  availableAmount = web3js.utils.fromWei(availableAmount, 'ether')
  releasedAmount = web3js.utils.fromWei(releasedAmount, 'ether')
  retractAmount = web3js.utils.fromWei(retractAmount, 'ether')
  startTime = new Date(startTime * 1000)
  deadline = new Date(deadline * 1000)
  lifeTime = lifeTime / (24 * 60 * 60)
  state = getState(state)

  // console.log(newEvent.projectID, {owner, target, max, fundingAmount, availableAmount,
  // releasedAmount, retractAmount, startTime, deadline ,lifeTime, state})

  let project = await Project.update(id, {
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
    state
  })
  console.log(project)

  await EventLog.update({ _id: newEvent._id }, { getTransaction: true })
}
