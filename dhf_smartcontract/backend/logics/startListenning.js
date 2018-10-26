require("../config")
const versions = __Config.Versions
const SyncEvent = require("./syncEvent")

versions.forEach(v => {
    SyncEvent(v)
})

process.on('unhandledRejection', r => {
    console.log('unhandledRejection', new Date(), r)
})