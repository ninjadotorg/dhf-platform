var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var BaseAPI = require("./base");

//set schema
const connection = __Config.PlatformDB
const ModelName = "funding";
var schema = {
    funder: {type: String, index: true},
    projectId: {type: String},
};

//set indexing
class DBAccessAPI extends BaseAPI {
  constructor(model, ModelName, endpoint) {
    super(model, ModelName, endpoint);
    // this.schema.index({blockNumber: 1, logIndex: 1}, {unique: true})
  }
}

exports = module.exports = new DBAccessAPI(schema, ModelName, connection);
