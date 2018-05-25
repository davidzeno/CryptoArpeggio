pragma solidity ^0.4.2;
import "./CryptoArpeggio.sol";

contract ArpeggioTokenSale {
  event UpdateUI();
  event test_value(address sender, uint256 value1, uint256 value2);
    
  address public admin;
  CryptoArpeggio public CryptoArpeggioContract;
    
  constructor(CryptoArpeggio _cryptoArpeggioContract) public {
    admin = msg.sender;
    CryptoArpeggioContract = _cryptoArpeggioContract;
  }
            
  function buyMusic(uint256 songId) public payable {       
    require(msg.value == CryptoArpeggioContract.getSongPrice(songId));
    require(CryptoArpeggioContract.newCryptoArpeggio(msg.sender, songId) != 0);

    admin.transfer(msg.value);
    emit UpdateUI();
  }

  function sellMusic(string _pic, string _title, string _artist, uint256 _price, string _data) public {       
    require(msg.sender == admin);  
    require(CryptoArpeggioContract.newSeed(msg.sender, _pic, _title, _artist, _price, _data) != 0);
    emit UpdateUI();
  }
} 
