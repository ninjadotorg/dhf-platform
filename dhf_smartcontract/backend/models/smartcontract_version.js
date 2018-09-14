var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SmartContract   = new Schema({
    version: {type: String, index: true},
    address: {type: String, index: true},
    abi: Schema.Types.Mixed,
    owner: {type: String, index: true},
    createdTime: {type: Date, index: true},
});

SmartContract.set('autoIndex', true);
SmartContract.index({})

const connection = mongoose.createConnection(__Config.SmartContractDB);
var DBModel = connection.model('SmartContract', SmartContract);
exports = module.exports = DBModel

DBModel.getVersionList = async function(){
    let result = await this.find({}).lean()
    return result
}

DBModel.getVersion = async function(version){
    let result = await this.findOne({version}).lean()
    return result
}