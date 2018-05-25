pragma solidity ^0.4.2;
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';

contract CryptoArpeggio is ERC721Token{
  event UpdateUI();
  using SafeMath for uint256;
  string public name = 'CryptoArpeggio';
  string public symbol  = 'CARP';

  address admin;    

  constructor() ERC721Token(name_, symbol_) public {
    admin = msg.sender;
    name_ = name;
    symbol_ = symbol;
    newSeed(msg.sender, "0", "0", "0", 0, "0");
  } 

  struct CryptoSong {
    address _owner;
    string _pic;
    string _title; 
    string _artist;
    uint256 _price;
    string _data;  
    bool _forsale;
  }
    
  CryptoSong[] cryptoSongs;
    
  function newCryptoArpeggio(address _owner, uint256 seedId) external returns (uint256 songId) {  
    require(_owner != admin);
    CryptoSong memory cryptoSong = CryptoSong({
      _owner: _owner,
      _pic: cryptoSongs[seedId]._pic,
      _title: cryptoSongs[seedId]._title,
      _artist: cryptoSongs[seedId]._artist,
      _price: cryptoSongs[seedId]._price,
      _data: cryptoSongs[seedId]._data,
      _forsale: false
    });
    
    songId = cryptoSongs.push(cryptoSong) - 1;
    require(songId == uint256(uint32(songId)));
            
    ownedTokensCount[_owner]++;
    tokenOwner[songId] = _owner;
                
    emit Transfer(0, _owner, songId);
  }  
  
  function newSeed(address _owner, string _pic, string _title, string _artist, uint256 _price, string _data) public returns (uint256 songId) {  
    require(_owner == admin);      
    CryptoSong memory cryptoSong = CryptoSong({
      _owner: _owner,
      _pic: _pic,
      _title: _title,
      _artist: _artist,
      _price: _price,
      _data: _data,
      _forsale: true
    });
    songId = cryptoSongs.push(cryptoSong);
    require(songId == uint256(uint32(songId)));
            
    ownedTokensCount[_owner]++;
    tokenOwner[songId] = _owner;
  }  

  function getMusic(uint256 songId) public view returns (string _pic, string _title, string _artist, uint256 _price, string _data){
    if (cryptoSongs[songId]._owner == msg.sender){
      _pic = cryptoSongs[songId]._pic;
      _title = cryptoSongs[songId]._title;
      _artist = cryptoSongs[songId]._artist;
      _price = cryptoSongs[songId]._price;
      _data = cryptoSongs[songId]._data;
    }
  }

  function getDataOf(uint256 songId) public view returns (string _pic, string _title, string _artist, uint256 _price){
    if (cryptoSongs[songId]._owner == admin){
      _pic = cryptoSongs[songId]._pic;
      _title = cryptoSongs[songId]._title;
      _artist = cryptoSongs[songId]._artist;
      _price = cryptoSongs[songId]._price;
    }
  }
  
  function getSongPrice(uint256 songId) public view returns (uint256 _price){
    _price = cryptoSongs[songId]._price;
  }
  
  function totalSupply() public view returns (uint) {
        return cryptoSongs.length - 1;
  }

  function transfer(address _to, uint256 _songId) external {
    require(_to != address(0));
    require(_to != address(this));

    require(cryptoSongs[_songId]._owner == msg.sender);

    _transfer(msg.sender, _to, _songId);
  }
  
  function _transfer(address _from, address _to, uint256 _songId) internal {
    ownedTokensCount[_to]++;
    tokenOwner[_songId] = _to;
    cryptoSongs[_songId]._owner = _to;
    if (_from != address(0)) {
      ownedTokensCount[_from]--;
    }
    emit Transfer(_from, _to, _songId);
    emit UpdateUI();
  }
}
