var HedgeFund = artifacts.require("./HedgeFund.sol");

module.exports = function(deployer) {
  deployer.deploy(HedgeFund);
};
