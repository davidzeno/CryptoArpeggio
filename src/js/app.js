App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  balance: 0,
  loading: false,
  admin: '',
  contractNetworkID: '1526493421692',
  contractNetworkName: 'http://localhost:8545',
  available: '',
  myMusic: '',
  totalSongs: 0,
  totalSupply: 0,
  
  init: function() {
    $('#ico').hide();
    $('#transfer').hide();
    $('#services').hide();
    
    return App.initWeb3();
  },
  
  showDiv: function(div) {   
    var accountInterval = setInterval(function() {
      if (typeof web3 !== 'undefined') {
	web3.eth.getCoinbase(function(err, account) {
	  if(err === null) {
	    
	    if (account !== null){
	      if (App.account !== account){
		App.account = account;
		return App.initWeb3();
	      }
	    }  
	    else {
	      if (App.account !== account){
		App.account = account;
		  return App.initWeb3();
	      }
	    }
	  }
	})
      } else clearInterval(accountInterval);
    }, 100);

    switch(div) {
      case 'loader':
	$('.loaders').html("Loading...");
	$('#content').hide();
	$('#noMetaMaskDiv').hide();
	$('#signMetaMaskDiv').hide();
	$('#switchNetworkDiv').hide();
	$('#noContractDiv').hide();
	$('#sellmusic').hide();
	break;
      case 'content':	
	$('.loaders').html("&nbsp;");
	$('#content').show();
	$('#noMetaMaskDiv').hide();
	$('#signMetaMaskDiv').hide();
	$('#switchNetworkDiv').hide();
	$('#noContractDiv').hide();
	if(App.admin !== App.account){
	  $('#sellmusic').hide();
	  $('#ownedmusic').show();	  
	}
	else { 
	  $('#sellmusic').show();	  
	  $('#ownedmusic').hide();
	}
	break;
      case 'noMetaMaskDiv':
	$('.loaders').html("&nbsp;");
	$('#content').hide();
	$('#noMetaMaskDiv').show();
	$('#signMetaMaskDiv').hide();
	$('#switchNetworkDiv').hide();
	$('#noContractDiv').hide();
	$('#sellmusic').hide();
	break;
      case 'signMetaMaskDiv':
	$('.loaders').html("&nbsp;");
	$('#content').hide();
	$('#noMetaMaskDiv').hide();
	$('#signMetaMaskDiv').show();
	$('#switchNetworkDiv').hide();
	$('#noContractDiv').hide();
	$('#sellmusic').hide();
	break;
      case 'switchNetworkDiv':
	$('.loaders').html("&nbsp;");
	$('#content').hide();
	$('#noMetaMaskDiv').hide();
	$('#signMetaMaskDiv').hide();
	$('#switchNetworkDiv').show();
	$('#noContractDiv').hide();
	$('#sellmusic').hide();
	break;
      case 'noContractDiv':
	$('.loaders').html("&nbsp;");
	$('#content').hide();
	$('#noMetaMaskDiv').hide();
	$('#signMetaMaskDiv').hide();
	$('#switchNetworkDiv').hide();
	$('#noContractDiv').show();
	$('#sellmusic').hide();
	break;
      default:
	console.log("default");
    }
  },
      
  initWeb3: function() {
//     App.myMusic = "";
//     $('.myMusic').html(App.myMusic)


    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
      App.showDiv("loader");
      web3.eth.getCoinbase(function(err, account) {
	if(err === null) {
	  App.account = account;
	  if (App.account !== null){
	    $('.contractNetwork').html(App.contractNetworkName);
	    web3.version.getNetwork((err, netId) => {
// 	      console.log("netId=" + netId);
	      switch (netId) {
		case "1":
		  $('.currentNetwork').html("Main Ethereum Network");
		  App.showDiv("switchNetworkDiv");
		  break
		case "2":
		  $('.currentNetwork').html("Deprecated Morden test Network");
		  App.showDiv("switchNetworkDiv");
		  break
		case "3":
		  $('.currentNetwork').html("Ropsten Test Network");
		  App.showDiv("switchNetworkDiv");
		  break
		case "4":
		  $('.currentNetwork').html("Rinkeby Test Network");		  
		  App.showDiv("switchNetworkDiv");
		  break
		case "42":
		  $('.currentNetwork').html("Kovan Test Network");		  
		  App.showDiv("switchNetworkDiv");
		  break
		default:
		  $('.currentNetwork').html("Unknown Test Network");		  
		  return App.initContract();
	      }

	
// 	      if (0)
// 	      if (netId !== App.contractNetworkID)
// 		App.showDiv("switchNetworkDiv");
// 	      else 
// 		return App.initContract();	    
	    })
	  }
	  else
	    App.showDiv("signMetaMaskDiv");	    
	}
      })
    } else {  // if MetaMask is not installed    
      App.showDiv("noMetaMaskDiv");
      return;
    }     
    
  },
  
  initContract: function() {
    $.getJSON("ArpeggioTokenSale.json", function(ArpeggioTokenSale) {
      App.contracts.ArpeggioTokenSale = TruffleContract(ArpeggioTokenSale);
      App.contracts.ArpeggioTokenSale.setProvider(App.web3Provider);
      App.contracts.ArpeggioTokenSale.deployed().then(function(ArpeggioTokenSale) {
	$('.tokensaleaddress').html(ArpeggioTokenSale.address);
      }).catch(function(err) {
	console.log(err);
	  App.showDiv("noContractDiv");
      });
    });

    $.getJSON('CryptoArpeggio.json', function(ArpeggioToken) {
      App.contracts.ArpeggioToken = TruffleContract(ArpeggioToken);
      App.contracts.ArpeggioToken.setProvider(App.web3Provider);
      App.contracts.ArpeggioToken.deployed().then(function(ArpeggioToken) {
	$('.tokenaddress').html(ArpeggioToken.address);
// 	App.listenForEvents();
	App.listenForLog();
	App.listenForValue();
	App.UpdateUI();
	return App.render();
	
      }).catch(function(err) {
	  console.log(err);
	  App.showDiv("noContractDiv");
      });      
    });
  },
	      
  // Listen for events emitted from the contract

  UpdateUI: function() {
    App.contracts.ArpeggioTokenSale.deployed().then(function(ArpeggioTokenSale) {
      ArpeggioTokenSale.UpdateUI().watch(function(error, event) {
	App.render();
      })
    }).catch(function(err) {
      console.log(err);
      App.showDiv("noContractDiv");
      return;
    })
  },

//   listenForEvents: function() {
//     App.contracts.ArpeggioTokenSale.deployed().then(function(ArpeggioTokenSale) {
//       ArpeggioTokenSale.Sell({}, {
//         fromBlock: 0,
//         toBlock: 'latest',
//       }).watch(function(error, event) {
//         console.log("event triggered", event);
//         App.render();
//       })
//     }).catch(function(err) {
//       App.showDiv("noContractDiv");
//       return;
//     })
//   },
      
  listenForLog: function() {
    App.contracts.ArpeggioTokenSale.deployed().then(function(ArpeggioTokenSale) {
      ArpeggioTokenSale.test_value().watch(function(error, event) {
        console.log("Log", event);
      })
    }).catch(function(err) {
      return;
    })
  },

  listenForValue: function() {
    App.contracts.ArpeggioToken.deployed().then(function(ArpeggioToken) {
      ArpeggioToken.UpdateUI().watch(function(error, event) {
        console.log("UpdateUI", event);
      })
    }).catch(function(err) {
      return;
    })
  },
  
  play: function(data) {
    window.open(data);
  },

  transfer: function(data) {
    $('.transferInput_' + data).html("<br><br><input id=\"TransferAddress_" + data + "\" class=\"form-control\" type=\"text\" placeholder=\"Please type a VALID recipient address\" /><button onclick=\"javascript:App.handleTransfer('" + data + "');\" class=\"btn btn-primary\">Transfer</button>");	
    $('#t_' + data).hide();
  },

  _transfer: function(data) {
    address = $('#TransferAddress_' + data).val();
    console.log("transfer: CryptoArpeggio[" + data + "] to address: " + address);        
  },
  
  getMusic: function (songId) { 
    App.contracts.ArpeggioToken.deployed().then(function(instance) {
      return instance.getMusic(songId, {from: App.account});
    }).then(function(data) {
	console.log("music: [" + songId + "]: " + data);
      if (data[0] !== "" && data[1] !== "" && data[2] !== "" && data[3] !== 0 && data[4] !== ""){
	App.myMusic = App.myMusic + "<li><img src=\"" + data[0] + "\" height=\"133\" width=\"133\"><br>" + data[1] + "<br>" + data[2] + "<br>MP3 Music<br><button onclick=\"javascript:App.play('" + data[4] + "');\" class=\"btn btn-primary\">Play</button> <span class=\"transferInput_" + songId + "\"></span><button id=\"t_" + songId + "\" onclick=\"javascript:App.transfer('" + songId + "');\" class=\"btn btn-primary\">Transfer</button><hr><br></li>";      
	$('.myMusic').html(App.myMusic);	      	
      }
    }).catch(function(err) {
      return;
    });
  },

  getDataOf: function (songId) { 
    App.contracts.ArpeggioToken.deployed().then(function(instance) {
      return instance.getDataOf(songId);
    }).then(function(data) {
	console.log("available [" + songId + "]: " + data);
      if (data[0] !== "" && data[1] !== "" && data[2] !== "" && data[3] !== 0){
	App.available = App.available + "<li><img src=\"" + data[0] + "\" height=\"133\" width=\"133\"><br>" + data[1] + "<br>" + data[2] + "<br>MP3 Music<br><button onclick=\"_tokenSeed=" + songId + ";_tokenPrice=" + data[3]/1000000000000000000 + "\" type=\"submit\" class=\"btn btn-primary\">Ξ " + data[3]/1000000000000000000 + "</button><hr><br></li>";
	$('.available').html(App.available);
      }
    }).catch(function(err) {
      return;
    });
  },

  render: function() {  
    if (App.loading) {
      return;
    }

    App.loading = true;
    App.showDiv("loader");

    if(App.account !== null)
      $('.APGAccount').html(App.account);
    else {
      App.showDiv("signMetaMaskDiv");
      return;
    }

    App.contracts.ArpeggioTokenSale.deployed().then(function(instance) {
      ArpeggioTokenSaleInstance = instance;   
      return ArpeggioTokenSaleInstance.admin();	 
    }).then(function(admin) {
      App.admin = admin;

//       return ArpeggioTokenSaleInstance.tokenPrice();
//     }).then(function(tokenPrice) {
//       App.tokenPrice = tokenPrice;
//       $('.token-price').html(web3.fromWei(App.tokenPrice, "ether").toNumber());


//       return ArpeggioTokenSaleInstance.tokensSold();
//     }).then(function(tokensSold) {
//       App.tokensSold = tokensSold.toNumber();
// 
//       $('.tokens-sold').html(App.tokensSold.toLocaleString('en'));
//       $('.tokens-available').html(App.tokensAvailable.toLocaleString('en'));

//       var progressPercent = (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
//        $('#progress').css('width', progressPercent + '%');

      // Load token contract
      App.contracts.ArpeggioToken.deployed().then(function(instance) {
        ArpeggioTokenInstance = instance;			

	
	return ArpeggioTokenInstance.totalSupply();
      }).then(function(totalSupply) {
	App.totalSupply = totalSupply.toNumber();
	console.log("totalSupply: " + App.totalSupply);

	
	return ArpeggioTokenInstance.balanceOf(App.admin);
      }).then(function(totalSongs) {
	App.totalSongs = totalSongs.toNumber() - 1;
	console.log("totalSongs: " + App.totalSongs);
        $('.AdminBalance').html(App.totalSongs);
				
	App.available = "";
	$('.available').html(App.available);
	for (songId = 1; songId <= App.totalSupply; songId++) {	  
	  App.getDataOf(songId);	
	}
	return ArpeggioTokenInstance.balanceOf(App.account);
      }).then(function(balance) {
	balance = balance.toNumber();
	
	if(App.admin === App.account){	  
	  
	  $('.manage').html("<button onclick=\"javascript:location.href='#music'\" class=\"btn btn-primary\">Manage</button>");
	  $('.admin').html("(Smart Contract Owner)");
	  balance--;
	}
	else {
	  $('.admin').html("");	
	  $('.manage').html("<button onclick=\"javascript:location.href='#ownedmusic'\" class=\"btn btn-primary\">Manage</button>");
	}
	App.balance = balance;
	
        $('.APGBalance').html(App.balance);
	
	
	App.myMusic = "";
	$('.myMusic').html(App.myMusic)
	if(App.admin != App.account && App.balance != 0){	  
	  for (songId = 1; songId <= App.totalSupply; songId++) {	
	    App.getMusic(songId);	
	  }
	}

	App.loading = false;
	App.showDiv("content");
	console.log()
      }).catch(function(err) {
	console.log(err);

	App.showDiv("noContractDiv");
	return;
      })
    }).catch(function(err) {
	console.log(err);
	App.showDiv("noContractDiv");	
	return;
      });  
  },
      
  createSeedToken: function() {
    App.showDiv("loader");      

    if(App.admin == App.account){
      $('.loaders').html("Creating new CryptoArpeggio for sale, please wait...");

      var _pic = $('#_pic').val();
      var _title = $('#_title').val();
      var _artist = $('#_artist').val();
      var _price = $('#_price').val();
      var _data = $('#_data').val();
      
      var newSeed = "<li><img src=\"" + _pic + "\" height=\"133\" width=\"133\"><br>" + _title + "<br>" + _artist + "<br>MP3 Music<br><button onclick=\"_tokenSeed=1;_tokenPrice=" + _price + "\" type=\"submit\" class=\"btn btn-primary\">Ξ " + _price + "</button><hr><br></li>";

      App.contracts.ArpeggioTokenSale.deployed().then(function(instance) {
	return instance.sellMusic(_pic, _title, _artist, _price*1000000000000000000, _data/*, {
	  from: App.account,
	  value: web3.toWei(0, 'ether'),
	  gas: 500000,
	  gasPrice: web3.toWei(1,'gwei')
	}*/);
      }).then(function(result) {
	$('.loaders').html("Request sent.<br>Wait for response...");
	$('form').trigger('reset') // reset number of tokens in form
      }).catch(function(err) {
	err = err + "";
	if (err.includes("User denied transaction signature."))
	  console.log("User denied transaction signature.");
	else
	  console.log("error: " + err);
	App.render();
      });      
    }
    else {
      $('.loaders').html("Not Admin account!");
      alert("Only Smart Contract account is allowed to create new CryptoArpeggio for sale.");
      App.showDiv("content");
    }
  },
  
  buyMusic: function() {
    App.showDiv("loader");
    if(App.admin !== App.account){
      $('.loaders').html("Purchasing CryptoArpeggio, please wait...");
      App.contracts.ArpeggioTokenSale.deployed().then(function(instance) {	
	return instance.buyMusic(_tokenSeed, {
	  from: App.account,
	  value: web3.toWei(_tokenPrice, 'ether'),
	  gas: 500000,
	  gasPrice: web3.toWei(1,'gwei')
	});
      }).then(function(result) {
	$('.loaders').html("Request sent.<br>Wait for response...");
	$('form').trigger('reset') // reset number of tokens in form
	// Wait for Sell event
      }).catch(function(err) {
	err = err + "";
	if (err.includes("User denied transaction signature."))
	  console.log("User denied transaction signature.");
	else
	  console.log("error: " + err);	
	App.render();
      });
    }
    else {
      $('.loaders').html("Admin account!");
      alert("Smart Contract account not allowed to buy CryptoArpeggios.");
      	App.showDiv("content");
    }      
  },

  handleTransfer: function(songId) {
    App.showDiv("loader");
    var amount = parseInt($('#APGTransferAmount').val());
    var _to = $('#TransferAddress_' + songId).val();
    console.log("_to: " + _to);
    $('.loaders').html("Transfering CryptoArpeggio, please wait...");
    App.contracts.ArpeggioToken.deployed().then(function(instance) {
      return instance.transfer(_to, songId, {from: App.account});
    }).then(function(result) {
      $('.loaders').html("Request sent.<br>Wait for response...");
    }).catch(function(err) {
	err = err + "";
	if (err.includes("User denied transaction signature."))
	  console.log("User denied transaction signature.");
	else
	  console.log("error: " + err);	
	App.render();
    });    
  },  
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
