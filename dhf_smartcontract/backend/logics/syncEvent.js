require('../config')
require('./updateProject')
const Web3 = require('web3')
const axios = require('axios')
const EventLog = require('../common/models/event')

async function start () {
  let ContractInfo = (await axios.get(__Config.ContractInfo)).data
  var web3 = new Web3(
    new Web3.providers.WebsocketProvider(__Config.eth.network)
  )
  let contract = new web3.eth.Contract(ContractInfo.abi, ContractInfo.address)

  var eventArray = {}
  contract._jsonInterface.map(o => {
    if (o.type === 'event') {
      eventArray[o.name] = o
    }
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

    if (changed){
      delete data["$setOnInsert"]
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
      if (names[i].type === 'bytes32' && names[i].name != 'pid') {
        objs[names[i].name] = web3.utils.toAscii(decode[names[i].name]).trim()
        console.log('convert', objs[names[i].name], objs[names[i].name].length)
      } else objs[names[i].name] = decode[names[i].name].trim()
    }

    data.params = objs
    data.projectID = objs.pid
    EventLog.updateUpsert({ blockNumber, logIndex }, data)
  }
  
  try {
    contract
      .getPastEvents('allEvents', {
        fromBlock: 0,
        toBlock: 'latest'
      })
      .then(function (events) {
        events.map((e)=> saveEvent(e, false))
      })

    contract.events
      .allEvents({ fromBlock: 0 })
      .on('data', (e)=> saveEvent(e, false))
      .on('changed', (e)=> saveEvent(e, true))
      .on('error', (error)=>{
        console.log("error")
        console.log(error)
      })

  } catch (err) {
    console.log('catch error ', err)
  }
}

start()
process.on('unhandledRejection', r => {
  console.log("unhandledRejection", new Date())
  return start()
})
