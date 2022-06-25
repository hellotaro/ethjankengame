const JankenGame = artifacts.require("JankenGame");

module.exports = function (deployer) {
  deployer.deploy(JankenGame);
};
