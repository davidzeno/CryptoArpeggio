var ArpeggioTokenSale = artifacts.require("./ArpeggioTokenSale.sol");
var CryptoArpeggio = artifacts.require("./CryptoArpeggio.sol");

module.exports = function(deployer) {
   deployer.deploy(CryptoArpeggio).then(function() {
      return deployer.deploy(ArpeggioTokenSale, CryptoArpeggio.address);
  });
};
