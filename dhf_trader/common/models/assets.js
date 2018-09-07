var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var Asset   = new Schema({
    asset: {type: String, index: true},
    project: {type: String, index: true},
    amount: {type: Number, index: true},
    account: {type: String, index: true},
});

Asset.set('autoIndex', true);
Asset.index({})

const connection = mongoose.createConnection(__Config.AssetDB);
var DBModel = connection.model('Asset', Asset);
exports = module.exports = DBModel

// =================== =====================//
// =================== =====================//
// =================== =====================//

DBModel.getTotalAmount =  async function(project, cur){
    let result = await this.aggregate([{
        $match: { project: project, currency: cur}
    }, {
       $group: { _id: null, sum: { $sum: "$amount" }}
    }])
    if (result.length==0) return 0
    return result[0].sum
}