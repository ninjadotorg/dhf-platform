var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var BaseAPI = require("./base");

//set schema
const connection = __Config.ProjectDB
const ModelName = "project";
var schema = {
    "state": String,
    "owner": String,
    "target": String,
    "max": String,
    "commission": String,
    "withdrawFee": String,
    "fundingAmount": String,
    "availableAmount": String,
    "releasedAmount": String,
    "retractAmount": String,
    "startTime": String,
    "deadline": Date,
    "lifeTime": Number,
};

//set indexing
class DBAccessAPI extends BaseAPI {
  constructor(model, ModelName, endpoint) {
    super(model, ModelName, endpoint);
  }
}

exports = module.exports = new DBAccessAPI(schema, ModelName, connection);
