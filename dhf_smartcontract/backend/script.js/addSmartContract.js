require("../configuration")
let SmartContractDB = require("../models/smartcontract_version")

var newSM = new SmartContractDB({
    address: "",
    createTime: new Date(),
    owner: "",
    abi: [],
    version: "v2"
})

newSM.save()