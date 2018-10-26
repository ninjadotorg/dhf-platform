require('../config')

const Web3 = require('web3')
const axios = require('axios')
const EventLog = require('../common/models/event')
var eventArray = {}

async function start (version) {
  let contractInfoUrl = __Config.ContractInfo.replace('[version]', version)
  let ContractInfo = (await axios.get(contractInfoUrl)).data
  version = ContractInfo.version
  require('./updateProject')(version)
  var web3 = new Web3(new Web3.providers.HttpProvider(ContractInfo.network))
  let contract = new web3.eth.Contract(ContractInfo.abi, ContractInfo.address)

  contract._jsonInterface.map(o => {
    if (o.type === 'event') {
      eventArray[o.name] = o
    }
  })

  let latestEvent = await EventLog.model
    .findOne({ version: version })
    .sort({ blockNumber: -1 })
  let lastBlockNumber = latestEvent ? latestEvent.blockNumber : 0
  console.log('get from last block: ', lastBlockNumber)

  contract
    .getPastEvents('allEvents', {
      fromBlock: lastBlockNumber,
      toBlock: 'latest'
    })
    .then(function (events) {
      events = events.sort((a, b) => {
        return a.blockNumber - b.blockNumber
      })
      events.map(e => saveEvent(e, false))

      setTimeout(start, 5000, version)
    })

  function saveEvent (event, changed) {
    let { address, blockNumber, logIndex } = event

    var data = {
      address,
      blockNumber,
      logIndex,
      eventName: event.event,
      txid: event.transactionHash,
      $setOnInsert: {
        getTransaction: false
      }
    }

    if (changed) {
      delete data['$setOnInsert']
      data.getTransaction = false
    }

    let names = eventArray[event.event].inputs.map(o => ({
      name: o.name,
      type: o.type
    }))

    let decode = web3.eth.abi.decodeLog(
      eventArray[event.event].inputs,
      event.raw.data,
      event.raw.topics
    )
    var objs = {}
    for (var i in names) {
      if (
        names[i].type === 'bytes32' &&
        names[i].name != 'pid' &&
        names[i].name != 'stage'
      ) {
        objs[names[i].name] = web3.utils.toAscii(decode[names[i].name]).trim()
        console.log(
          'convert',
          names[i].type,
          names[i].name,
          objs[names[i].name],
          objs[names[i].name].length
        )
      } else objs[names[i].name] = decode[names[i].name].trim()
    }

    data.params = objs
    data.projectID = objs.pid
    data.version = version
    EventLog.updateUpsert({ blockNumber, logIndex }, data)
  }
}

module.exports = start
