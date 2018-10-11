var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var BaseAPI = require("./base");

//set schema
const connection = __Config.SmartContractDB
const ModelName = "EventLog";
var schema = {
    txid: {type: String, index: true},
    blockNumber: {type: Number},
    logIndex: {type: Number},
    projectID: {type: String, index: true},
    eventName: {type: String, index: true},
    params: {type: Schema.Types.Mixed},
    address: {type: String, index: true},
    getTransaction: {type: Boolean, index: true}
};

//set indexing
class DBAccessAPI extends BaseAPI {
  constructor(model, ModelName, endpoint) {
    super(model, ModelName, endpoint);
    this.schema.index({blockNumber: 1, logIndex: 1}, {unique: true})
  }
}

exports = module.exports = new DBAccessAPI(schema, ModelName, connection);
